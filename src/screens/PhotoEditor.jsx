import { useMemo, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import PressableScale from "../components/ui/PressableScale";
import { useAuth } from "../state/AuthContext";
import { processProfileImage } from "../services/profile-image";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

// Os callbacks de Gesture.Pan/Pinch rodam na UI thread como worklets. Tudo o que eles chamam de forma
// síncrona também precisa ser worklet; chamar uma função JS comum ali derruba o app no celular.
function clamp(value, min, max) {
  "worklet";
  return Math.min(max, Math.max(min, value));
}

// Limita o deslocamento para a imagem (ampliada por `zoom`) sempre cobrir o círculo: no máximo metade
// do excedente para cada lado. Math.max(0, …) evita limite invertido quando a imagem tem o tamanho exato.
function limitOffset(offset, size, zoom, viewport) {
  "worklet";
  const max = Math.max(0, (size * zoom - viewport) / 2);
  return clamp(offset, -max, max);
}

export default function PhotoEditor({ navigation, route }) {
  const asset = route.params?.asset;
  const { uploadPhoto } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const viewport = Math.min(windowWidth - spacing.xxl, 360);
  const sourceWidth = Number(asset?.width) || 1;
  const sourceHeight = Number(asset?.height) || 1;
  const baseScale = Math.max(viewport / sourceWidth, viewport / sourceHeight);
  const baseWidth = sourceWidth * baseScale;
  const baseHeight = sourceHeight * baseScale;
  const zoom = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startZoom = useSharedValue(1);
  const [zoomLabel, setZoomLabel] = useState(100);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Só worklets e shared values dentro dos callbacks; o rótulo de zoom (estado React) volta pela runOnJS.
  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onBegin(() => { startX.set(translateX.get()); startY.set(translateY.get()); })
      .onUpdate((event) => {
        const currentZoom = zoom.get();
        translateX.set(limitOffset(startX.get() + event.translationX, baseWidth, currentZoom, viewport));
        translateY.set(limitOffset(startY.get() + event.translationY, baseHeight, currentZoom, viewport));
      });
    const pinch = Gesture.Pinch()
      .onBegin(() => { startZoom.set(zoom.get()); })
      .onUpdate((event) => {
        const next = clamp(startZoom.get() * event.scale, MIN_ZOOM, MAX_ZOOM);
        zoom.set(next);
        translateX.set(limitOffset(translateX.get(), baseWidth, next, viewport));
        translateY.set(limitOffset(translateY.get(), baseHeight, next, viewport));
      })
      .onFinalize(() => { runOnJS(setZoomLabel)(Math.round(zoom.get() * 100)); });
    return Gesture.Simultaneous(pan, pinch);
  }, [baseHeight, baseWidth, viewport, startX, startY, startZoom, translateX, translateY, zoom]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }, { translateY: translateY.get() }, { scale: zoom.get() }],
  }));

  const changeZoom = (delta) => {
    const next = clamp(zoom.get() + delta, MIN_ZOOM, MAX_ZOOM);
    zoom.set(next);
    translateX.set(limitOffset(translateX.get(), baseWidth, next, viewport));
    translateY.set(limitOffset(translateY.get(), baseHeight, next, viewport));
    setZoomLabel(Math.round(next * 100));
  };

  const save = async () => {
    if (!asset?.uri) { setError("Não foi possível ler a imagem selecionada."); return; }
    setBusy(true);
    setError(null);
    try {
      const currentZoom = zoom.get();
      const scale = baseScale * currentZoom;
      const displayedWidth = sourceWidth * scale;
      const displayedHeight = sourceHeight * scale;
      const originX = clamp((displayedWidth - viewport) / 2 - translateX.get(), 0, displayedWidth - viewport) / scale;
      const originY = clamp((displayedHeight - viewport) / 2 - translateY.get(), 0, displayedHeight - viewport) / scale;
      const cropSize = Math.min(viewport / scale, sourceWidth - originX, sourceHeight - originY);
      const crop = {
        originX: Math.max(0, Math.round(originX)),
        originY: Math.max(0, Math.round(originY)),
        width: Math.max(1, Math.floor(cropSize)),
        height: Math.max(1, Math.floor(cropSize)),
      };
      const processed = await processProfileImage(asset, crop);
      await uploadPhoto(processed);
      navigation.goBack();
    } catch (e) {
      setError(e.message || "Não foi possível processar e enviar a foto.");
    } finally {
      setBusy(false);
    }
  };

  if (!asset?.uri) {
    return <View style={[styles.screen, styles.center]}><Text style={type.body}>Imagem não encontrada.</Text></View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={type.heading}>Enquadre sua foto</Text>
        <Text style={type.small}>Arraste a imagem e use dois dedos ou os controles para ampliar. O círculo mostra o resultado final.</Text>
        <View style={[styles.editorShell, { width: viewport, height: viewport }]}>
          <GestureDetector gesture={gesture}>
            <View style={[styles.viewport, { width: viewport, height: viewport }]}>
              <Animated.Image
                source={{ uri: asset.uri }}
                style={[{ width: baseWidth, height: baseHeight }, imageStyle]}
                resizeMode="cover"
                accessibilityLabel="Prévia circular da foto de perfil"
              />
            </View>
          </GestureDetector>
        </View>
        <View style={styles.zoomRow}>
          <PressableScale onPress={() => changeZoom(-0.25)} disabled={zoomLabel <= 100} accessibilityRole="button" accessibilityLabel="Diminuir zoom" style={styles.zoomButton}>
            <MaterialCommunityIcons name="minus" size={24} color={colors.primary} />
          </PressableScale>
          <View style={styles.zoomValue}><Text style={type.bodyStrong}>{zoomLabel}%</Text></View>
          <PressableScale onPress={() => changeZoom(0.25)} disabled={zoomLabel >= 400} accessibilityRole="button" accessibilityLabel="Aumentar zoom" style={styles.zoomButton}>
            <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
          </PressableScale>
        </View>
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
      </View>
      <View style={styles.actions}>
        <Button title="Usar esta foto" icon="check" onPress={save} loading={busy} />
        <Button title="Cancelar" variant="outline" icon="close" onPress={() => navigation.goBack()} disabled={busy} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "space-between" },
  center: { alignItems: "center", justifyContent: "center", padding: spacing.lg },
  content: { alignItems: "center", gap: spacing.sm, padding: spacing.md },
  editorShell: { marginVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, ...shadow.raised },
  viewport: { borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: "#FEFEFE", borderWidth: 4, borderColor: colors.accent },
  zoomRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  zoomButton: { width: 48, height: 48, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  zoomValue: { minWidth: 76, alignItems: "center" },
  error: { ...type.small, alignSelf: "stretch", color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
  actions: { gap: spacing.xs, padding: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
});

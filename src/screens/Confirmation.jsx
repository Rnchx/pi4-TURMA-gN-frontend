import { useCallback } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import StateView from "../components/ui/StateView";
import BrandMark from "../components/brand/BrandMark";
import { SpeedLines, Wheel, enter, rise } from "../components/brand/Motion";
import { dateTime, money } from "../utils/format";
import { font, colors, motion, radius, shadow, spacing, type } from "../theme";

// Selo da marca: o carrinho (monograma) chega da esquerda com as linhas de velocidade,
// as rodinhas assentam e o selo laranja de "concluído" aparece (escala 0,9 → 1, nunca de zero).
// Momento raro (uma vez por compra): é onde a marca tem espaço para se mostrar.
const checkPop = {
  animationName: { from: { opacity: 0, transform: [{ scale: 0.9 }] }, to: { opacity: 1, transform: [{ scale: 1 }] } },
  animationDuration: 260,
  animationDelay: 620,
  animationFillMode: "both",
  animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
};

// E9/E10: confirmação demonstrativa devolvida por CT15 (gerada pelo serviço Java em CT16).
export default function Confirmation({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const compra = route.params?.compra;

  // O voltar do Android leva ao início: o carrinho confirmado não pode mais ser alterado.
  useFocusEffect(useCallback(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("Home");
      return true;
    });
    return () => sub.remove();
  }, [navigation]));

  if (!compra) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView title="Nenhuma compra recente" message="Finalize um carrinho para ver a confirmação aqui."
          actionLabel="Ir para o início" onAction={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: spacing.xl + insets.bottom }]}>
      <View style={styles.hero} accessible accessibilityRole="header" accessibilityLabel={`Compra demonstrativa concluída. Número ${compra.confirmacaoId}`}>
        <View style={styles.seal}>
          <SpeedLines width={46} delay={120} duration={480} style={styles.sealLines} />
          <Animated.View style={enter({ reduced, distance: 48, duration: 560 })}>
            <BrandMark size={58} renderWheel={(style, index) => <Wheel style={style} delay={520 + index * 70} />} />
          </Animated.View>
          <Animated.View style={[styles.check, reduced ? rise({ reduced, delay: 200 }) : checkPop]}>
            <MaterialCommunityIcons name="check" size={22} color={colors.onAccent} />
          </Animated.View>
        </View>
        <Text style={[type.display, styles.centerText]}>Compra concluída!</Text>
        <Text style={[type.body, styles.centerText, styles.muted]}>{compra.mensagem}</Text>
      </View>

      <Animated.View entering={FadeIn.duration(motion.enter).delay(120)} style={styles.card}>
        <Text style={type.caption}>NÚMERO DA COMPRA</Text>
        <Text style={styles.code} selectable>{compra.confirmacaoId}</Text>
        {compra.criadaEm ? <Text style={type.small}>Registrada em {dateTime(compra.criadaEm)}</Text> : null}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(motion.enter).delay(200)} style={styles.card}>
        <Text style={type.heading} accessibilityRole="header">Itens</Text>
        {compra.itens.map((item) => (
          <View key={item.produtoId} style={styles.line}>
            <View style={styles.flex}>
              <Text style={type.bodyStrong}>{item.nome}</Text>
              <Text style={type.small}>{item.quantidade} × {money(item.precoUnitario)}</Text>
            </View>
            <Text style={styles.subtotal}>{money(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={type.heading}>Total</Text>
          <Text style={styles.total}>{money(compra.total)}</Text>
        </View>
      </Animated.View>

      <View style={styles.notice}>
        <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.accentText} />
        <Text style={[type.small, styles.flex, { color: colors.ink }]}>Compra demonstrativa: nenhuma cobrança foi realizada.</Text>
      </View>

      <Button title="Voltar ao início" icon="home-outline" onPress={() => navigation.navigate("Home")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center" },
  content: { padding: spacing.md, gap: spacing.md },
  hero: { alignItems: "center", gap: spacing.xs, paddingVertical: spacing.lg },
  seal: {
    width: 128, height: 128, borderRadius: radius.pill, backgroundColor: colors.primary,
    flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: spacing.xs, paddingRight: 6,
  },
  sealLines: { marginRight: -4, marginTop: -6 },
  check: {
    position: "absolute", right: -2, top: 2, width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.background,
  },
  centerText: { textAlign: "center" },
  muted: { color: colors.inkMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, gap: spacing.xs, ...shadow.card },
  code: { fontSize: 20, lineHeight: 28, fontFamily: font.bold, color: colors.primaryDark, letterSpacing: 0.5 },
  flex: { flex: 1 },
  line: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  subtotal: { fontSize: 16, fontFamily: font.bold, color: colors.ink },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.xs },
  total: { ...type.title, color: colors.primaryDark },
  notice: { flexDirection: "row", gap: spacing.xs, alignItems: "center", padding: spacing.md, backgroundColor: colors.accentSoft, borderRadius: radius.lg },
});

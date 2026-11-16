import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { processProfileImage } from "../services/profile-image";
import Button from "../components/ui/Button";
import { profilePhotoSource } from "../services/api";
import { useAuth } from "../state/AuthContext";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

export default function Profile({ navigation }) {
  const { usuario, photoVersion, uploadPhoto, removePhoto, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const choosePhoto = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Acesso às fotos", "Permita o acesso à galeria nas configurações do celular para escolher uma foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.85,
    });
    if (result.canceled) return;
    setBusy(true);
    try {
      const processed = await processProfileImage(result.assets[0]);
      setPreviewUri(processed.uri);
      await uploadPhoto(processed);
      setPreviewUri(null);
    } catch (e) {
      setPreviewUri(null);
      setError(e.message || "Não foi possível processar e enviar a foto.");
    } finally { setBusy(false); }
  };

  const remove = async () => {
    setBusy(true); setError(null);
    try { await removePhoto(); setPreviewUri(null); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          {previewUri || usuario?.fotoPerfil
            ? <Image source={previewUri ? { uri: previewUri } : profilePhotoSource(photoVersion)} style={styles.photo} accessibilityLabel={previewUri ? "Prévia da foto de perfil" : "Foto de perfil"} />
            : <MaterialCommunityIcons name="account" size={52} color={colors.onPrimary} />}
        </View>
        <Text style={type.title}>{usuario?.nome}</Text>
        <Text style={type.body}>{usuario?.email}</Text>
        <View style={styles.info}>
          <Text style={type.smallStrong}>Data de nascimento</Text>
          <Text style={type.body}>{usuario?.dataNascimento || "Não informada em conta antiga"}</Text>
          <Text style={type.smallStrong}>Idade atual</Text>
          <Text style={type.body}>{Number.isInteger(usuario?.idade) ? `${usuario.idade} anos` : "Indisponível"}</Text>
        </View>
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <View style={styles.actions}>
          <Button title={usuario?.fotoPerfil ? "Substituir foto" : "Adicionar foto"} icon="image-outline" variant="secondary" onPress={choosePhoto} loading={busy} />
          {usuario?.fotoPerfil ? <Button title="Remover foto" icon="image-remove-outline" variant="ghost" onPress={remove} disabled={busy} /> : null}
          <Button title="Editar perfil" icon="account-edit-outline" variant="outline" onPress={() => navigation.navigate("EditProfile")} disabled={busy} />
          <Button title="Alterar senha" icon="lock-reset" variant="outline" onPress={() => navigation.navigate("ChangePassword")} disabled={busy} />
          <Button title="Sair da conta" icon="logout" variant="outline" onPress={logout} disabled={busy} />
        </View>
      </View>
      <View style={styles.dangerCard}>
        <Text style={[type.heading, styles.dangerText]}>Excluir conta</Text>
        <Text style={type.small}>A exclusão é permanente e encerra todas as suas sessões.</Text>
        <Button title="Excluir minha conta" icon="delete-alert-outline" variant="danger" onPress={() => navigation.navigate("DeleteAccount")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  card: { alignItems: "center", gap: spacing.sm, padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  avatar: { width: 104, height: 104, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  photo: { width: "100%", height: "100%" },
  info: { alignSelf: "stretch", gap: spacing.xxs, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primarySoft },
  actions: { alignSelf: "stretch", gap: spacing.sm, marginTop: spacing.xs },
  error: { ...type.small, alignSelf: "stretch", color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
  dangerCard: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.xl },
  dangerText: { color: colors.danger },
});

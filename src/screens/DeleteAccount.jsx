import { useState } from "react";
import { Alert, Text, View } from "react-native";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../state/AuthContext";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

export default function DeleteAccount() {
  const { deleteAccount } = useAuth();
  const [senha, setSenha] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(null);
  const execute = async () => {
    setBusy(true); setError(null);
    try { await deleteAccount(senha); } catch (e) { setError(e.message); setBusy(false); }
  };
  const confirm = () => {
    if (!senha) { setError("Informe sua senha atual."); return; }
    Alert.alert("Excluir conta permanentemente?", "Seu perfil será apagado, todas as sessões serão encerradas e essa ação não poderá ser desfeita.", [
      { text: "Cancelar", style: "cancel" }, { text: "Excluir definitivamente", style: "destructive", onPress: execute },
    ]);
  };
  return <View style={styles.screen}><View style={styles.card}>
    <Text style={[type.title, styles.danger]}>Excluir minha conta</Text>
    <Text style={type.body}>Esta ação é permanente. Compras demonstrativas serão mantidas apenas como registros técnicos anônimos.</Text>
    <FormField label="Senha atual" value={senha} onChangeText={setSenha} secureTextEntry />
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Button title="Excluir definitivamente" icon="delete-forever-outline" variant="danger" onPress={confirm} loading={busy} />
  </View></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  card: { gap: spacing.md, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card }, danger: { color: colors.danger },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md } });

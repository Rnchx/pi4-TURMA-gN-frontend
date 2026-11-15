import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../state/AuthContext";
import { colors, radius, shadow, spacing, type } from "../theme";

const rule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ senhaAtual: "", novaSenha: "", confirmacaoNovaSenha: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(null);
  const errors = useMemo(() => ({
    novaSenha: rule.test(form.novaSenha) ? null : "Use no mínimo 8 caracteres, incluindo letra maiúscula, minúscula e número.",
    confirmacaoNovaSenha: form.confirmacaoNovaSenha && form.confirmacaoNovaSenha === form.novaSenha ? null : "As senhas devem coincidir.",
  }), [form]);
  const set = key => value => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async () => {
    if (!form.senhaAtual || errors.novaSenha || errors.confirmacaoNovaSenha) { setError("Revise os campos destacados."); return; }
    setBusy(true); setError(null);
    try { await changePassword(form); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.card}>
    <Text style={type.title}>Alterar senha</Text>
    <Text style={type.small}>Depois da alteração, você entrará novamente com a nova senha.</Text>
    <FormField label="Senha atual" value={form.senhaAtual} onChangeText={set("senhaAtual")} secureTextEntry />
    <FormField label="Nova senha" value={form.novaSenha} onChangeText={set("novaSenha")} secureTextEntry error={form.novaSenha ? errors.novaSenha : null} />
    <FormField label="Confirmar nova senha" value={form.confirmacaoNovaSenha} onChangeText={set("confirmacaoNovaSenha")} secureTextEntry error={form.confirmacaoNovaSenha ? errors.confirmacaoNovaSenha : null} />
    {error ? <Text style={styles.error}>{error}</Text> : null}<Button title="Alterar senha" icon="lock-check-outline" onPress={submit} loading={busy} />
  </View></ScrollView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md },
  card: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md } });

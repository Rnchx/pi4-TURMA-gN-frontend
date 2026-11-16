import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../state/AuthContext";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

const cpfMask = value => value.replace(/\D/g, "").slice(0, 11)
  .replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
  .replace(/\.(\d{3})(\d)/, ".$1-$2");
const dateMask = value => value.replace(/\D/g, "").slice(0, 8)
  .replace(/^(\d{2})(\d)/, "$1/$2").replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
const validDate = value => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const [, day, month, year] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    && date <= new Date();
};
const validEmail = value => {
  const email = value.trim();
  const [local, domain, ...rest] = email.split("@");
  return !rest.length && Boolean(local && domain && domain.includes(".") && !local.startsWith(".")
    && !local.endsWith(".") && !local.includes("..") && /^[^\s@]+$/.test(local)
    && /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z0-9-]{2,}$/i.test(domain));
};

export default function Register({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", dataNascimento: "", senha: "", confirmacaoSenha: "" });
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = key => value => setForm(prev => ({ ...prev, [key]: key === "cpf" ? cpfMask(value) : key === "dataNascimento" ? dateMask(value) : value }));
  const errors = useMemo(() => ({
    nome: form.nome.trim() && form.nome.trim().split(/\s+/).length >= 2 ? null : "Informe nome e sobrenome.",
    cpf: form.cpf.replace(/\D/g, "").length === 11 ? null : "Informe os 11 dígitos do CPF.",
    email: validEmail(form.email) ? null : "Informe um e-mail válido.",
    dataNascimento: validDate(form.dataNascimento) ? null : "Informe uma data real no formato DD/MM/AAAA, sem usar data futura.",
    senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.senha) ? null : "Use no mínimo 8 caracteres, incluindo letra maiúscula, minúscula e número.",
    confirmacaoSenha: form.confirmacaoSenha === form.senha && form.confirmacaoSenha ? null : "As senhas devem coincidir.",
  }), [form]);

  const submit = async () => {
    if (Object.values(errors).some(Boolean)) { setServerError("Revise os campos destacados."); return; }
    setBusy(true); setServerError(null);
    try {
      await register({ ...form, nome: form.nome.trim(), email: form.email.trim() });
      navigation.navigate("Login", { cadastroConcluido: true });
    } catch (e) { setServerError(e.message); } finally { setBusy(false); }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={type.title}>Criar conta</Text>
        <Text style={type.small}>Todos os dados serão validados novamente pelo servidor Java.</Text>
        <FormField label="Nome completo" value={form.nome} onChangeText={set("nome")} error={form.nome ? errors.nome : null} autoComplete="name" />
        <FormField label="CPF" value={form.cpf} onChangeText={set("cpf")} error={form.cpf ? errors.cpf : null} keyboardType="number-pad" maxLength={14} />
        <FormField label="E-mail" value={form.email} onChangeText={set("email")} error={form.email ? errors.email : null} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <FormField label="Data de nascimento (DD/MM/AAAA)" value={form.dataNascimento} onChangeText={set("dataNascimento")} error={form.dataNascimento ? errors.dataNascimento : null} keyboardType="number-pad" maxLength={10} />
        <FormField label="Senha" value={form.senha} onChangeText={set("senha")} error={form.senha ? errors.senha : null} secureTextEntry />
        <FormField label="Confirmar senha" value={form.confirmacaoSenha} onChangeText={set("confirmacaoSenha")} error={form.confirmacaoSenha ? errors.confirmacaoSenha : null} secureTextEntry />
        {serverError ? <Text style={styles.error} accessibilityRole="alert">{serverError}</Text> : null}
        <Button title="Cadastrar" icon="account-check-outline" onPress={submit} loading={busy} />
        <Button title="Voltar ao login" variant="outline" onPress={() => navigation.navigate("Login")} disabled={busy} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingVertical: spacing.xl },
  card: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
});

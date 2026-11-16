import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../state/AuthContext";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

export default function Login({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !senha) { setError("Preencha e-mail e senha."); return; }
    setBusy(true); setError(null);
    try { await login(email, senha); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.hero}>
        <Image source={require("../../assets/design/images/banner-safra-monograma.png")} style={styles.logo} resizeMode="contain" accessibilityLabel="SAFRA Online" />
        <Text style={styles.tagline}>Entre para continuar sua compra</Text>
      </View>
      <View style={styles.card}>
        <MaterialCommunityIcons name="account-circle-outline" size={42} color={colors.primary} />
        <Text style={type.title}>Acessar conta</Text>
        <FormField label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <FormField label="Senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="current-password" />
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <Button title="Entrar" icon="login" onPress={submit} loading={busy} />
        <Button title="Criar minha conta" variant="outline" icon="account-plus-outline" onPress={() => navigation.navigate("Register")} disabled={busy} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.background },
  hero: { alignItems: "center", gap: spacing.xs },
  logo: { width: 320, maxWidth: "100%", height: 113, borderRadius: radius.md },
  tagline: { ...type.body, color: colors.inkMuted },
  card: { width: "100%", maxWidth: 520, alignSelf: "center", padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
});

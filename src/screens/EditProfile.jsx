import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../state/AuthContext";
import { colors, radius, shadow, spacing, type } from "../theme";

export default function EditProfile({ navigation }) {
  const { usuario, updateProfile } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const nameError = nome.trim().split(/\s+/).length < 2 ? "Informe nome e sobrenome." : null;

  const save = async () => {
    if (nameError) { setError(nameError); return; }
    setBusy(true); setError(null);
    try { await updateProfile({ nome: nome.trim() }); navigation.goBack(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.card}>
      <Text style={type.title}>Editar perfil</Text>
      <FormField label="Nome completo" value={nome} onChangeText={setNome} error={nome ? nameError : null} autoComplete="name" />
      <FormField label="E-mail (não editável)" value={usuario?.email || ""} editable={false} style={styles.readonly} />
      <FormField label="Data de nascimento (não editável)" value={usuario?.dataNascimento || "Não informada"} editable={false} style={styles.readonly} />
      <Text style={styles.note}>E-mail e data de nascimento ficam bloqueados para proteger a identidade e a restrição etária da conta.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Salvar alterações" icon="content-save-outline" onPress={save} loading={busy} />
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md },
  card: { gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.xl, ...shadow.card },
  readonly: { backgroundColor: colors.surfaceMuted, color: colors.inkMuted },
  note: { ...type.small, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.primarySoft },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
});

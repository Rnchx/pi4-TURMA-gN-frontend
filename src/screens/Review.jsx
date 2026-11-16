import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import StateView from "../components/ui/StateView";
import { ListSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext";
import { money } from "../utils/format";
import { paymentLabel } from "./Payment";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";

export default function Review({ navigation, route }) {
  const metodo = route.params?.metodoPagamento;
  const { usuario } = useAuth();
  const { summary, confirm } = useCart();
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [busy, setBusy] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const load = useCallback(async () => {
    try { setState({ loading: true, data: null, error: null }); setState({ loading: false, data: await summary(), error: null }); }
    catch (error) { setState({ loading: false, data: null, error }); }
  }, [summary]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const submit = async () => {
    if (busy || !metodo || !state.data?.podeConfirmar) return;
    setBusy(true); setConfirmError(null);
    try { navigation.navigate("Confirmation", { compra: await confirm(metodo) }); }
    catch (error) { setConfirmError(error); } finally { setBusy(false); }
  };

  if (state.loading) return <View style={styles.screen}><ListSkeleton rows={3} /></View>;
  if (state.error || !state.data) return <View style={[styles.screen, styles.center]}><StateView title="Não foi possível revisar" message={state.error?.message} actionLabel="Tentar novamente" onAction={load} /></View>;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}><Text style={type.heading}>Compra de {usuario?.nome}</Text><Text style={type.small}>{usuario?.email}</Text></View>
        <View style={styles.card}>
          <Text style={type.heading}>Itens</Text>
          {state.data.itens.map(item => <View key={item.produtoId} style={styles.row}><Text style={[type.body, styles.flex]}>{item.quantidade} × {item.nome}</Text><Text style={type.bodyStrong}>{money(item.subtotal)}</Text></View>)}
          <View style={styles.row}><Text style={type.heading}>Total</Text><Text style={type.title}>{money(state.data.total)}</Text></View>
        </View>
        <View style={styles.card}><Text style={type.heading}>Método demonstrativo</Text><Text style={type.body}>{paymentLabel(metodo)}</Text></View>
        <View style={styles.notice}><MaterialCommunityIcons name="school-outline" size={22} color={colors.primary} /><Text style={[type.small, styles.flex]}>Simulação acadêmica. Nenhuma cobrança será realizada.</Text></View>
        {confirmError ? <Text style={styles.error} accessibilityRole="alert">{confirmError.message} Você pode tentar novamente com segurança.</Text> : null}
      </ScrollView>
      <View style={styles.bottom}><Button title="Confirmar compra demonstrativa" icon="check-decagram" variant="accent" onPress={submit} loading={busy} disabled={!state.data.podeConfirmar} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, center: { justifyContent: "center" }, content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 110 },
  card: { padding: spacing.md, gap: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.lg, ...shadow.card },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  flex: { flex: 1 }, notice: { flexDirection: "row", gap: spacing.xs, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.primarySoft },
  error: { ...type.small, color: colors.danger, backgroundColor: colors.dangerSoft, padding: spacing.sm, borderRadius: radius.md },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.md, backgroundColor: colors.surface, ...shadow.bar },
});

import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import StateView from "../components/ui/StateView";
import { ListSkeleton } from "../components/ui/Skeleton";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { money } from "../utils/format";
import { StyleSheet, font, colors, motion, radius, shadow, spacing, type } from "../theme";

// E8 resumo (CT14) e E9 confirmação demonstrativa (CT15). Os valores exibidos são os mesmos enviados à confirmação.
export default function Summary({ navigation }) {
  const insets = useSafeAreaInsets();
  const { carrinhoId, summary } = useCart();
  const { usuario } = useAuth();
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  const load = useCallback(async () => {
    if (!carrinhoId) {
      setState({ status: "empty", data: null, error: null });
      return;
    }
    setState((prev) => ({ ...prev, status: prev.data ? prev.status : "loading", error: null }));
    try {
      const data = await summary();
      setState({ status: data.itens.length ? "ready" : "empty", data, error: null });
    } catch (error) {
      setState({ status: error.codigo === "carrinhoNaoEncontrado" ? "empty" : "error", data: null, error });
    }
  }, [carrinhoId, summary]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  if (state.status === "loading") {
    return <View style={[styles.screen, styles.top]}><ListSkeleton rows={3} /></View>;
  }
  if (state.status === "error") {
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView tone={state.error?.offline ? "offline" : "error"} title="Não foi possível gerar o resumo"
          message={state.error?.message} actionLabel="Tentar novamente" actionIcon="refresh" onAction={load} />
      </View>
    );
  }
  if (state.status === "empty") {
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView icon="cart-outline" title="Nada para confirmar"
          message="O carrinho está vazio. Adicione produtos antes de finalizar."
          actionLabel="Ver produtos" actionIcon="storefront-outline" onAction={() => navigation.navigate("Home")} />
      </View>
    );
  }

  const { itens, total, podeConfirmar } = state.data;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 200 + insets.bottom }]}>
        <Animated.View entering={FadeIn.duration(motion.enter)} style={styles.card}>
          <Text style={type.heading} accessibilityRole="header">Itens da compra</Text>
          {itens.map((item) => (
            <View key={item.produtoId} style={styles.line}
              accessible accessibilityLabel={`${item.nome}, ${item.quantidade} vezes ${money(item.precoUnitario)}, subtotal ${money(item.subtotal)}`}>
              <View style={styles.flex}>
                <Text style={type.bodyStrong}>{item.nome}</Text>
                <Text style={type.small}>{item.quantidade} × {money(item.precoUnitario)}</Text>
              </View>
              <Text style={styles.subtotal}>{money(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={type.heading}>Total</Text>
            <Text style={styles.total} accessibilityLabel={`Total ${money(total)}`}>{money(total)}</Text>
          </View>
        </Animated.View>

        <View style={styles.card}>
          <Text style={type.heading}>Responsável pela compra</Text>
          <Text style={type.bodyStrong}>{usuario?.nome}</Text>
          <Text style={type.small}>{usuario?.email}</Text>
        </View>

        <View style={styles.notice}>
          <MaterialCommunityIcons name="information-outline" size={22} color={colors.primary} />
          <Text style={[type.small, styles.flex, { color: colors.ink }]}>
            Esta é uma compra demonstrativa: nenhum pagamento será cobrado e nenhum dado financeiro é solicitado.
          </Text>
        </View>

        {!podeConfirmar ? (
          <View style={[styles.notice, styles.warn]} accessibilityRole="alert">
            <MaterialCommunityIcons name="alert-circle-outline" size={22} color={colors.accentText} />
            <Text style={[type.small, styles.flex, { color: colors.ink }]}>
              Este carrinho não pode ser confirmado. Revise os itens no carrinho.
            </Text>
          </View>
        ) : null}

      </ScrollView>

      <View style={[styles.bar, { paddingBottom: spacing.sm + insets.bottom }]}>
        <Button
          title="Escolher método de pagamento"
          icon="credit-card-outline"
          onPress={() => navigation.navigate("Payment")}
          disabled={!podeConfirmar}
        />
        <Button title="Voltar ao carrinho" variant="outline" icon="arrow-left" onPress={() => navigation.navigate("ShopCart")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center" },
  top: { paddingTop: spacing.md },
  content: { padding: spacing.md, gap: spacing.md },
  flex: { flex: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm, ...shadow.card },
  line: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border },
  subtotal: { fontSize: 16, fontFamily: font.bold, color: colors.ink },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.xs },
  total: { ...type.display, color: colors.price },
  notice: { flexDirection: "row", gap: spacing.xs, alignItems: "flex-start", padding: spacing.md, backgroundColor: colors.primarySoft, borderRadius: radius.lg },
  warn: { backgroundColor: colors.accentSoft },
  error: { backgroundColor: colors.dangerSoft },
  bar: {
    position: "absolute", left: 0, right: 0, bottom: 0, gap: spacing.xs, paddingHorizontal: spacing.md, paddingTop: spacing.md,
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadow.bar,
  },
});

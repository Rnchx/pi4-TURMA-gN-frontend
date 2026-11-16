import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./ui/Button";
import PressableScale from "./ui/PressableScale";
import StateView from "./ui/StateView";
import { ListSkeleton } from "./ui/Skeleton";
import { useToast } from "./ui/Toast";
import { useCart } from "../state/CartContext";
import { purchaseApi } from "../services/api";
import { paymentLabel } from "../screens/Payment";
import { date, items as itemsLabel, money, time } from "../utils/format";
import { StyleSheet, colors, font, motion, radius, shadow, spacing, type } from "../theme";

const REASONS = {
  indisponivel: "indisponível no momento",
  restricaoEtaria: "restrição de idade",
  limiteQuantidade: "limite de 99 unidades",
};

// Três últimas compras da conta (CT24), consultadas no servidor a cada abertura da aba.
// "Adicionar novamente ao carrinho" (CT25) usa preços atuais e não cria nem reabre compras.
export default function PurchaseHistory({ onOpenCart, reloadKey }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { repeatPurchase } = useCart();
  const [state, setState] = useState({ status: "loading", compras: [], error: null });
  const [expanded, setExpanded] = useState(null);
  const [repeating, setRepeating] = useState(null);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    try {
      const data = await purchaseApi.history();
      setState({ status: "ready", compras: data.compras || [], error: null });
    } catch (error) {
      setState({ status: "error", compras: [], error });
    }
  }, []);

  useEffect(() => { load(); }, [load, reloadKey]);

  const repeat = async (compra) => {
    if (repeating) return;
    setRepeating(compra.compraId);
    try {
      const result = await repeatPurchase(compra.compraId);
      const skipped = result.naoAdicionados.map((item) => `${item.nome} (${REASONS[item.motivo] || "não adicionado"})`);
      const adjusted = result.adicionados.filter((item) => item.ajustado).map((item) => item.nome);
      const parts = [];
      if (result.adicionados.length) parts.push(`${itemsLabel(result.adicionados.length)} no carrinho com os preços atuais.`);
      if (adjusted.length) parts.push(`Quantidade ajustada ao limite: ${adjusted.join(", ")}.`);
      if (skipped.length) parts.push(`Não adicionados: ${skipped.join("; ")}.`);
      toast.show({
        tone: result.adicionados.length ? "success" : "error",
        message: parts.join(" ") || result.mensagem,
        ...(result.adicionados.length ? { actionLabel: "Ver carrinho", onAction: onOpenCart } : {}),
      });
    } catch (error) {
      toast.show({ tone: "error", message: error.message });
    } finally {
      setRepeating(null);
    }
  };

  if (state.status === "loading") return <View style={styles.top}><ListSkeleton rows={3} /></View>;
  if (state.status === "error") {
    return (
      <View style={styles.center}>
        <StateView tone={state.error?.offline ? "offline" : "error"} title="Não foi possível carregar o histórico"
          message={state.error?.message} actionLabel="Tentar novamente" actionIcon="refresh" onAction={load} />
      </View>
    );
  }
  if (!state.compras.length) {
    return (
      <View style={styles.center}>
        <StateView icon="history" title="Nenhuma compra ainda"
          message="Suas três últimas compras concluídas aparecem aqui." />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl + insets.bottom }]}>
      <Text style={type.small}>Suas {state.compras.length === 1 ? "última compra" : `${state.compras.length} últimas compras`}</Text>
      {state.compras.map((compra) => {
        const open = expanded === compra.compraId;
        return (
          <Animated.View key={compra.compraId} entering={FadeIn.duration(motion.enter)}
            layout={LinearTransition.duration(motion.enter).easing(motion.easeInOut)} style={styles.card}>
            <PressableScale
              onPress={() => setExpanded(open ? null : compra.compraId)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`Compra ${compra.confirmacaoId}, ${date(compra.criadaEm)} às ${time(compra.criadaEm)}, total ${money(compra.total)}. ${open ? "Ocultar" : "Ver"} detalhes`}
              scaleTo={0.99}
            >
              <View style={styles.head}>
                <View style={styles.flex}>
                  <Text style={styles.code} selectable>{compra.confirmacaoId}</Text>
                  <Text style={type.small}>{date(compra.criadaEm)} · {time(compra.criadaEm)} · {paymentLabel(compra.metodoPagamento)}</Text>
                </View>
                <MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} size={26} color={colors.primary} />
              </View>
              <View style={styles.amounts}>
                <Row label="Itens" value={`${compra.quantidadeItens} ${compra.quantidadeItens === 1 ? "unidade" : "unidades"}`} />
                <Row label="Subtotal" value={money(compra.subtotal)} />
                <Row label="Cupom" value={compra.cupom || "Nenhum cupom"} />
                <Row label="Desconto" value={compra.desconto > 0 ? `− ${money(compra.desconto)}` : money(0)} highlight={compra.desconto > 0} />
                <View style={styles.totalRow}>
                  <Text style={type.bodyStrong}>Total final</Text>
                  <Text style={styles.total}>{money(compra.total)}</Text>
                </View>
              </View>
            </PressableScale>

            {open ? (
              <Animated.View entering={FadeIn.duration(motion.quick)} style={styles.details}>
                <Text style={type.caption}>ITENS DA COMPRA</Text>
                {compra.itens.map((item) => (
                  <View key={`${compra.compraId}-${item.produtoId}`} style={styles.item}
                    accessible accessibilityLabel={`${item.nome}, ${item.quantidade} vezes ${money(item.precoUnitario)}, subtotal ${money(item.subtotal)}`}>
                    <View style={styles.flex}>
                      <Text style={type.bodyStrong}>{item.nome}</Text>
                      <Text style={type.small}>{item.quantidade} × {money(item.precoUnitario)}</Text>
                    </View>
                    <Text style={styles.itemTotal}>{money(item.subtotal)}</Text>
                  </View>
                ))}
                <Text style={type.small}>Preços e nomes registrados no momento da compra.</Text>
              </Animated.View>
            ) : null}

            <Button
              title="Adicionar novamente ao carrinho"
              icon="cart-arrow-down"
              variant="secondary"
              size="md"
              loading={repeating === compra.compraId}
              disabled={Boolean(repeating) && repeating !== compra.compraId}
              onPress={() => repeat(compra)}
              accessibilityHint="Adiciona os produtos ainda disponíveis com os preços atuais"
            />
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

function Row({ label, value, highlight = false }) {
  return (
    <View style={styles.row}>
      <Text style={type.small}>{label}</Text>
      <Text style={[type.smallStrong, highlight && styles.discount]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.md },
  center: { flex: 1, justifyContent: "center" },
  content: { padding: spacing.md, gap: spacing.sm },
  flex: { flex: 1 },
  card: {
    gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  code: { fontSize: 16, lineHeight: 22, fontFamily: font.bold, color: colors.price, letterSpacing: 0.4 },
  amounts: { gap: spacing.xxs, marginTop: spacing.xs },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  discount: { color: colors.success },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.sm,
    paddingTop: spacing.xs, marginTop: spacing.xxs, borderTopWidth: 1, borderTopColor: colors.border,
  },
  total: { fontSize: 18, lineHeight: 24, fontFamily: font.bold, color: colors.price },
  details: { gap: spacing.xs, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  item: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxs },
  itemTotal: { fontSize: 15, fontFamily: font.bold, color: colors.ink },
});

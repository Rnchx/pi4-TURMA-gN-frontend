import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";
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
import { StyleSheet, font, colors, motion, radius, shadow, spacing, touch, type } from "../theme";

// E8 resumo (CT14) e cupom (CT26). Subtotal, desconto e total são sempre os devolvidos pelo servidor:
// o aplicativo nunca calcula nem decide o desconto.
export default function Summary({ navigation }) {
  const insets = useSafeAreaInsets();
  const { carrinhoId, summary, coupon, applyCoupon, removeCoupon, revalidateCoupon } = useCart();
  const { usuario } = useAuth();
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [code, setCode] = useState("");
  const [couponState, setCouponState] = useState({ busy: false, error: null, success: null });
  const couponRef = useRef(coupon);
  useEffect(() => { couponRef.current = coupon; }, [coupon]);

  const load = useCallback(async () => {
    if (!carrinhoId) {
      setState({ status: "empty", data: null, error: null });
      return;
    }
    setState((prev) => ({ ...prev, status: prev.data ? prev.status : "loading", error: null }));
    try {
      const data = await summary();
      setState({ status: data.itens.length ? "ready" : "empty", data, error: null });
      // O carrinho pode ter mudado desde a aplicação: o servidor recalcula o desconto.
      if (couponRef.current && data.itens.length) {
        revalidateCoupon(couponRef.current).catch((error) => {
          setCouponState({ busy: false, success: null, error: `O cupom foi removido: ${error.message}` });
        });
      }
    } catch (error) {
      setState({ status: error.codigo === "carrinhoNaoEncontrado" ? "empty" : "error", data: null, error });
    }
  }, [carrinhoId, summary, revalidateCoupon]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const apply = async () => {
    const typed = code.trim();
    if (couponState.busy) return;
    if (!typed) {
      setCouponState({ busy: false, success: null, error: "Digite o código do cupom." });
      return;
    }
    setCouponState({ busy: true, error: null, success: null });
    try {
      const result = await applyCoupon(typed);
      setCode("");
      setCouponState({ busy: false, error: null, success: `${result.mensagem || "Cupom aplicado."} Desconto de ${money(result.desconto)}.` });
    } catch (error) {
      setCouponState({ busy: false, success: null, error: error.message });
    }
  };

  const remove = () => {
    removeCoupon();
    setCouponState({ busy: false, error: null, success: "Cupom removido." });
  };

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
  const subtotal = coupon ? coupon.subtotal : total;
  const finalTotal = coupon ? coupon.total : total;
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 200 + insets.bottom }]} keyboardShouldPersistTaps="handled">
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
        </Animated.View>

        <View style={styles.card}>
          <Text style={type.heading} accessibilityRole="header">Cupom de desconto</Text>
          {coupon ? (
            <View style={styles.applied} accessible accessibilityLabel={`Cupom ${coupon.cupom} aplicado. Desconto de ${money(coupon.desconto)}`}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={colors.success} />
              <View style={styles.flex}>
                <Text style={type.bodyStrong}>{coupon.cupom}</Text>
                <Text style={type.small}>Desconto de {money(coupon.desconto)}</Text>
              </View>
              <Button title="Remover" icon="close" variant="ghost" size="md" onPress={remove}
                accessibilityLabel={`Remover cupom ${coupon.cupom}`} />
            </View>
          ) : (
            <View style={styles.couponRow}>
              <TextInput
                value={code}
                onChangeText={(value) => {
                  setCode(value);
                  if (couponState.error || couponState.success) setCouponState((s) => ({ ...s, error: null, success: null }));
                }}
                placeholder="Código do cupom"
                placeholderTextColor={colors.inkSubtle}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={apply}
                editable={!couponState.busy}
                style={[styles.input, couponState.error && styles.invalid]}
                accessibilityLabel="Código do cupom"
                accessibilityHint="Digite o código exatamente como recebido e toque em Aplicar"
              />
              <Button title="Aplicar" size="md" onPress={apply} loading={couponState.busy} disabled={!podeConfirmar}
                containerStyle={styles.applyButton} accessibilityLabel="Aplicar cupom" />
            </View>
          )}
          {couponState.busy && coupon ? <ActivityIndicator color={colors.primary} /> : null}
          {couponState.error ? <Text style={styles.couponError} accessibilityRole="alert">{couponState.error}</Text> : null}
          {couponState.success && !couponState.error ? (
            <Text style={styles.couponSuccess} accessibilityLiveRegion="polite">{couponState.success}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.amountRow}>
            <Text style={type.body}>Subtotal</Text>
            <Text style={type.bodyStrong} accessibilityLabel={`Subtotal ${money(subtotal)}`}>{money(subtotal)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={type.body}>Desconto</Text>
            <Text style={[type.bodyStrong, coupon && styles.discount]}>
              {coupon ? `− ${money(coupon.desconto)}` : money(0)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={type.heading}>Total final</Text>
            <Text style={styles.total} accessibilityLabel={`Total final ${money(finalTotal)}`}>{money(finalTotal)}</Text>
          </View>
          <Text style={type.small}>Valores calculados pelo SAFRA. O cupom é conferido novamente na confirmação.</Text>
        </View>

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
          disabled={!podeConfirmar || couponState.busy}
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
  couponRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs, flexWrap: "wrap" },
  input: {
    flex: 1, minWidth: 150, minHeight: touch.min, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    fontFamily: font.semibold, fontSize: 16, color: colors.ink, letterSpacing: 1,
  },
  invalid: { borderColor: colors.danger },
  applyButton: { minWidth: 110 },
  applied: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.sm,
    borderRadius: radius.md, backgroundColor: colors.successSoft,
  },
  couponError: { ...type.small, color: colors.danger },
  couponSuccess: { ...type.small, color: colors.success },
  amountRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  discount: { color: colors.success },
  totalRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: spacing.xs,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  total: { ...type.display, color: colors.price },
  notice: { flexDirection: "row", gap: spacing.xs, alignItems: "flex-start", padding: spacing.md, backgroundColor: colors.primarySoft, borderRadius: radius.lg },
  warn: { backgroundColor: colors.accentSoft },
  bar: {
    position: "absolute", left: 0, right: 0, bottom: 0, gap: spacing.xs, paddingHorizontal: spacing.md, paddingTop: spacing.md,
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadow.bar,
  },
});

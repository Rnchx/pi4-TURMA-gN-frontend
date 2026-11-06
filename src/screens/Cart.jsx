import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductImage from "../components/ProductImage";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import PressableScale from "../components/ui/PressableScale";
import QuantityStepper from "../components/ui/QuantityStepper";
import StateView from "../components/ui/StateView";
import { ListSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { useCart } from "../state/CartContext";
import { cachedProduct } from "../state/productCache";
import { items as itemsLabel, money } from "../utils/format";
import { font, colors, motion, radius, shadow, spacing, type } from "../theme";

// E4–E7: consulta (CT11), quantidade (CT12), remoção (CT13), subtotais e total calculados pela API.
export default function Cart({ navigation }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { carrinhoId, cart, loading, error, pending, count, refresh, setQuantity, removeItem } = useCart();
  const [removing, setRemoving] = useState(null);

  useFocusEffect(useCallback(() => {
    refresh().catch(() => {});
  }, [refresh]));

  const change = async (item, quantidade) => {
    try {
      await setQuantity(item.produtoId, quantidade);
    } catch (err) {
      toast.show({ tone: "error", message: err.message });
      refresh().catch(() => {});
    }
  };

  const confirmRemove = async () => {
    const item = removing;
    setRemoving(null);
    try {
      const result = await removeItem(item.produtoId);
      toast.show({ message: result?.carrinhoVazio ? "Carrinho vazio." : `${item.nome} saiu do carrinho.` });
    } catch (err) {
      toast.show({ tone: "error", message: err.message });
      refresh().catch(() => {});
    }
  };

  if (loading && cart.itens.length === 0 && carrinhoId) {
    return <View style={[styles.screen, styles.top]}><ListSkeleton rows={3} /></View>;
  }

  if (error && cart.itens.length === 0) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView
          tone={error.offline ? "offline" : "error"}
          title="Não foi possível carregar o carrinho"
          message={error.message}
          actionLabel="Tentar novamente"
          actionIcon="refresh"
          onAction={() => refresh().catch(() => {})}
        />
      </View>
    );
  }

  if (cart.itens.length === 0) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView
          tone="brand"
          title="Seu carrinho está vazio"
          message="Escolha produtos no catálogo para montar sua compra."
          actionLabel="Ver produtos"
          actionIcon="storefront-outline"
          onAction={() => navigation.navigate("Home")}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 170 + insets.bottom }]}>
        <Text style={type.small}>{itemsLabel(cart.itens.length)} · {count} {count === 1 ? "unidade" : "unidades"}</Text>
        {error ? (
          <View style={styles.inlineError} accessibilityRole="alert">
            <MaterialCommunityIcons name="wifi-off" size={18} color={colors.accentText} />
            <Text style={[type.small, styles.flex]}>{error.message}</Text>
          </View>
        ) : null}
        {cart.itens.map((item) => {
          const info = cachedProduct(item.produtoId);
          const busy = pending.has(item.produtoId);
          return (
            <Animated.View
              key={item.produtoId}
              entering={FadeIn.duration(motion.enter)}
              exiting={FadeOut.duration(motion.quick)}
              layout={LinearTransition.duration(motion.enter).easing(motion.easeInOut)}
              style={styles.item}
            >
              <PressableScale
                onPress={() => navigation.navigate("ProductDetails", { produtoId: item.produtoId })}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${item.nome}`}
              >
                <ProductImage uri={info?.imagemUrl} size={72} label={item.nome} />
              </PressableScale>
              <View style={styles.itemBody}>
                <View style={styles.itemTop}>
                  <Text style={[type.bodyStrong, styles.flex]}>{item.nome}</Text>
                  <PressableScale
                    onPress={() => setRemoving(item)}
                    disabled={busy}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${item.nome} do carrinho`}
                    style={styles.remove}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.danger} />
                  </PressableScale>
                </View>
                <Text style={type.small}>{money(item.precoUnitario)} cada</Text>
                <View style={styles.itemBottom}>
                  <QuantityStepper value={item.quantidade} onChange={(q) => change(item, q)} busy={busy} label={`Quantidade de ${item.nome}`} />
                  <Animated.Text key={item.subtotal} entering={FadeIn.duration(motion.quick)} style={styles.subtotal}
                    accessibilityLabel={`Subtotal ${money(item.subtotal)}`}>
                    {money(item.subtotal)}
                  </Animated.Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: spacing.sm + insets.bottom }]}>
        <View style={styles.totalRow}>
          <View>
            <Text style={type.caption}>TOTAL</Text>
            <Text style={type.small}>Calculado pelo SAFRA</Text>
          </View>
          <Animated.Text key={cart.total} entering={FadeIn.duration(motion.quick)} style={styles.total}
            accessibilityLabel={`Total ${money(cart.total)}`}>
            {money(cart.total)}
          </Animated.Text>
        </View>
        <Button title="Revisar compra" icon="receipt-text-outline" onPress={() => navigation.navigate("Summary")} disabled={pending.size > 0} />
      </View>

      <ConfirmDialog
        visible={!!removing}
        title="Remover item?"
        message={removing ? `${removing.nome} será retirado do carrinho.` : ""}
        confirmLabel="Remover"
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center" },
  top: { paddingTop: spacing.md },
  content: { padding: spacing.md, gap: spacing.sm },
  flex: { flex: 1 },
  inlineError: { flexDirection: "row", gap: spacing.xs, alignItems: "center", padding: spacing.sm, backgroundColor: colors.accentSoft, borderRadius: radius.md },
  item: {
    flexDirection: "row", gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  itemBody: { flex: 1, gap: spacing.xxs },
  itemTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xxs },
  remove: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginTop: -10, marginRight: -8 },
  itemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.xxs },
  subtotal: { fontSize: 17, fontFamily: font.bold, color: colors.primaryDark },
  bar: {
    position: "absolute", left: 0, right: 0, bottom: 0, gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.md,
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadow.bar,
  },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  total: { ...type.display, color: colors.primaryDark },
});

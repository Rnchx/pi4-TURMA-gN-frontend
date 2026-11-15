import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import StateView from "../components/ui/StateView";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { catalogApi } from "../services/api";
import { rememberProducts } from "../state/productCache";
import { padGrid } from "../utils/grid";
import { colors, radius, spacing, type } from "../theme";

// E12 ofertas demonstrativas (CT22): preço anterior, preço atual e o aviso devolvido pela API.
export default function Offers({ navigation }) {
  const toast = useToast();
  const [state, setState] = useState({ status: "loading", offers: [], aviso: "", error: null });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: prev.offers.length ? prev.status : "loading", error: null }));
    try {
      const data = await catalogApi.listOffers();
      rememberProducts(data.ofertas);
      setState({ status: "ready", offers: data.ofertas, aviso: data.aviso, error: null });
    } catch (error) {
      setState((prev) => ({ ...prev, status: "error", error }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const header = state.aviso ? (
    <View style={styles.notice} accessibilityRole="alert">
      <MaterialCommunityIcons name="tag-outline" size={20} color={colors.accentText} />
      <Text style={[type.small, styles.flex]}>{state.aviso}</Text>
    </View>
  ) : null;

  const empty = state.status === "loading" ? (
    <ProductGridSkeleton count={4} />
  ) : state.status === "error" ? (
    <StateView
      tone={state.error?.offline ? "offline" : "error"}
      title="Não foi possível carregar as ofertas"
      message={state.error?.message}
      actionLabel="Tentar novamente"
      actionIcon="refresh"
      onAction={load}
    />
  ) : (
    <StateView icon="tag-off-outline" title="Nenhuma oferta no momento" message="Volte mais tarde ou veja o catálogo completo."
      actionLabel="Ver produtos" actionIcon="storefront-outline" onAction={() => navigation.navigate("Home")} />
  );

  return (
    <FlatList
      data={state.status === "ready" ? padGrid(state.offers) : []}
      keyExtractor={(item) => String(item.produtoId)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      renderItem={({ item }) => (item.vazio ? <View style={styles.flex} /> : (
        <ProductCard
          product={item}
          onOpen={(p) => navigation.navigate("ProductDetails", { produtoId: p.produtoId })}
          onAdded={(p) => toast.show({ message: `${p.nome} foi para o carrinho.`, actionLabel: "Ver carrinho", onAction: () => navigation.navigate("ShopCart") })}
        />
      ))}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: spacing.sm },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
  flex: { flex: 1 },
  notice: {
    flexDirection: "row", gap: spacing.xs, alignItems: "center", padding: spacing.sm, marginHorizontal: spacing.md,
    marginBottom: spacing.xxs, backgroundColor: colors.accentSoft, borderRadius: radius.md,
  },
});

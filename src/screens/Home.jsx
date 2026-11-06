import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import PressableScale from "../components/ui/PressableScale";
import StateView from "../components/ui/StateView";
import { ProductGridSkeleton, Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { categoryIcon, categoryLabel } from "../components/categoryIcon";
import { catalogApi } from "../services/api";
import { rememberProducts } from "../state/productCache";
import { padGrid } from "../utils/grid";
import { colors, motion, radius, shadow, spacing, type } from "../theme";

// E1 catálogo (CT1) e E2 categorias (CT3): tudo vem da API SAFRA.
export default function Home({ navigation }) {
  const toast = useToast();
  const [state, setState] = useState({ status: "loading", products: [], categories: [], error: null });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: prev.products.length ? prev.status : "loading", error: null }));
    try {
      const [catalog, classification] = await Promise.all([catalogApi.listProducts(), catalogApi.listCategories()]);
      rememberProducts(catalog.produtos);
      setState({ status: "ready", products: catalog.produtos, categories: classification.categorias, error: null });
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

  const openProduct = (product) => navigation.navigate("ProductDetails", { produtoId: product.produtoId });
  const openCategory = (category) =>
    navigation.navigate("CategoryProducts", { categoriaId: category.categoriaId, nome: category.nome });
  const onAdded = (product) => toast.show({
    message: `${product.nome} foi para o carrinho.`,
    actionLabel: "Ver carrinho",
    onAction: () => navigation.navigate("ShopCart"),
  });

  const header = (
    <View style={styles.header}>
      <Animated.View entering={FadeInDown.duration(motion.enter).easing(motion.easeOut)} style={styles.hero}>
        <MaterialCommunityIcons name="leaf" size={120} color={colors.primaryPressed} style={styles.heroLeaf} />
        <Text style={styles.heroKicker}>Do campo para a sua mesa</Text>
        <Text style={styles.heroTitle}>Compras fresquinhas, sem sair de casa</Text>
        <Text style={styles.heroText}>Monte o carrinho e finalize uma compra demonstrativa, sem cobrança.</Text>
      </Animated.View>

      <Text style={[type.heading, styles.sectionTitle]} accessibilityRole="header">Categorias</Text>
      {state.status === "loading" && !state.categories.length ? (
        <View style={styles.categories}>
          {[0, 1, 2].map((key) => <Skeleton key={key} width="31%" height={92} rounded={radius.lg} />)}
        </View>
      ) : (
        <Animated.View entering={FadeInDown.duration(motion.enter).easing(motion.easeOut)} style={styles.categories}>
          {state.categories.map((category) => (
            <View key={category.categoriaId} style={styles.categoryCell}>
              <PressableScale
                onPress={() => openCategory(category)}
                accessibilityRole="button"
                accessibilityLabel={`Categoria ${categoryLabel(category.nome)}`}
                style={styles.category}
              >
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons name={categoryIcon(category.nome)} size={26} color={colors.primary} />
                </View>
                <Text style={styles.categoryName} maxFontSizeMultiplier={1.3}>{categoryLabel(category.nome)}</Text>
              </PressableScale>
            </View>
          ))}
        </Animated.View>
      )}

      <View style={styles.listTitle}>
        <Text style={type.heading} accessibilityRole="header">Todos os produtos</Text>
        {state.status === "ready" ? <Text style={type.small}>{state.products.length} itens</Text> : null}
      </View>
    </View>
  );

  const empty = state.status === "loading" ? (
    <ProductGridSkeleton count={4} />
  ) : state.status === "error" ? (
    <StateView
      tone={state.error?.offline ? "offline" : "error"}
      title={state.error?.offline ? "Sem conexão com o SAFRA" : "Não foi possível carregar o catálogo"}
      message={state.error?.message}
      actionLabel="Tentar novamente"
      actionIcon="refresh"
      onAction={load}
    />
  ) : (
    <StateView title="Nenhum produto disponível" message="O catálogo está vazio no momento. Tente novamente mais tarde." />
  );

  return (
    <FlatList
      data={state.status === "ready" ? padGrid(state.products) : []}
      keyExtractor={(item) => String(item.produtoId)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      renderItem={({ item }) => (item.vazio ? <View style={styles.flex} /> : <ProductCard product={item} onOpen={openProduct} onAdded={onAdded} />)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
      initialNumToRender={8}
      windowSize={7}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl, gap: spacing.sm },
  header: { paddingTop: spacing.md, gap: spacing.sm, marginBottom: spacing.xxs },
  hero: {
    marginHorizontal: spacing.md, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.primary,
    overflow: "hidden", gap: spacing.xs, ...shadow.card,
  },
  heroLeaf: { position: "absolute", right: -18, bottom: -26, transform: [{ rotate: "-20deg" }] },
  heroKicker: { ...type.caption, color: colors.primaryMuted, textTransform: "uppercase" },
  heroTitle: { ...type.display, color: colors.onPrimary, maxWidth: 300 },
  heroText: { ...type.small, color: colors.primarySoft, maxWidth: 300 },
  sectionTitle: { marginHorizontal: spacing.md, marginTop: spacing.xs },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, paddingHorizontal: spacing.md },
  categoryCell: { width: "31.5%", flexGrow: 1 },
  category: {
    minHeight: 92, alignItems: "center", justifyContent: "center", gap: spacing.xxs, padding: spacing.xs,
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
  },
  categoryIcon: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  categoryName: { fontSize: 13, lineHeight: 17, fontWeight: "700", color: colors.ink, textAlign: "center" },
  listTitle: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginHorizontal: spacing.md, marginTop: spacing.sm },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
  flex: { flex: 1 },
});

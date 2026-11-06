import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import PressableScale from "../components/ui/PressableScale";
import StateView from "../components/ui/StateView";
import SectionTitle from "../components/ui/SectionTitle";
import BrandMark from "../components/brand/BrandMark";
import { SpeedLines, Wheel, enter, rise } from "../components/brand/Motion";
import { ProductGridSkeleton, Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { categoryIcon, categoryLabel } from "../components/categoryIcon";
import { catalogApi } from "../services/api";
import { rememberProducts } from "../state/productCache";
import { padGrid } from "../utils/grid";
import { font, colors, radius, spacing, type } from "../theme";

const WAVE = require("../../assets/brand/onda.png");
const WAVE_RATIO = 0.16; // altura da onda em relação à largura da tela (achatada para não roubar espaço)

// E1 catálogo (CT1) e E2 categorias (CT3): tudo vem da API SAFRA.
export default function Home({ navigation }) {
  const toast = useToast();
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
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
      {/* Faixa azul que continua o cabeçalho e termina na onda com contorno laranja da marca. */}
      <View style={styles.hero}>
        <View style={styles.heroBody}>
          <View style={styles.heroText}>
            <Animated.Text style={[styles.heroKicker, rise({ reduced, delay: 60 })]}>MERCADO ONLINE</Animated.Text>
            <Animated.Text style={[styles.heroTitle, rise({ reduced, delay: 120 })]}>Suas compras andam até você</Animated.Text>
            <Animated.Text style={[styles.heroSub, rise({ reduced, delay: 180 })]}>
              Monte o carrinho e finalize uma compra demonstrativa, sem cobrança.
            </Animated.Text>
          </View>
          <View style={styles.heroMark}>
            <SpeedLines width={44} delay={260} duration={520} style={styles.heroLines} />
            <Animated.View style={enter({ reduced, delay: 200, distance: 28, duration: 520 })}>
              <BrandMark size={52} renderWheel={(style, index) => <Wheel style={style} delay={640 + index * 70} />} />
            </Animated.View>
          </View>
        </View>
        <Image source={WAVE} style={[styles.wave, { height: Math.round(width * WAVE_RATIO) }]} resizeMode="stretch" accessibilityIgnoresInvertColors />
      </View>

      {state.status === "loading" || state.categories.length ? <SectionTitle title="Categorias" style={styles.section} /> : null}
      {state.status === "loading" && !state.categories.length ? (
        <View style={styles.categories}>
          {[0, 1, 2].map((key) => <Skeleton key={key} width="31%" height={92} rounded={radius.lg} />)}
        </View>
      ) : (
        <View style={styles.categories}>
          {state.categories.map((category, index) => (
            <Animated.View key={category.categoriaId} style={[styles.categoryCell, enter({ reduced, delay: 80 + index * 40, distance: 16 })]}>
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
            </Animated.View>
          ))}
        </View>
      )}

      <SectionTitle
        title="Todos os produtos"
        aside={state.status === "ready" ? `${state.products.length} itens` : null}
        style={[styles.section, styles.listTitle]}
      />
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
  header: { gap: spacing.sm, marginBottom: spacing.xxs },
  hero: {},
  heroBody: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.xs, backgroundColor: colors.primary },
  heroText: { flex: 1, gap: spacing.xxs },
  heroKicker: { ...type.caption, color: colors.accentOnPrimary },
  heroTitle: { ...type.display, color: colors.onPrimary },
  heroSub: { ...type.small, color: colors.primaryMuted },
  heroMark: { flexDirection: "row", alignItems: "center", marginRight: spacing.xxs },
  heroLines: { marginRight: -2, marginTop: -4 },
  // Proporção da onda (1000 × 224); o branco sob o contorno é trocado pelo fundo da tela.
  wave: { width: "100%", marginTop: -1 },
  section: { marginHorizontal: spacing.md },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, paddingHorizontal: spacing.md },
  categoryCell: { width: "31.5%", flexGrow: 1 },
  category: {
    minHeight: 92, alignItems: "center", justifyContent: "center", gap: spacing.xxs, padding: spacing.xs,
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
  },
  categoryIcon: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  categoryName: { fontSize: 13, lineHeight: 17, fontFamily: font.bold, color: colors.ink, textAlign: "center" },
  listTitle: { marginTop: spacing.sm },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
  flex: { flex: 1 },
});

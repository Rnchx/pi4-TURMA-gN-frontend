import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import Chip from "../components/ui/Chip";
import StateView from "../components/ui/StateView";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { categoryIcon, categoryLabel } from "../components/categoryIcon";
import { catalogApi } from "../services/api";
import { rememberProducts } from "../state/productCache";
import { padGrid } from "../utils/grid";
import { capitalize } from "../utils/format";
import { colors, radius, spacing, type } from "../theme";

// E2: produtos da categoria (complemento /categorias/:id/produtos) e por subcategoria (CT6).
export default function CategoryProducts({ navigation, route }) {
  const { categoriaId, nome } = route.params ?? {};
  const toast = useToast();
  const listRef = useRef(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState({ status: "loading", products: [], error: null });
  const request = useRef(0);

  useEffect(() => {
    navigation.setOptions({ title: categoryLabel(nome) });
  }, [navigation, nome]);

  const load = useCallback(async (subcategoriaId) => {
    const ticket = ++request.current;
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    try {
      const data = subcategoriaId
        ? await catalogApi.productsByClassification(categoriaId, subcategoriaId)
        : await catalogApi.productsByCategory(categoriaId);
      if (ticket !== request.current) return;
      rememberProducts(data.produtos);
      setState({ status: "ready", products: data.produtos, error: null });
    } catch (error) {
      if (ticket === request.current) setState({ status: "error", products: [], error });
    }
  }, [categoriaId]);

  // Ao abrir outra categoria (mesma tela, novos parâmetros), volta ao início e recarrega.
  useEffect(() => {
    if (!categoriaId) return;
    setSelected(null);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    load(null);
    catalogApi.listCategories()
      .then((data) => setSubcategories(data.categorias.find((c) => c.categoriaId === categoriaId)?.subcategorias ?? []))
      .catch(() => setSubcategories([]));
  }, [categoriaId, load]);

  const choose = (subcategoriaId) => {
    if (subcategoriaId === selected) return;
    setSelected(subcategoriaId);
    load(subcategoriaId);
  };

  const onAdded = (product) => toast.show({
    message: `${product.nome} foi para o carrinho.`,
    actionLabel: "Ver carrinho",
    onAction: () => navigation.navigate("ShopCart"),
  });

  if (!categoriaId) {
    return (
      <View style={styles.screen}>
        <StateView title="Categoria não encontrada" actionLabel="Ver categorias" onAction={() => navigation.navigate("Home")} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name={categoryIcon(nome)} size={28} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text style={type.title} accessibilityRole="header">{categoryLabel(nome)}</Text>
          {state.status === "ready" ? <Text style={type.small}>{state.products.length} produtos</Text> : null}
        </View>
      </View>
      {subcategories.length ? (
        <View style={styles.chips} accessibilityRole="tablist">
          <Chip label="Todos" selected={selected === null} onPress={() => choose(null)} />
          {subcategories.map((sub) => (
            <Chip key={sub.subcategoriaId} label={capitalize(sub.nome)} selected={selected === sub.subcategoriaId}
              onPress={() => choose(sub.subcategoriaId)} />
          ))}
        </View>
      ) : null}
    </View>
  );

  const empty = state.status === "loading" ? (
    <ProductGridSkeleton count={4} />
  ) : state.status === "error" ? (
    <StateView
      tone={state.error?.offline ? "offline" : "error"}
      title="Não foi possível carregar os produtos"
      message={state.error?.message}
      actionLabel="Tentar novamente"
      actionIcon="refresh"
      onAction={() => load(selected)}
    />
  ) : (
    <StateView title="Nenhum produto aqui" message="Esta seleção não tem produtos disponíveis no momento." compact />
  );

  return (
    <FlatList
      ref={listRef}
      data={state.status === "ready" ? padGrid(state.products) : []}
      keyExtractor={(item) => String(item.produtoId)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      renderItem={({ item }) => (item.vazio ? <View style={styles.flex} /> : (
        <ProductCard product={item} onOpen={(p) => navigation.navigate("ProductDetails", { produtoId: p.produtoId })} onAdded={onAdded} />
      ))}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl, gap: spacing.sm },
  header: { padding: spacing.md, gap: spacing.md },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md },
});

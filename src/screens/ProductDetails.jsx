import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import { OfferBadge, PreviousPrice } from "../components/OfferPrice";
import Button from "../components/ui/Button";
import QuantityStepper from "../components/ui/QuantityStepper";
import StateView from "../components/ui/StateView";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { categoryLabel } from "../components/categoryIcon";
import { catalogApi } from "../services/api";
import { useCart } from "../state/CartContext";
import { rememberProducts } from "../state/productCache";
import { capitalize, money } from "../utils/format";
import { colors, motion, radius, shadow, spacing, type } from "../theme";

// E3 detalhes do produto (CT7) e E4 adição ao carrinho (CT8).
export default function ProductDetails({ navigation, route }) {
  const produtoId = route.params?.produtoId;
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { addItem, pending } = useCart();
  const scrollRef = useRef(null);
  const [state, setState] = useState({ status: "loading", product: null, related: [], classification: null, error: null });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    try {
      const product = await catalogApi.product(produtoId);
      rememberProducts([product]);
      const [related, classification] = await Promise.all([
        catalogApi.productsByCategory(product.categoriaId).then((d) => d.produtos).catch(() => []),
        catalogApi.listCategories().then((d) => d.categorias.find((c) => c.categoriaId === product.categoriaId)).catch(() => null),
      ]);
      rememberProducts(related);
      setState({
        status: "ready", product, error: null,
        related: related.filter((p) => p.produtoId !== product.produtoId).slice(0, 4),
        classification: classification
          ? { categoria: categoryLabel(classification.nome),
            subcategoria: classification.subcategorias.find((s) => s.subcategoriaId === product.subcategoriaId)?.nome }
          : null,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, status: "error", error }));
    }
  }, [produtoId]);

  // Outro produto aberto a partir desta tela: novos parâmetros, mesma tela (React Navigation 7).
  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (produtoId) load();
  }, [produtoId, load]);

  const busy = state.product ? pending.has(state.product.produtoId) : false;

  const add = async () => {
    try {
      await addItem(state.product, quantity);
      setAdded(true);
      setQuantity(1);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), 1600);
      toast.show({
        message: `${state.product.nome} foi para o carrinho.`,
        actionLabel: "Ver carrinho",
        onAction: () => navigation.navigate("ShopCart"),
      });
    } catch (error) {
      toast.show({ tone: "error", message: error.message });
    }
  };

  if (!produtoId) {
    return (
      <View style={styles.screen}>
        <StateView title="Produto não encontrado" actionLabel="Voltar ao catálogo" onAction={() => navigation.navigate("Home")} />
      </View>
    );
  }

  if (state.status === "error") {
    const notFound = state.error?.codigo === "produtoNaoEncontrado";
    return (
      <View style={[styles.screen, styles.center]}>
        <StateView
          tone={notFound ? "empty" : state.error?.offline ? "offline" : "error"}
          title={notFound ? "Produto indisponível" : "Não foi possível abrir o produto"}
          message={state.error?.message}
          actionLabel={notFound ? "Voltar ao catálogo" : "Tentar novamente"}
          actionIcon={notFound ? undefined : "refresh"}
          onAction={notFound ? () => navigation.navigate("Home") : load}
        />
      </View>
    );
  }

  const product = state.product;
  return (
    <View style={styles.screen}>
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingBottom: 140 + insets.bottom }]}>
        {state.status === "loading" ? (
          <View style={styles.block}>
            <Skeleton height={260} rounded={radius.xl} />
            <Skeleton width="70%" height={22} />
            <Skeleton width="40%" height={28} />
            <Skeleton height={60} />
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(motion.enter)} style={styles.block}>
            <View style={styles.imageWrap}>
              <ProductImage uri={product.imagemUrl} label={product.nome} rounded={radius.xl} />
              {product.emOferta ? <OfferBadge style={styles.badge} /> : null}
            </View>
            {state.classification ? (
              <Text style={styles.breadcrumb}>
                {state.classification.categoria}{state.classification.subcategoria ? ` · ${capitalize(state.classification.subcategoria)}` : ""}
              </Text>
            ) : null}
            <Text style={type.title} accessibilityRole="header">{product.nome}</Text>
            <View>
              <PreviousPrice product={product} size="lg" />
              <Text style={styles.price}>{money(product.preco)}</Text>
            </View>
            <View style={styles.descriptionBox}>
              <Text style={type.caption}>DESCRIÇÃO</Text>
              <Text style={type.body}>{product.descricao}</Text>
            </View>
            <View style={styles.notice}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primary} />
              <Text style={[type.small, styles.flex]}>Preço confirmado pelo SAFRA ao adicionar. Compra demonstrativa, sem cobrança.</Text>
            </View>
          </Animated.View>
        )}

        {state.related.length ? (
          <Animated.View entering={FadeInDown.duration(motion.enter).easing(motion.easeOut)} style={styles.related}>
            <Text style={type.heading} accessibilityRole="header">Você também pode gostar</Text>
            <View style={styles.relatedGrid}>
              {state.related.map((item) => (
                <View key={item.produtoId} style={styles.relatedCell}>
                  <ProductCard product={item} onOpen={(p) => navigation.navigate("ProductDetails", { produtoId: p.produtoId })} />
                </View>
              ))}
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      {product ? (
        <View style={[styles.bar, { paddingBottom: spacing.sm + insets.bottom }]}>
          <QuantityStepper value={quantity} onChange={setQuantity} busy={busy} size="lg" label={`Quantidade de ${product.nome}`} />
          <Button
            title={added ? "Adicionado" : "Adicionar"}
            icon={added ? "check" : "cart-plus"}
            variant={added ? "accent" : "primary"}
            loading={busy}
            onPress={add}
            containerStyle={styles.flex}
            accessibilityLabel={`Adicionar ${quantity} ao carrinho`}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center" },
  content: { padding: spacing.md, gap: spacing.lg },
  block: { gap: spacing.sm },
  imageWrap: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.sm, ...shadow.card },
  badge: { position: "absolute", top: spacing.md, left: spacing.md },
  breadcrumb: { ...type.caption, color: colors.primary, textTransform: "uppercase" },
  price: { ...type.display, color: colors.primaryDark },
  descriptionBox: { gap: spacing.xxs, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg },
  notice: { flexDirection: "row", gap: spacing.xs, alignItems: "flex-start", padding: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radius.md },
  flex: { flex: 1 },
  related: { gap: spacing.sm },
  relatedGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  relatedCell: { width: "47.5%", flexGrow: 1 },
  bar: {
    position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, ...shadow.bar,
  },
});

import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./ui/PressableScale";
import ProductImage from "./ProductImage";
import { OfferBadge, PreviousPrice } from "./OfferPrice";
import { useCart } from "../state/CartContext";
import { useToast } from "./ui/Toast";
import { StyleSheet, font, colors, motion, radius, shadow, spacing, type } from "../theme";
import { money } from "../utils/format";

// Cartão do catálogo: toque abre os detalhes (CT7); o botão "+" adiciona 1 unidade (CT8).
export default function ProductCard({ product, onOpen, onAdded, style, compact = false }) {
  const { addItem, pending } = useCart();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);
  const busy = pending.has(product.produtoId);
  useEffect(() => () => clearTimeout(timer.current), []);

  const add = async () => {
    try {
      await addItem(product, 1);
      setAdded(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setAdded(false), 1400);
      onAdded?.(product);
    } catch (error) {
      toast.show({ tone: "error", message: error.message });
    }
  };

  // A área que abre os detalhes e o botão "+" são irmãos (na web, botão dentro de botão é HTML inválido).
  // Oferta e catálogo compartilham exatamente a mesma geometria; "compact" altera apenas o comportamento no FlatList horizontal.
  return (
    <View style={[styles.container, compact ? styles.compactContainer : styles.gridContainer, style]}>
      <PressableScale
        onPress={() => onOpen(product)}
        containerStyle={styles.detailsContainer}
        style={styles.details}
        accessibilityRole="button"
        accessibilityLabel={product.emOferta
          ? `${product.nome}, oferta, de ${money(product.precoAnterior)} por ${money(product.preco)}`
          : `${product.nome}, ${money(product.preco)}`}
        accessibilityHint="Abre os detalhes do produto"
      >
        <View>
          <ProductImage uri={product.imagemUrl} label={product.nome} />
          {product.emOferta ? <OfferBadge style={styles.badge} /> : null}
          {product.idadeMinima === 18 ? <View style={styles.ageBadge}><Text style={styles.ageText}>18+</Text></View> : null}
        </View>
        <Text style={styles.name} numberOfLines={2} maxFontSizeMultiplier={1.4}>{product.nome}</Text>
      </PressableScale>
      <View style={styles.bottom}>
        <View style={styles.priceBox}>
          <PreviousPrice product={product} />
          <Text style={type.price} maxFontSizeMultiplier={1.4}>{money(product.preco)}</Text>
        </View>
        <PressableScale
          onPress={add}
          disabled={busy}
          scaleTo={0.9}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${product.nome} ao carrinho`}
          accessibilityState={{ busy }}
          style={[styles.add, added && styles.added]}
        >
          {busy ? (
            <ActivityIndicator size="small" color={colors.onAction} />
          ) : (
            <Animated.View key={added ? "ok" : "plus"} entering={FadeIn.duration(motion.quick)}>
              <MaterialCommunityIcons name={added ? "check" : "plus"} size={22} color={added ? colors.onAccent : colors.onAction} />
            </Animated.View>
          )}
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 278, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  // Grade de 2 colunas: divide a linha igualmente.
  gridContainer: { flex: 1 },
  // Carrossel horizontal: a largura vem de `style` e não pode ser comprimida. Não usar o atalho `flex`
  // aqui: `flex: 0` vira `flex-basis: 0%` no React Native Web e, no eixo da lista, a base vence a largura.
  compactContainer: { flexGrow: 0, flexShrink: 0, flexBasis: "auto", alignSelf: "flex-start" },
  detailsContainer: { flex: 1 },
  details: { flex: 1, gap: spacing.xs, paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
  name: { fontSize: 14, lineHeight: 19, fontFamily: font.semibold, color: colors.ink, minHeight: 38 },
  bottom: { flexDirection: "row", alignItems: "flex-end", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingBottom: spacing.sm },
  priceBox: { flex: 1, minHeight: 44, justifyContent: "flex-end" },
  badge: { position: "absolute", top: 0, left: 0 },
  ageBadge: { position: "absolute", top: 0, right: 0, paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.danger },
  ageText: { fontSize: 12, fontFamily: font.bold, color: colors.onPrimary },
  add: {
    width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    transitionProperty: "backgroundColor", transitionDuration: motion.quick,
  },
  added: { backgroundColor: colors.accent },
});

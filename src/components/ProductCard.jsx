import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./ui/PressableScale";
import ProductImage from "./ProductImage";
import { OfferBadge, PreviousPrice } from "./OfferPrice";
import { useCart } from "../state/CartContext";
import { useToast } from "./ui/Toast";
import { font, colors, motion, radius, shadow, spacing, type } from "../theme";
import { money } from "../utils/format";

// Cartão do catálogo: toque abre os detalhes (CT7); o botão "+" adiciona 1 unidade (CT8).
export default function ProductCard({ product, onOpen, onAdded, style }) {
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
  return (
    <View style={[styles.container, style]}>
      <PressableScale
        onPress={() => onOpen(product)}
        containerStyle={styles.flex}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={product.emOferta
          ? `${product.nome}, oferta, de ${money(product.precoAnterior)} por ${money(product.preco)}`
          : `${product.nome}, ${money(product.preco)}`}
        accessibilityHint="Abre os detalhes do produto"
      >
        <View>
          <ProductImage uri={product.imagemUrl} label={product.nome} />
          {product.emOferta ? <OfferBadge style={styles.badge} /> : null}
        </View>
        <Text style={styles.name} maxFontSizeMultiplier={1.4}>{product.nome}</Text>
        <View style={styles.priceBox}>
          <PreviousPrice product={product} />
          <Text style={type.price} maxFontSizeMultiplier={1.4}>{money(product.preco)}</Text>
        </View>
      </PressableScale>
      <PressableScale
        onPress={add}
        disabled={busy}
        scaleTo={0.9}
        containerStyle={styles.addPosition}
        accessibilityRole="button"
        accessibilityLabel={`Adicionar ${product.nome} ao carrinho`}
        accessibilityState={{ busy }}
        style={[styles.add, added && styles.added]}
      >
        {busy ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Animated.View key={added ? "ok" : "plus"} entering={FadeIn.duration(motion.quick)}>
            <MaterialCommunityIcons name={added ? "check" : "plus"} size={22} color={added ? colors.onAccent : colors.onPrimary} />
          </Animated.View>
        )}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  card: {
    flex: 1, gap: spacing.xs, padding: spacing.sm, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  name: { fontSize: 14, lineHeight: 19, fontFamily: font.semibold, color: colors.ink, flexGrow: 1 },
  // Reserva o espaço do botão "+" para o preço nunca ficar sob ele.
  priceBox: { paddingRight: 48, minHeight: 44, justifyContent: "flex-end" },
  badge: { position: "absolute", top: 0, left: 0 },
  addPosition: { position: "absolute", right: spacing.sm, bottom: spacing.sm },
  add: {
    width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    transitionProperty: "backgroundColor", transitionDuration: motion.quick,
  },
  added: { backgroundColor: colors.accent },
});

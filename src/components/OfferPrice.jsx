import { StyleSheet, Text, View } from "react-native";
import { font, colors, radius, spacing } from "../theme";
import { money } from "../utils/format";

// Selo "OFERTA" no laranja da marca (texto sempre azul sobre o laranja, conforme o manual).
export function OfferBadge({ style }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText} maxFontSizeMultiplier={1.3}>OFERTA</Text>
    </View>
  );
}

// Preço anterior riscado (E12, CT22). Os dois valores vêm da API; o aplicativo não calcula desconto.
export function PreviousPrice({ product, size = "sm" }) {
  if (!product?.emOferta || product.precoAnterior == null) return null;
  return (
    <Text
      style={[styles.previous, size === "lg" && styles.previousLg]}
      maxFontSizeMultiplier={1.4}
      accessibilityLabel={`De ${money(product.precoAnterior)}`}
    >
      {money(product.precoAnterior)}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  badgeText: { fontSize: 11, lineHeight: 15, letterSpacing: 1, fontFamily: font.bold, color: colors.onAccent },
  previous: { fontSize: 13, lineHeight: 17, fontFamily: font.medium, color: colors.inkMuted, textDecorationLine: "line-through" },
  previousLg: { fontSize: 16, lineHeight: 22 },
});

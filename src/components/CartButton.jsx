import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "./ui/PressableScale";
import { useCart } from "../state/CartContext";
import { colors, motion, radius, spacing } from "../theme";

// Ícone do carrinho no cabeçalho, com contador de unidades. O contador "pulsa" quando aumenta.
export default function CartButton({ tint = colors.onPrimary }) {
  const navigation = useNavigation();
  const { count } = useCart();
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const previous = useRef(count);

  useEffect(() => {
    if (count > previous.current && !reduced) {
      scale.set(withSequence(
        withTiming(1.3, { duration: motion.press, easing: motion.easeOut }),
        withTiming(1, { duration: motion.quick, easing: motion.easeOut }),
      ));
    }
    previous.current = count;
  }, [count, reduced, scale]);

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  const label = count === 0 ? "Carrinho vazio" : `Carrinho, ${count} ${count === 1 ? "unidade" : "unidades"}`;

  return (
    <PressableScale
      onPress={() => navigation.navigate("ShopCart")}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.button}
    >
      <MaterialCommunityIcons name="cart-outline" size={26} color={tint} />
      {count > 0 ? (
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>{count > 99 ? "99+" : count}</Text>
        </Animated.View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: spacing.xxs },
  badge: {
    position: "absolute", top: 4, right: 2, minWidth: 20, height: 20, paddingHorizontal: 4,
    borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: colors.primary,
  },
  badgeText: { fontSize: 11, fontWeight: "800", color: colors.ink },
});

export function BadgeCount({ count }) {
  if (!count) return null;
  return (
    <View style={[styles.badge, { position: "relative", top: 0, right: 0, borderColor: colors.accent }]}>
      <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "./ui/PressableScale";
import { SpeedLines } from "./brand/Motion";
import { useCart } from "../state/CartContext";
import { font, colors, motion, radius, spacing } from "../theme";

// Ícone do carrinho no cabeçalho, com contador de unidades. Quando um produto entra, o carrinho
// "anda": dá uma arrancada para a frente com as linhas de velocidade da marca atrás dele, e o
// contador pulsa. Tudo em transform/opacity na thread de UI; com redução de movimento, só o número muda.
export default function CartButton({ tint = colors.onPrimary }) {
  const navigation = useNavigation();
  const { count } = useCart();
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const previous = useRef(count);
  const [trip, setTrip] = useState(0);

  useEffect(() => {
    if (count > previous.current && !reduced) {
      scale.set(withSequence(
        withTiming(1.3, { duration: motion.press, easing: motion.easeOut }),
        withTiming(1, { duration: motion.quick, easing: motion.easeOut }),
      ));
      setTrip((n) => n + 1);
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
      {trip > 0 ? <Animated.View key={`l${trip}`} style={[styles.lines, linesFlash]}><SpeedLines width={18} duration={200} /></Animated.View> : null}
      <Animated.View key={`c${trip}`} style={trip > 0 && drive}>
        <MaterialCommunityIcons name="cart-outline" size={26} color={tint} />
      </Animated.View>
      {count > 0 ? (
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>{count > 99 ? "99+" : count}</Text>
        </Animated.View>
      ) : null}
    </PressableScale>
  );
}

// Arrancada do ícone: recua 2 px e avança 5 px antes de voltar (320 ms).
const drive = {
  animationName: {
    "0%": { transform: [{ translateX: 0 }] },
    "25%": { transform: [{ translateX: -2 }] },
    "60%": { transform: [{ translateX: 5 }] },
    "100%": { transform: [{ translateX: 0 }] },
  },
  animationDuration: 320,
  animationTimingFunction: motion.easeOutCss,
};

// As linhas aparecem atrás do carrinho e somem logo depois.
const linesFlash = {
  animationName: { "0%": { opacity: 0 }, "30%": { opacity: 1 }, "100%": { opacity: 0 } },
  animationDuration: 520,
  animationFillMode: "both",
};

const styles = StyleSheet.create({
  button: { width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: spacing.xxs },
  lines: { position: "absolute", left: -8, top: 19 },
  badge: {
    position: "absolute", top: 4, right: 2, minWidth: 20, height: 20, paddingHorizontal: 4,
    borderRadius: radius.pill, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: colors.primary,
  },
  badgeText: { fontSize: 11, lineHeight: 13, fontFamily: font.bold, color: colors.onAccent },
});

export function BadgeCount({ count }) {
  if (!count) return null;
  return (
    <View style={[styles.badge, { position: "relative", top: 0, right: 0, borderColor: colors.accent }]}>
      <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

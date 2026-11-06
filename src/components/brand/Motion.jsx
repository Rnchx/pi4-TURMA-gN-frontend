import { StyleSheet, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { colors, motion } from "../../theme";

// Linhas de velocidade do símbolo (logo-safra-online-horizontal.png): três traços arredondados,
// o do meio precedido de um ponto. Medidas relativas à largura total do conjunto.
const BARS = [
  { left: 0.24, width: 0.51, top: 0 },
  { left: 0.21, width: 0.66, top: 0.27, dot: true },
  { left: 0.31, width: 0.69, top: 0.55 },
];

// Entram da esquerda para a direita, escalonadas, como o carrinho ganhando velocidade.
// Animação CSS do Reanimated (thread de UI, só opacidade e translateX). Para repetir, troque a `key`.
// Com redução de movimento, aparecem sem deslocamento.
export function SpeedLines({ width = 60, color = colors.accent, delay = 0, duration = 420, style }) {
  const reduced = useReducedMotion();
  const thickness = Math.max(3, width * 0.095);
  const height = thickness + width * 0.55;
  return (
    <View style={[{ width, height }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {BARS.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              left: width * bar.left,
              width: width * bar.width,
              top: bar.top * width,
              height: thickness,
              backgroundColor: color,
            },
            enter({ reduced, distance: width * 0.35, delay: delay + index * 60, duration }),
          ]}
        >
          {bar.dot ? (
            <View style={[styles.bar, { left: -(width * 0.21), width: thickness * 1.4, height: thickness, backgroundColor: color }]} />
          ) : null}
        </Animated.View>
      ))}
    </View>
  );
}

// Entrada "para a frente": opacidade + translateX vindo da esquerda, ease-out forte.
export function enter({ reduced, distance = 24, delay = 0, duration = motion.enter, from = "left" }) {
  const dx = from === "left" ? -distance : distance;
  return {
    animationName: reduced
      ? { from: { opacity: 0 }, to: { opacity: 1 } }
      : { from: { opacity: 0, transform: [{ translateX: dx }] }, to: { opacity: 1, transform: [{ translateX: 0 }] } },
    animationDuration: reduced ? Math.min(duration, 200) : duration,
    animationDelay: delay,
    animationFillMode: "both",
    animationTimingFunction: motion.easeOutCss,
  };
}

// Subida curta com opacidade (textos e cartões). Nunca a partir de escala zero.
export function rise({ reduced, distance = 12, delay = 0, duration = motion.enter }) {
  return {
    animationName: reduced
      ? { from: { opacity: 0 }, to: { opacity: 1 } }
      : { from: { opacity: 0, transform: [{ translateY: distance }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } },
    animationDuration: reduced ? Math.min(duration, 200) : duration,
    animationDelay: delay,
    animationFillMode: "both",
    animationTimingFunction: motion.easeOutCss,
  };
}

// Rodinhas que "assentam" depois que o carrinho chega: pequeno quique vertical, uma após a outra.
export function wheelSettle({ reduced, delay = 0 }) {
  if (reduced) return null;
  return {
    animationName: {
      "0%": { transform: [{ translateY: 0 }] },
      "40%": { transform: [{ translateY: -3 }] },
      "100%": { transform: [{ translateY: 0 }] },
    },
    animationDuration: 320,
    animationDelay: delay,
    animationFillMode: "both",
    animationTimingFunction: "ease-in-out",
  };
}

export function Wheel({ style, delay }) {
  const reduced = useReducedMotion();
  return <Animated.View style={[style, wheelSettle({ reduced, delay })]} />;
}

const styles = StyleSheet.create({
  bar: { position: "absolute", borderRadius: 999 },
});

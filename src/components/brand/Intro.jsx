import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { SpeedLines, enter, rise } from "./Motion";
import { colors, font, motion } from "../../theme";

const ICON = require("../../../assets/design/images/icone-app-safra-online.png");

const TOTAL = 1350; // tempo em tela antes de sair
const EXIT = 280;

// Abertura do app: continua exatamente a splash nativa (ícone sobre o Azul Safra) e dá vida a ela.
// O ícone avança um pouco para a direita, as linhas de velocidade entram atrás dele e a assinatura
// sobe. Depois a camada inteira sai com opacidade. Acontece uma vez por abertura (nível "delícia").
// Com redução de movimento: só aparece a assinatura e a camada some com fade, sem deslocamentos.
export default function Intro({ onDone }) {
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const stay = reduced ? 700 : TOTAL;
    const t1 = setTimeout(() => setLeaving(true), stay);
    const t2 = setTimeout(onDone, stay + EXIT);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone, reduced]);

  return (
    <View
      pointerEvents={leaving ? "none" : "auto"}
      style={[
        StyleSheet.absoluteFill,
        styles.root,
        { opacity: leaving ? 0 : 1, transitionProperty: "opacity", transitionDuration: EXIT, transitionTimingFunction: "ease-out" },
      ]}
      accessibilityLabel="SAFRA Online"
    >
      <View style={styles.stage}>
        <SpeedLines width={70} delay={160} duration={480} style={styles.lines} />
        <Animated.View style={!reduced && nudge}>
          <Image source={ICON} style={styles.icon} accessibilityIgnoresInvertColors />
        </Animated.View>
      </View>
      {/* A assinatura fica abaixo do ícone sem deslocá-lo: o ícone continua no mesmo lugar da splash nativa. */}
      <View style={styles.words} pointerEvents="none">
        <Animated.Text style={[styles.name, rise({ reduced, delay: 260, duration: 420 })]}>safra</Animated.Text>
        <Animated.View style={enter({ reduced, delay: 380, distance: 18, duration: 420 })}>
          <Text style={styles.tag}>ONLINE</Text>
        </Animated.View>
      </View>
    </View>
  );
}

// "Arrancada": recua 4 px (pega impulso) e avança 10 px, voltando ao centro. Só translateX.
const nudge = {
  animationName: {
    "0%": { transform: [{ translateX: 0 }] },
    "20%": { transform: [{ translateX: -4 }] },
    "55%": { transform: [{ translateX: 10 }] },
    "100%": { transform: [{ translateX: 0 }] },
  },
  animationDuration: 700,
  animationDelay: 80,
  animationFillMode: "both",
  animationTimingFunction: motion.easeOutCss,
};

const styles = StyleSheet.create({
  root: { zIndex: 100, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stage: { flexDirection: "row", alignItems: "center", marginLeft: -60 },
  lines: { marginRight: -6, marginTop: 8 },
  icon: { width: 150, height: 150 },
  words: { position: "absolute", top: "50%", left: 0, right: 0, marginTop: 92, alignItems: "center" },
  name: { fontFamily: font.bold, fontSize: 46, lineHeight: 52, color: colors.onPrimary, letterSpacing: -0.6 },
  tag: { fontFamily: font.regular, fontSize: 16, lineHeight: 20, letterSpacing: 9, color: colors.accentOnPrimary, marginLeft: 9 },
});

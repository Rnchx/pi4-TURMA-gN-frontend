import { StyleSheet, Text, View } from "react-native";
import BrandMark from "./brand/BrandMark";
import { colors, font } from "../theme";

// Assinatura horizontal da marca (logo-safra-online-horizontal.png) em versão para o cabeçalho azul:
// monograma branco com rodas laranja, "safra" em Outfit Bold e "ONLINE" espaçado em laranja.
export default function Brand({ light = true, size = "md" }) {
  const big = size === "lg";
  return (
    <View style={styles.row} accessible accessibilityRole="header" accessibilityLabel="SAFRA Online">
      <BrandMark size={big ? 26 : 18} tone={light ? "light" : "dark"} />
      <View>
        <Text style={[styles.name, big && styles.nameLg, { color: light ? colors.onPrimary : colors.primary }]} maxFontSizeMultiplier={1.2}>
          safra
        </Text>
        <Text style={[styles.tag, big && styles.tagLg, { color: light ? colors.accentOnPrimary : colors.accentText }]} maxFontSizeMultiplier={1.2}>
          ONLINE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontFamily: font.bold, fontSize: 22, lineHeight: 22, letterSpacing: -0.4 },
  nameLg: { fontSize: 30, lineHeight: 30 },
  tag: { fontFamily: font.regular, fontSize: 9, lineHeight: 11, letterSpacing: 4.2, marginTop: 1 },
  tagLg: { fontSize: 12, lineHeight: 15, letterSpacing: 5.6 },
});

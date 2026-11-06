import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing } from "../theme";

// Assinatura textual da marca sobre o verde do cabeçalho (o logotipo em imagem é azul e laranja).
export default function Brand({ light = true }) {
  const fg = light ? colors.onPrimary : colors.primaryDark;
  return (
    <View style={styles.row} accessible accessibilityRole="header" accessibilityLabel="SAFRA Online">
      <MaterialCommunityIcons name="sprout-outline" size={22} color={light ? colors.primaryMuted : colors.primary} />
      <Text style={[styles.name, { color: fg }]} maxFontSizeMultiplier={1.3}>safra</Text>
      <Text style={[styles.tag, { color: light ? colors.primaryMuted : colors.accentText }]} maxFontSizeMultiplier={1.3}>ONLINE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  name: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  tag: { fontSize: 11, fontWeight: "700", letterSpacing: 2, marginTop: 4 },
});

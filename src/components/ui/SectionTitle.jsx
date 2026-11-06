import { StyleSheet, Text, View } from "react-native";
import { colors, font, spacing, type } from "../../theme";

// Título de seção com o traço laranja da assinatura (banner-safra-readme-*.png, sob "ONLINE").
export default function SectionTitle({ title, aside, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.flex}>
        <Text style={type.heading} accessibilityRole="header" maxFontSizeMultiplier={1.4}>{title}</Text>
        <View style={styles.underline} />
      </View>
      {aside ? <Text style={styles.aside} maxFontSizeMultiplier={1.4}>{aside}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: spacing.sm },
  flex: { flexShrink: 1 },
  underline: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.accent, marginTop: 4 },
  aside: { ...type.small, fontFamily: font.medium, paddingBottom: 6 },
});

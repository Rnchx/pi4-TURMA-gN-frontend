import { StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./PressableScale";
import { font, colors, motion, radius, spacing } from "../../theme";

export default function Chip({ label, selected = false, onPress, icon }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          transitionProperty: ["backgroundColor", "borderColor"],
          transitionDuration: motion.quick,
        },
      ]}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={selected ? colors.onPrimary : colors.primary} /> : null}
      <Text style={[styles.label, { color: selected ? colors.onPrimary : colors.ink }]} maxFontSizeMultiplier={1.4}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40, flexDirection: "row", alignItems: "center", gap: spacing.xxs,
    paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1.5,
  },
  label: { fontSize: 14, fontFamily: font.semibold },
});

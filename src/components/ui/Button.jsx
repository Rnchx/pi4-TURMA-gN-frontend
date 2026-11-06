import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./PressableScale";
import { colors, radius, spacing } from "../../theme";

const variants = {
  primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
  accent: { bg: colors.accent, fg: colors.ink, border: colors.accent },
  secondary: { bg: colors.primarySoft, fg: colors.primaryDark, border: colors.primarySoft },
  outline: { bg: colors.surface, fg: colors.primaryDark, border: colors.primaryMuted },
  ghost: { bg: "transparent", fg: colors.primaryDark, border: "transparent" },
  danger: { bg: colors.danger, fg: colors.onPrimary, border: colors.danger },
};

export default function Button({
  title, onPress, variant = "primary", icon, loading = false, disabled = false, size = "lg", style, containerStyle,
  accessibilityLabel, accessibilityHint,
}) {
  const v = variants[variant];
  const inactive = disabled || loading;
  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      containerStyle={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        styles.base,
        size === "md" ? styles.md : styles.lg,
        { backgroundColor: v.bg, borderColor: v.border, opacity: disabled && !loading ? 0.45 : 1 },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={v.fg} />
        ) : icon ? (
          <MaterialCommunityIcons name={icon} size={20} color={v.fg} />
        ) : null}
        <Text style={[styles.label, { color: v.fg }]} maxFontSizeMultiplier={1.4}>{title}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, borderWidth: 1.5, justifyContent: "center", paddingHorizontal: spacing.md },
  lg: { minHeight: 52, paddingVertical: spacing.sm },
  md: { minHeight: 44, paddingVertical: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs, flexWrap: "wrap" },
  label: { fontSize: 16, lineHeight: 22, fontWeight: "700", textAlign: "center", flexShrink: 1 },
});

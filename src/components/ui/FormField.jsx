import { Text, TextInput, View } from "react-native";
import { StyleSheet, colors, font, radius, spacing, touch, type } from "../../theme";

export default function FormField({ label, error, ...props }) {
  return (
    <View style={styles.group}>
      <Text style={type.smallStrong}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, error && styles.invalid]}
        placeholderTextColor={colors.inkSubtle}
        accessibilityLabel={label}
        accessibilityHint={error || props.accessibilityHint}
      />
      {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.xxs },
  input: {
    minHeight: touch.min, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    fontFamily: font.regular, fontSize: 16, color: colors.ink,
  },
  invalid: { borderColor: colors.danger },
  error: { ...type.small, color: colors.danger },
});

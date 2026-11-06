import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./Button";
import BrandMark from "../brand/BrandMark";
import { colors, motion, radius, spacing, type } from "../../theme";

const tones = {
  empty: { icon: "basket-outline", bg: colors.primarySoft, fg: colors.primary },
  error: { icon: "alert-circle-outline", bg: colors.dangerSoft, fg: colors.danger },
  offline: { icon: "wifi-off", bg: colors.accentSoft, fg: colors.accentText },
  success: { icon: "check-circle", bg: colors.successSoft, fg: colors.success },
  // Carrinho vazio: o monograma parado, esperando as compras (sem animação em loop).
  brand: { bg: colors.primarySoft },
};

// Estados vazio, erro e indisponibilidade com o mesmo desenho em todas as telas.
export default function StateView({ tone = "empty", icon, title, message, actionLabel, onAction, actionIcon, compact = false }) {
  const t = tones[tone];
  return (
    <Animated.View
      entering={FadeIn.duration(motion.enter)}
      style={[styles.box, compact && styles.compact]}
      accessibilityRole={tone === "error" || tone === "offline" ? "alert" : undefined}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.badge, { backgroundColor: t.bg }]}>
        {tone === "brand" ? (
          <BrandMark size={30} tone="dark" />
        ) : (
          <MaterialCommunityIcons name={icon || t.icon} size={34} color={t.fg} />
        )}
      </View>
      <Text style={[type.heading, styles.center]}>{title}</Text>
      {message ? <Text style={[type.small, styles.center]}>{message}</Text> : null}
      {actionLabel ? (
        <Button title={actionLabel} icon={actionIcon} onPress={onAction} variant="secondary" size="md" containerStyle={styles.action} />
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl,
  },
  compact: { paddingVertical: spacing.lg },
  badge: { width: 80, height: 80, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", marginBottom: spacing.xxs },
  center: { textAlign: "center" },
  action: { alignSelf: "stretch", marginTop: spacing.xs },
});

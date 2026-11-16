import { Image, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./Button";
import { StyleSheet, colors, motion, radius, spacing, type } from "../../theme";

const EMPTY_CART = require("../../../assets/design/images/safra-carrinho-vazio-sem-fundo.gif");

const tones = () => ({
  empty: { icon: "basket-outline", bg: colors.primarySoft, fg: colors.primary },
  error: { icon: "alert-circle-outline", bg: colors.dangerSoft, fg: colors.danger },
  offline: { icon: "wifi-off", bg: colors.accentSoft, fg: colors.accentText },
  success: { icon: "check-circle", bg: colors.successSoft, fg: colors.success },
  brand: { bg: "#FFFFFF" },
});

// Estados vazio, erro e indisponibilidade com o mesmo desenho em todas as telas.
export default function StateView({ tone = "empty", icon, title, message, actionLabel, onAction, actionIcon, compact = false }) {
  const t = tones()[tone];
  return (
    <Animated.View
      entering={FadeIn.duration(motion.enter)}
      style={[styles.box, compact && styles.compact]}
      accessibilityRole={tone === "error" || tone === "offline" ? "alert" : undefined}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.badge, { backgroundColor: t.bg }]}>
        {tone === "brand" ? (
          <Image source={EMPTY_CART} style={styles.emptyCart} resizeMode="contain" accessibilityLabel="Carrinho Safra vazio" />
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
  badge: { width: 112, height: 112, borderRadius: radius.pill, overflow: "hidden", alignItems: "center", justifyContent: "center", marginBottom: spacing.xxs },
  emptyCart: { width: 100, height: 100 },
  center: { textAlign: "center" },
  action: { alignSelf: "stretch", marginTop: spacing.xs },
});

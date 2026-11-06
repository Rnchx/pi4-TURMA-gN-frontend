import { StyleSheet, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { colors, radius, spacing } from "../../theme";

// Bloco de carregamento com pulso suave (animação CSS do Reanimated); estático com redução de movimento.
export function Skeleton({ width = "100%", height = 16, rounded = radius.sm, style }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: rounded, backgroundColor: colors.skeleton },
        !reduced && {
          animationName: { from: { opacity: 1 }, to: { opacity: 0.45 } },
          animationDuration: 850,
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationTimingFunction: "ease-in-out",
        },
        style,
      ]}
    />
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <View style={styles.grid} accessibilityLabel="Carregando produtos" accessible>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton height={120} rounded={radius.md} />
          <Skeleton width="85%" height={14} />
          <Skeleton width="55%" height={14} />
          <Skeleton width="40%" height={20} />
        </View>
      ))}
    </View>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <View style={styles.list} accessibilityLabel="Carregando" accessible>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={64} height={64} rounded={radius.md} />
          <View style={styles.rowText}>
            <Skeleton width="80%" height={14} />
            <Skeleton width="45%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, paddingHorizontal: spacing.md },
  card: {
    width: "47.5%", flexGrow: 1, gap: spacing.xs, padding: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg,
  },
  list: { gap: spacing.sm, paddingHorizontal: spacing.md },
  row: { flexDirection: "row", gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.lg },
  rowText: { flex: 1, gap: spacing.xs, justifyContent: "center" },
});

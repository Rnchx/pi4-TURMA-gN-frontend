import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./PressableScale";
import { colors, motion, radius, spacing } from "../../theme";

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

// Controle de quantidade entre 1 e 99 (CT12). Nunca envia zero ou valor negativo: retirar o item
// é uma ação explícita de remoção (fluxo E5).
export default function QuantityStepper({ value, onChange, busy = false, label = "Quantidade", size = "md" }) {
  const canDecrease = value > MIN_QUANTITY && !busy;
  const canIncrease = value < MAX_QUANTITY && !busy;
  const dims = size === "lg" ? styles.lg : styles.md;
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: MIN_QUANTITY, max: MAX_QUANTITY, now: value, text: `${value}` }}
      accessibilityState={{ busy }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "increment" && canIncrease) onChange(value + 1);
        if (event.nativeEvent.actionName === "decrement" && canDecrease) onChange(value - 1);
      }}
    >
      <StepButton icon="minus" disabled={!canDecrease} onPress={() => onChange(value - 1)} style={dims} label="Diminuir" />
      <View style={styles.value}>
        {busy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Animated.Text key={value} entering={FadeIn.duration(motion.quick)} style={styles.number} maxFontSizeMultiplier={1.4}>
            {value}
          </Animated.Text>
        )}
      </View>
      <StepButton icon="plus" disabled={!canIncrease} onPress={() => onChange(value + 1)} style={dims} label="Aumentar" />
    </View>
  );
}

function StepButton({ icon, disabled, onPress, style, label }) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleTo={0.92}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.button, style, disabled && styles.disabled]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={disabled ? colors.inkSubtle : colors.primaryDark} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    backgroundColor: colors.primarySoft, borderRadius: radius.pill, padding: 2,
  },
  button: { alignItems: "center", justifyContent: "center", borderRadius: radius.pill, backgroundColor: colors.surface },
  md: { width: 40, height: 40 },
  lg: { width: 46, height: 46 },
  disabled: { backgroundColor: "transparent" },
  value: { minWidth: 40, alignItems: "center", paddingHorizontal: spacing.xxs },
  number: { fontSize: 17, fontWeight: "800", color: colors.ink },
});

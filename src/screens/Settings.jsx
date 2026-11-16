import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, colors, radius, shadow, spacing, type, useAppTheme } from "../theme";

const options = [
  { value: "light", title: "Claro", description: "Fundo claro e cards brancos.", icon: "white-balance-sunny" },
  { value: "dark", title: "Escuro", description: "Fundo azul-marinho e textos claros.", icon: "weather-night" },
];

export default function Settings() {
  const { mode, setMode } = useAppTheme();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.heading}>
          <MaterialCommunityIcons name="palette-outline" size={26} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={type.title}>Aparência</Text>
            <Text style={type.small}>Sua escolha fica salva neste dispositivo.</Text>
          </View>
        </View>
        {options.map((option) => {
          const selected = mode === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setMode(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name={option.icon} size={25} color={selected ? colors.primary : colors.inkMuted} />
              <View style={styles.flex}>
                <Text style={type.bodyStrong}>{option.title}</Text>
                <Text style={type.small}>{option.description}</Text>
              </View>
              <MaterialCommunityIcons name={selected ? "radiobox-marked" : "radiobox-blank"} size={24} color={colors.primary} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  card: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.xl, backgroundColor: colors.surface, ...shadow.card },
  heading: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  flex: { flex: 1 },
  option: {
    minHeight: 76, flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surfaceMuted,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  pressed: { opacity: 0.82 },
});

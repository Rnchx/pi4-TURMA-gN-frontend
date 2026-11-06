import { Image, StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Brand from "../components/Brand";
import { colors, spacing, type } from "../theme";

const WAVE = require("../../assets/brand/onda.png");

export default function DrawerContent(props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View>
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <Brand size="lg" />
          <Text style={styles.subtitle}>O mercado que anda até você</Text>
        </View>
        <Image source={WAVE} style={styles.wave} resizeMode="stretch" accessibilityIgnoresInvertColors />
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.accentText} />
        <Text style={[type.small, styles.flex]}>Compras demonstrativas, sem cobrança.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.xs, gap: spacing.sm },
  subtitle: { ...type.small, color: colors.primaryMuted },
  wave: { width: "100%", height: 50, marginTop: -1 }, // largura do menu: 290
  items: { paddingTop: 0 },
  footer: { flexDirection: "row", gap: spacing.xs, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  flex: { flex: 1 },
});

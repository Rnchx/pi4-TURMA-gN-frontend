import { StyleSheet, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Brand from "../components/Brand";
import { colors, radius, spacing, type } from "../theme";

export default function DrawerContent(props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Brand />
        <Text style={styles.subtitle}>Seu mercado do campo à mesa</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.primary} />
        <Text style={[type.small, styles.flex]}>Compras demonstrativas, sem cobrança.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xxs, borderBottomRightRadius: radius.xl },
  subtitle: { ...type.small, color: colors.primarySoft },
  items: { paddingTop: spacing.md },
  footer: { flexDirection: "row", gap: spacing.xs, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  flex: { flex: 1 },
});

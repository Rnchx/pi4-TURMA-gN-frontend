import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "./ui/PressableScale";
import { colors, spacing } from "../theme";

// Voltar no cabeçalho das telas internas (detalhes, categoria, resumo). Sem histórico, vai para o início.
export default function HeaderBack({ fallback = "Home" }) {
  const navigation = useNavigation();
  return (
    <PressableScale
      onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate(fallback))}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={styles.button}
    >
      <MaterialCommunityIcons name="arrow-left" size={26} color={colors.onPrimary} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { width: 48, height: 48, alignItems: "center", justifyContent: "center", marginLeft: spacing.xxs },
});

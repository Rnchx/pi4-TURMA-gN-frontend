import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PressableScale from "./ui/PressableScale";
import { StyleSheet, colors, spacing } from "../theme";

// Atalho persistente: telas internas mantêm o Voltar à esquerda e sempre oferecem Início à direita.
export default function HeaderHome() {
  const navigation = useNavigation();
  return (
    <PressableScale
      onPress={() => navigation.navigate("Home")}
      accessibilityRole="button"
      accessibilityLabel="Ir para o início"
      style={styles.button}
    >
      <MaterialCommunityIcons name="home-outline" size={25} color={colors.onHeader} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: { width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: spacing.xxs },
});

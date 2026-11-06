import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import DrawerRoutes from "./drawer.routes";
import { colors } from "../theme";

// Tema da navegação alinhado ao sistema visual (React Navigation 7 exige fonts no tema).
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    notification: colors.accent,
  },
  fonts: DefaultTheme.fonts,
};

export default function Routes() {
  return (
    <NavigationContainer theme={theme}>
      <DrawerRoutes />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

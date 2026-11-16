import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import DrawerRoutes from "./drawer.routes";
import { useAppTheme } from "../theme";

// Tema da navegação alinhado ao sistema visual (React Navigation 7 exige fonts no tema).
export default function Routes() {
  const { dark, colors } = useAppTheme();
  const base = dark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, primary: colors.primary, background: colors.background, card: colors.surface,
      text: colors.ink, border: colors.border, notification: colors.accent },
    fonts: DefaultTheme.fonts,
  };
  return (
    <NavigationContainer theme={theme}>
      <DrawerRoutes />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

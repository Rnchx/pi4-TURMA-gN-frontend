import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold,
} from "@expo-google-fonts/outfit";
import Routes from "./src/routes";
import { CartProvider } from "./src/state/CartContext";
import { ToastProvider } from "./src/components/ui/Toast";
import Intro from "./src/components/brand/Intro";
import { colors } from "./src/theme";

// A splash nativa fica até a fonte da marca (Outfit) carregar; depois a abertura animada continua dela.
SplashScreen.preventAutoHideAsync().catch(() => {});

// GestureHandlerRootView é necessário para o gesto de abrir o Drawer no celular (Gesture Handler 3).
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold,
  });
  const [intro, setIntro] = useState(true);
  const ready = fontsLoaded || Boolean(fontError); // sem a fonte, o app segue com a fonte do sistema

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);
  const endIntro = useCallback(() => setIntro(false), []);

  if (!ready) return <View style={[styles.root, styles.splash]} />;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <CartProvider>
          <ToastProvider>
            <Routes />
          </ToastProvider>
        </CartProvider>
        {intro ? <Intro onDone={endIntro} /> : null}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: { backgroundColor: colors.primary },
});

import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";
import { CartProvider } from "./src/state/CartContext";
import { ToastProvider } from "./src/components/ui/Toast";

// GestureHandlerRootView é necessário para o gesto de abrir o Drawer no celular (Gesture Handler 3).
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <CartProvider>
          <ToastProvider>
            <Routes />
          </ToastProvider>
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });

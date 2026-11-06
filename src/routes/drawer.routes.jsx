import { StyleSheet, Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Brand from "../components/Brand";
import CartButton, { BadgeCount } from "../components/CartButton";
import HeaderBack from "../components/HeaderBack";
import DrawerContent from "./DrawerContent";
import { useCart } from "../state/CartContext";
import { colors, radius } from "../theme";

import Home from "../screens/Home";
import CategoryProducts from "../screens/CategoryProducts";
import ProductDetails from "../screens/ProductDetails";
import Cart from "../screens/Cart";
import Summary from "../screens/Summary";
import Confirmation from "../screens/Confirmation";

const Drawer = createDrawerNavigator();

const hidden = { drawerItemStyle: { display: "none" }, headerLeft: () => <HeaderBack /> };
const icon = (name) => ({ color, size }) => <MaterialCommunityIcons name={name} size={size} color={color} />;

function CartBadge() {
  const { count } = useCart();
  return <BadgeCount count={count} />;
}

// Nomes das telas preservados: Home, CategoryProducts, ProductDetails, ShopCart.
// A tela legada Register (cadastro sem acesso na interface) foi removida (OP#1336).
export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
        headerRight: () => <CartButton />,
        drawerType: "front",
        drawerStyle: { backgroundColor: colors.background, width: 290 },
        overlayColor: colors.overlay,
        drawerActiveBackgroundColor: colors.primarySoft,
        drawerActiveTintColor: colors.primaryDark,
        drawerInactiveTintColor: colors.ink,
        drawerLabelStyle: { fontSize: 16, fontWeight: "600" },
        drawerItemStyle: { borderRadius: radius.md },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: () => <Brand />, title: "Início", drawerLabel: "Início", drawerIcon: icon("home-outline") }}
      />
      <Drawer.Screen
        name="ShopCart"
        component={Cart}
        options={{
          title: "Carrinho",
          drawerLabel: ({ color }) => (
            <View style={styles.label}>
              <Text style={[styles.labelText, { color }]}>Carrinho</Text>
              <CartBadge />
            </View>
          ),
          drawerIcon: icon("cart-outline"),
          headerRight: () => null,
        }}
      />
      <Drawer.Screen name="CategoryProducts" component={CategoryProducts} options={{ ...hidden, title: "Categoria" }} />
      <Drawer.Screen name="ProductDetails" component={ProductDetails} options={{ ...hidden, title: "Produto" }} />
      <Drawer.Screen name="Summary" component={Summary} options={{ ...hidden, title: "Resumo da compra", headerRight: () => null }} />
      <Drawer.Screen
        name="Confirmation"
        component={Confirmation}
        options={{ drawerItemStyle: { display: "none" }, title: "Compra concluída", headerRight: () => null }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  label: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  labelText: { fontSize: 16, fontWeight: "600" },
});

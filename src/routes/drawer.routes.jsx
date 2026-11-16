import { Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Brand from "../components/Brand";
import CartButton, { BadgeCount } from "../components/CartButton";
import HeaderBack from "../components/HeaderBack";
import DrawerContent from "./DrawerContent";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { StyleSheet, font, colors, radius } from "../theme";

import Home from "../screens/Home";
import CategoryProducts from "../screens/CategoryProducts";
import ProductDetails from "../screens/ProductDetails";
import Cart from "../screens/Cart";
import Summary from "../screens/Summary";
import Confirmation from "../screens/Confirmation";
import Offers from "../screens/Offers";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Profile from "../screens/Profile";
import Payment from "../screens/Payment";
import Review from "../screens/Review";
import EditProfile from "../screens/EditProfile";
import ChangePassword from "../screens/ChangePassword";
import DeleteAccount from "../screens/DeleteAccount";
import Settings from "../screens/Settings";

const Drawer = createDrawerNavigator();

const hidden = { drawerItemStyle: { display: "none" }, headerLeft: () => <HeaderBack /> };
const icon = (name) => ({ color, size }) => <MaterialCommunityIcons name={name} size={size} color={color} />;

function CartBadge() {
  const { count } = useCart();
  return <BadgeCount count={count} />;
}

// Nomes das telas existentes preservados; Login/Register formam o fluxo público de autenticação.
export default function DrawerRoutes() {
  const { usuario, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  return (
    <Drawer.Navigator
      key={usuario ? "app" : "auth"}
      initialRouteName={usuario ? "Home" : "Login"}
      backBehavior="history"
      drawerContent={usuario ? (props) => <DrawerContent {...props} /> : undefined}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: { fontFamily: font.semibold, fontSize: 19 },
        headerShadowVisible: false,
        headerRight: () => <CartButton />,
        drawerType: "front",
        swipeEnabled: Boolean(usuario),
        drawerStyle: { backgroundColor: colors.background, width: 290 },
        overlayColor: colors.overlay,
        drawerActiveBackgroundColor: colors.primarySoft,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.ink,
        drawerLabelStyle: { fontSize: 16, fontFamily: font.semibold },
        drawerItemStyle: { borderRadius: radius.md },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {!usuario ? (
        <>
          <Drawer.Screen name="Login" component={Login} options={{ title: "Entrar", headerShown: false, drawerItemStyle: { display: "none" } }} />
          <Drawer.Screen name="Register" component={Register} options={{ ...hidden, title: "Criar conta", headerRight: () => null, drawerItemStyle: { display: "none" } }} />
        </>
      ) : (
        <>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: () => <Brand />, title: "Início", drawerLabel: "Início", drawerIcon: icon("home-outline") }}
      />
      <Drawer.Screen
        name="Offers"
        component={Offers}
        options={{ title: "Ofertas", drawerLabel: "Ofertas", drawerIcon: icon("tag-outline") }}
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
      <Drawer.Screen name="Profile" component={Profile} options={{ title: "Meu perfil", drawerLabel: "Meu perfil", drawerIcon: icon("account-outline"), headerRight: () => null }} />
      <Drawer.Screen name="Settings" component={Settings} options={{ title: "Configurações", drawerLabel: "Configurações", drawerIcon: icon("cog-outline"), headerRight: () => null }} />
      <Drawer.Screen name="EditProfile" component={EditProfile} options={{ ...hidden, title: "Editar perfil", headerRight: () => null }} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} options={{ ...hidden, title: "Alterar senha", headerRight: () => null }} />
      <Drawer.Screen name="DeleteAccount" component={DeleteAccount} options={{ ...hidden, title: "Excluir conta", headerRight: () => null }} />
      <Drawer.Screen name="Payment" component={Payment} options={{ ...hidden, title: "Método de pagamento", headerRight: () => null }} />
      <Drawer.Screen name="Review" component={Review} options={{ ...hidden, title: "Revisão final", headerRight: () => null }} />
        </>
      )}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  label: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  labelText: { fontSize: 16, fontFamily: font.semibold },
});

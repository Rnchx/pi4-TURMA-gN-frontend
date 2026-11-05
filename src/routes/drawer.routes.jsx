import { createDrawerNavigator } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';


import Home from "../screens/Home";
import ProductDetails from "../screens/Detalhamento";
import CategoryProducts from "../screens/Category";
import ShopCart from "../screens/Carrinho";
import Register from "../screens/Cadastro";

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? "white" : "gray"}
            />
          ),
          headerStyle: { backgroundColor: "#10377B" },
          drawerLabel: "Início",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "gray",
          drawerActiveBackgroundColor: "#F58614",
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: '#103778',
             width: '60%' 
            },
        }}
      />
      <Drawer.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "gray",
          drawerActiveBackgroundColor: "#F58614",
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: '#103778',
             width: '60%' 
            },
        }}
      />
      <Drawer.Screen
        name="CategoryProducts"
        component={CategoryProducts}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <Feather
              name="list"
              size={24}
              color={focused ? "#131313" : "#D6D6D6"}
            />
          ),
          headerStyle: { backgroundColor: "#10377B" },
          drawerLabel: "Categorias",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "gray",
          drawerActiveBackgroundColor: "#F58614",
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: '#103778',
             width: '60%' 
            },
        }}
      />

      <Drawer.Screen
        name="ShopCart"
        component={ShopCart}
        options={{
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <Feather name="shopping-cart" size={24} color={focused ? "white" : "gray"} />
          ),
          headerStyle: { backgroundColor: "#10377B" },
          drawerLabel: "Carrinho",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "gray",
          drawerActiveBackgroundColor: "#F58614",
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: '#103778',
             width: '60%' 
            },
        }}
      />

      <Drawer.Screen
        name="Register"
        component={Register}
        options={{
          drawerItemStyle: { display: "none" },
          headerTitle: "",
          drawerIcon: ({ focused }) => (
            <FontAwesome5 name="newspaper" size={24} color={focused ? "#103778" : "gray"} />
          ),
          headerStyle: { backgroundColor: "#10377B" },
          drawerLabel: "Cadastro de Produtos",
        }}
      />

    </Drawer.Navigator>
  );
};

export default DrawerRoutes;

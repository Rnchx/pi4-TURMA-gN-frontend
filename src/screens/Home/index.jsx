import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import api, { API_ERROR_MESSAGE } from "../../services/api";

import styles from "./styles";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {

  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterPadaria, setFilterPadaria] = useState([]);
  const [filterAcougue, setFilterAcougue] = useState([]);
  const [filterHortiFruit, setFilterHortiFruit] = useState([]);
  const [filterBebidas, setFilterBebidas] = useState([]);
  const [filterLimpeza, setFilterLimpeza] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getIcon = (categoryName) => {
    switch (categoryName) {
      case 'Padaria':
        return <FontAwesome name="coffee" size={40} color="#103778" />
      case 'Acougue':
        return <MaterialCommunityIcons name="food-drumstick" size={40} color="#103778" />
      case 'Horti-Fruit':
        return <MaterialCommunityIcons name="fruit-cherries" size={40} color="#103778" />
      case 'Bebidas':
        return <FontAwesome5 name="glass-cheers" size={40} color="#103778" />
      case 'Limpeza':
        return <MaterialIcons name="clean-hands" size={40} color="#103778" />
      default:
        return null;
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get("/products");
      setProducts(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchCategorie = async () => {
    try {
      const response = await api.get("/categorys");
      setCategories(Array.isArray(response.data?.categorys) ? response.data.categorys : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchPadariaFilter = async () => {
    try {
      const response = await api.get("/categorys/filter/Padaria");
      setFilterPadaria(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchAcougueFilter = async () => {
    try {
      const response = await api.get("/categorys/filter/Acougue");
      setFilterAcougue(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchHortiFruitFilter = async () => {
    try {
      const response = await api.get("/categorys/filter/Horti-Fruit");
      setFilterHortiFruit(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchBebidasFilter = async () => {
    try {
      const response = await api.get("/categorys/filter/Bebidas");
      setFilterBebidas(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };

  const fetchLimpezaFilter = async () => {
    try {
      const response = await api.get("/categorys/filter/Limpeza");
      setFilterLimpeza(Array.isArray(response.data?.products) ? response.data.products : []);
    } catch {
      setError(API_ERROR_MESSAGE);
    }
  };



  useEffect(() => {
    Promise.all([
      fetchProduct(),
      fetchCategorie(),
      fetchPadariaFilter(),
      fetchAcougueFilter(),
      fetchHortiFruitFilter(),
      fetchBebidasFilter(),
      fetchLimpezaFilter(),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.containerProductsDestaques}>
        <View style={styles.viewSearchLogo}>
          <View style={styles.viewLogo}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
              <Image style={styles.logo} source={require("../../../assets/design/images/logo.png")} />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <Text accessibilityRole="alert" style={styles.loading}>{error}</Text>
        ) : loading ? (
          <Text style={styles.loading}>Carregando...</Text>
        ) : products.length === 0 && categories.length === 0 ? (
          <Text style={styles.loading}>Nenhum produto disponível no momento.</Text>
        ) : null}

        <View style={styles.containerCategorys}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {categories ? (
              <View style={styles.containerCardCategory}>
                {
                  categories.map((category) => (
                    <View key={category.id} style={styles.containerCardCategory2}>
                      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}>
                        <View style={styles.viewCategory}>
                          {getIcon(category.name)}
                          <Text style={styles.nameCategory}>{category.name}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>
        </View>


        <View style={styles.viewTextDestaques}>
          <Text style={styles.textDestaques}>Destaques</Text>

          <TouchableOpacity style={styles.buttonContainerCart} onPress={() => navigation.navigate("ShopCart")}>
            <Text style={styles.textContainerCart}>Ir para o carrinho</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.viewDestaques}>
          <View style={styles.containerCategoryAndMore}>
            <Text style={styles.textPadaria}>Padaria</Text>

            {categories ? (
              <View style={styles.containerMoreProducts}>
                {categories.map((category) => (
                  <View key={category.id}>
                    {category.name === "Padaria" && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}
                      >
                        <View style={styles.containerMoreandIcon}>
                          <Text style={styles.textMoreProducts}>Mais</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={25} color="#103778" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {filterPadaria ? (
              <View style={styles.viewProductDestaques}>
                {filterPadaria.slice(0, 6).map((product) => (
                  <View key={product.id} style={styles.product}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}>
                      <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R$ {product.price}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>

        </View >

        <View style={styles.viewDestaques}>
          <View style={styles.containerCategoryAndMore}>
            <Text style={styles.textPadaria}>Açougue</Text>

            {categories ? (
              <View style={styles.containerMoreProductsAcougue}>
                {categories.map((category) => (
                  <View key={category.id}>
                    {category.name === "Acougue" && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}
                      >
                        <View style={styles.containerMoreandIcon}>
                          <Text style={styles.textMoreProducts}>Mais</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={25} color="#103778" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {filterAcougue ? (
              <View style={styles.viewProductDestaques}>
                {filterAcougue.slice(12, 18).map((product) => (
                  <View key={product.id} style={styles.product}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}>
                      <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R$ {product.price}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>

        </View >

        <View style={styles.viewDestaques}>
          <View style={styles.containerCategoryAndMore}>
            <Text style={styles.textPadaria}>Horti-Fruit</Text>

            {categories ? (
              <View style={styles.containerMoreProductsHortiFruit}>
                {categories.map((category) => (
                  <View key={category.id}>
                    {category.name === "Horti-Fruit" && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}
                      >
                        <View style={styles.containerMoreandIcon}>
                          <Text style={styles.textMoreProducts}>Mais</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={25} color="#103778" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {filterHortiFruit ? (
              <View style={styles.viewProductDestaques}>
                {filterHortiFruit.slice(0, 6).map((product) => (
                  <View key={product.id} style={styles.product}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}>
                      <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R$ {product.price}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>

        </View >

        <View style={styles.viewDestaques}>
          <View style={styles.containerCategoryAndMore}>
            <Text style={styles.textPadaria}>Bebidas</Text>

            {categories ? (
              <View style={styles.containerMoreProducts}>
                {categories.map((category) => (
                  <View key={category.id}>
                    {category.name === "Bebidas" && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}
                      >
                        <View style={styles.containerMoreandIcon}>
                          <Text style={styles.textMoreProducts}>Mais</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={25} color="#103778" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {filterBebidas ? (
              <View style={styles.viewProductDestaques}>
                {filterBebidas.slice(3, 9).map((product) => (
                  <View key={product.id} style={styles.product}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}>
                      <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R$ {product.price}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>

        </View >

        <View style={styles.viewDestaques}>
          <View style={styles.containerCategoryAndMore}>
            <Text style={styles.textPadaria}>Limpeza</Text>

            {categories ? (
              <View style={styles.containerMoreProducts}>
                {categories.map((category) => (
                  <View key={category.id}>
                    {category.name === "Limpeza" && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("CategoryProducts", { id: category.id, name: category.name })}
                      >
                        <View style={styles.containerMoreandIcon}>
                          <Text style={styles.textMoreProducts}>Mais</Text>
                          <MaterialIcons name="keyboard-arrow-right" size={25} color="#103778" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </View>

          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {filterLimpeza ? (
              <View style={styles.viewProductDestaques}>
                {filterLimpeza.slice(0, 6).map((product) => (
                  <View key={product.id} style={styles.product}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}>
                      <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R$ {product.price}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            ) : (
              <Text style={styles.loading}>Carregando...</Text>
            )}
          </ScrollView>
        </View >
      </ScrollView>

    </View >

  );
}

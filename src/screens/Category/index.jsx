import { View, TouchableOpacity, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import api, { API_ERROR_MESSAGE } from "../../services/api";
import styles from "./styles";
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";

export default function CategoryProducts({ route }) {
  const { id } = route.params;
  const { name } = route.params;
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [filterProductsType, setFilterProductsType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);

  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setProducts([]);
    setCategories(null);
    setSelectedType(null);

    const loadCategory = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          api.get(`/categorys/${encodeURIComponent(id)}`),
          api.get(`/categorys/filter/${encodeURIComponent(name)}`),
        ]);
        if (active) {
          setCategories(categoryResponse.data?.category || null);
          setProducts(Array.isArray(productsResponse.data?.products) ? productsResponse.data.products : []);
        }
      } catch {
        if (active) setError(API_ERROR_MESSAGE);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCategory();
    return () => { active = false; };
  }, [id, name]);

  useEffect(() => {
    let active = true;
    setFilterProductsType([]);
    setFilterError("");
    if (!selectedType) {
      setFilterLoading(false);
      return;
    }

    setFilterLoading(true);
    const loadType = async () => {
      try {
        const response = await api.get(`/products/type/${encodeURIComponent(selectedType)}`);
        if (active) {
          setFilterProductsType(Array.isArray(response.data?.product) ? response.data.product : []);
        }
      } catch {
        if (active) setFilterError(API_ERROR_MESSAGE);
      } finally {
        if (active) setFilterLoading(false);
      }
    };
    loadType();
    return () => { active = false; };
  }, [selectedType]);

  const getUniqueTypes = (products) => {
    const types = products.map(product => product.type);
    return [...new Set(types)];
  };

  const uniqueTypes = getUniqueTypes(products);

  return (
    <View style={styles.container}>
      <View style={styles.containerArrowAndIconSafra}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <MaterialIcons name="keyboard-arrow-left" size={45} color="#103778" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Image style={styles.logo} source={require("../../../assets/design/images/logo.png")} />
        </TouchableOpacity>
      </View>

      {error || filterError ? (
        <Text accessibilityRole="alert" style={styles.loading}>{error || filterError}</Text>
      ) : null}

      <View style={styles.containerCategorys}>
        {categories ? (
          <View key={categories.id} style={styles.containerCardCategory}>
            <View style={styles.containerCardCategory2}>
              <Text style={styles.nameCategory}>{categories.name}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.loading}>{loading ? "Carregando setor..." : "Setor indisponível."}</Text>
        )}
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <View style={styles.containerTypeProducts}>
          {products.length ? (
            <View style={styles.viewTypeProducts}>
              <TouchableOpacity
                style={[
                  styles.buttonType,
                  selectedType === null && { backgroundColor: "#103778" }
                ]}
                onPress={() => setSelectedType(null)}
              >
                <Text style={[styles.textType, selectedType === null && { color: "white" }]}>Todos</Text>
              </TouchableOpacity>
              {uniqueTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.buttonType,
                    selectedType === type && { backgroundColor: "#103778" }
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.textType, selectedType === type && { color: "white" }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.loading}>{loading ? "Carregando..." : "Nenhum produto disponível."}</Text>
          )}
        </View>
      </ScrollView>

      <ScrollView style={styles.containerScrollView}>
        <View style={styles.containerProductsCategory}>
          {loading || filterLoading ? (
            <Text style={styles.loading}>Carregando...</Text>
          ) : (selectedType ? filterProductsType : products).length === 0 ? (
            <Text style={styles.loading}>Nenhum produto disponível.</Text>
          ) : (
            <View style={styles.viewProductDestaques}>
              {(selectedType ? filterProductsType : products).map((product) => (
                <View key={product.id} style={styles.product}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("ProductDetails", { id: product.id, idcategory: product.idcategory })}
                  >
                    <Image style={styles.productPhoto} source={{ uri: product.photo }} />
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>R$ {product.price}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

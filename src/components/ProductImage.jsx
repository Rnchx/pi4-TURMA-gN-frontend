import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../theme";

// Imagem do produto vinda da API (HTTPS). Sem imagem ou com falha de rede, mostra um marcador neutro.
export default function ProductImage({ uri, size, style, rounded = radius.md, label }) {
  const [failed, setFailed] = useState(false);
  const box = [styles.box, size ? { width: size, height: size } : styles.square, { borderRadius: rounded }, style];
  if (!uri || failed) {
    return (
      <View style={box} accessibilityRole="image" accessibilityLabel={label ? `${label}, imagem indisponível` : "Imagem indisponível"}>
        <MaterialCommunityIcons name="basket-outline" size={size ? size * 0.42 : 40} color={colors.inkSubtle} />
      </View>
    );
  }
  return (
    <View style={box}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
        onError={() => setFailed(true)}
        accessibilityRole="image"
        accessibilityLabel={label}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  square: { width: "100%", aspectRatio: 1 },
  image: { width: "88%", height: "88%" },
});

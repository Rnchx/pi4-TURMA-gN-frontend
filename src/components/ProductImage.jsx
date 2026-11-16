import { useState } from "react";
import { Image, Text, View } from "react-native";
import BrandMark from "./brand/BrandMark";
import { StyleSheet, colors, font, radius } from "../theme";

// Imagem original vinda da API. Produtos ainda sem foto usam o marcador oficial do SAFRA,
// sem substituir silenciosamente a foto por imagens de terceiros.
export default function ProductImage({ uri, size, style, rounded = radius.md, label }) {
  const [failed, setFailed] = useState(false);
  const box = [styles.box, size ? { width: size, height: size } : styles.square, { borderRadius: rounded }, style];
  if (!uri || failed) {
    return (
      <View style={box} accessibilityRole="image" accessibilityLabel={label ? `${label}, imagem indisponível` : "Imagem indisponível"}>
        <BrandMark size={size ? Math.max(24, size * 0.32) : 38} tone="dark" />
        <Text style={styles.placeholderText}>SAFRA</Text>
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
  box: { backgroundColor: "#FEFEFE", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  square: { width: "100%", aspectRatio: 1 },
  image: { width: "88%", height: "88%" },
  placeholderText: { marginTop: 5, fontSize: 10, lineHeight: 12, letterSpacing: 2, fontFamily: font.bold, color: "#072858" },
});

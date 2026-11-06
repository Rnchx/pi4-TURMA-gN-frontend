import { Fragment } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../../theme";

const S_WHITE = require("../../../assets/brand/monograma-s-branco.png");
const S_BLUE = require("../../../assets/brand/monograma-s-azul.png");

// Proporções medidas em assets/design/images/monograma-safra-transparente.png.
const S_RATIO = 452 / 422; // altura / largura do "S"
const WHEEL = 0.22; // diâmetro da roda em relação à largura do "S"
const WHEEL_TOP = 1.249; // topo das rodas, em larguras do "S"
const WHEEL_X = [0.334, 0.87]; // centro de cada roda

// Monograma "o S que anda": o "S" do wordmark sobre duas rodinhas.
// As rodas são Views separadas para poderem ser animadas (WheelsBounce em Motion.jsx).
export default function BrandMark({ size = 32, tone = "light", wheelColor = colors.accent, renderWheel, style }) {
  const height = size * (WHEEL_TOP + WHEEL);
  const d = size * WHEEL;
  return (
    <View style={[{ width: size, height }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Image source={tone === "light" ? S_WHITE : S_BLUE} style={{ width: size, height: size * S_RATIO }} resizeMode="contain" />
      {WHEEL_X.map((x, index) => {
        const wheelStyle = [styles.wheel, { width: d, height: d, left: size * x - d / 2, top: size * WHEEL_TOP, backgroundColor: wheelColor }];
        return <Fragment key={index}>{renderWheel ? renderWheel(wheelStyle, index) : <View style={wheelStyle} />}</Fragment>;
      })}
    </View>
  );
}

BrandMark.heightFor = (size) => size * (WHEEL_TOP + WHEEL);

const styles = StyleSheet.create({
  wheel: { position: "absolute", borderRadius: 999 },
});

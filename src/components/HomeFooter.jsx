import { Image, Text, View, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, font, spacing, radius } from "../theme";

const WAVE = require("../../assets/design/images/embaixo_onda.png");
// embaixo_onda.png tem 500 × 500 px: as linhas 0–379 são transparentes e a onda ocupa as 120 de baixo.
// O recorte mostra só a faixa da onda, esticada na largura da tela, sem a área vazia acima.
const WAVE_VISIBLE = 120 / 500;
// Azul da base da onda: o footer continua exatamente na mesma cor, nos dois temas.
const FOOTER_NAVY = "#103778";

// Não há perfis oficiais configurados: os ícones são apenas visuais (sem links inventados).
const SOCIAL = [
  { icon: "instagram", label: "Instagram" },
  { icon: "facebook", label: "Facebook" },
  { icon: "whatsapp", label: "WhatsApp" },
];

export default function HomeFooter() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const waveHeight = Math.max(48, Math.round(width * WAVE_VISIBLE));
  return (
    <View style={styles.wrapper}>
      <View style={[styles.waveClip, { height: waveHeight }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Image
          source={WAVE}
          resizeMode="stretch"
          style={[styles.wave, { height: waveHeight / WAVE_VISIBLE }]}
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={[styles.body, { paddingBottom: spacing.xl + insets.bottom }]} accessibilityRole="summary">
        <Text style={styles.brand} accessibilityRole="header">SAFRA <Text style={styles.brandAccent}>Online</Text></Text>
        <Text style={styles.tagline}>O mercado que anda até você</Text>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="school-outline" size={16} color="#FFB75C" />
          <Text style={styles.badgeText}>Projeto acadêmico — compras sem cobrança</Text>
        </View>
        <View style={styles.social} accessible accessibilityLabel="Redes sociais: Instagram, Facebook e WhatsApp. Perfis oficiais ainda não divulgados.">
          {SOCIAL.map((item) => (
            <View key={item.icon} style={styles.socialIcon}>
              <MaterialCommunityIcons name={item.icon} size={22} color="#FFFFFF" />
            </View>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.copy}>© {new Date().getFullYear()} SAFRA Online. Projeto acadêmico.</Text>
      </View>
    </View>
  );
}

// Valores fixos: o footer usa o azul da onda nos dois temas, com texto claro sempre legível.
const styles = StyleSheet.create(() => ({
  wrapper: { marginTop: spacing.xl },
  waveClip: { width: "100%", overflow: "hidden", justifyContent: "flex-end", marginBottom: -1 },
  wave: { width: "100%" },
  body: { backgroundColor: FOOTER_NAVY, paddingHorizontal: spacing.lg, paddingTop: spacing.xs, alignItems: "center", gap: spacing.sm },
  brand: { fontSize: 24, lineHeight: 30, fontFamily: font.extrabold, color: "#FFFFFF", letterSpacing: 0.5 },
  brandAccent: { color: "#F48A0B" },
  tagline: { fontSize: 15, lineHeight: 21, fontFamily: font.medium, color: "#C9D4E8", textAlign: "center" },
  badge: {
    flexDirection: "row", alignItems: "center", gap: spacing.xxs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs,
    borderRadius: radius.pill, backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  badgeText: { fontSize: 13, lineHeight: 18, fontFamily: font.semibold, color: "#FFB75C", flexShrink: 1, textAlign: "center" },
  social: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xxs },
  socialIcon: {
    width: 44, height: 44, borderRadius: radius.pill, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  divider: { alignSelf: "stretch", height: 1, backgroundColor: "rgba(255, 255, 255, 0.15)", marginTop: spacing.xs },
  copy: { fontSize: 12, lineHeight: 16, fontFamily: font.regular, color: "#BDD0E8", textAlign: "center" },
}));

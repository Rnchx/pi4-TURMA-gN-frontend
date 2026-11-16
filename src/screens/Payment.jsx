import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "../components/ui/Button";
import PressableScale from "../components/ui/PressableScale";
import { StyleSheet, colors, radius, shadow, spacing, type } from "../theme";
import { useState } from "react";

const METHODS = [
  { id: "pix", icon: "qrcode", title: "PIX", text: "Seleção demonstrativa; nenhum QR Code ou chave real será gerado." },
  { id: "credito", icon: "credit-card-outline", title: "Cartão de crédito", text: "Sem número, validade ou CVV reais." },
  { id: "debito", icon: "credit-card-check-outline", title: "Cartão de débito", text: "Pagamento apenas simulado." },
  { id: "boleto", icon: "barcode", title: "Boleto bancário", text: "Boleto demonstrativo; nenhuma cobrança bancária será gerada." },
];

export const paymentLabel = id => METHODS.find(item => item.id === id)?.title || id;

export default function Payment({ navigation }) {
  const [selected, setSelected] = useState(null);
  return (
    <View style={styles.screen}>
      <Text style={type.title}>Como deseja simular o pagamento?</Text>
      <Text style={type.small}>Nenhuma opção realiza cobrança ou solicita dados financeiros.</Text>
      <View style={styles.list}>
        {METHODS.map(method => {
          const active = selected === method.id;
          return (
            <PressableScale key={method.id} onPress={() => setSelected(method.id)} accessibilityRole="radio" accessibilityState={{ checked: active }}
              style={[styles.option, active && styles.active]}>
              <View style={[styles.icon, active && styles.iconActive]}><MaterialCommunityIcons name={method.icon} size={28} color={active ? colors.onPrimary : colors.primary} /></View>
              <View style={styles.flex}><Text style={type.bodyStrong}>{method.title}</Text><Text style={type.small}>{method.text}</Text></View>
              <MaterialCommunityIcons name={active ? "radiobox-marked" : "radiobox-blank"} size={24} color={active ? colors.accentText : colors.inkSubtle} />
            </PressableScale>
          );
        })}
      </View>
      <View style={styles.bottom}><Button title="Continuar para revisão" icon="arrow-right" onPress={() => navigation.navigate("Review", { metodoPagamento: selected })} disabled={!selected} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md, gap: spacing.sm, backgroundColor: colors.background },
  list: { gap: spacing.sm, marginTop: spacing.xs },
  option: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadow.card },
  active: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  icon: { width: 50, height: 50, alignItems: "center", justifyContent: "center", borderRadius: radius.md, backgroundColor: colors.primarySoft },
  iconActive: { backgroundColor: colors.primary },
  flex: { flex: 1 },
  bottom: { marginTop: "auto" },
});

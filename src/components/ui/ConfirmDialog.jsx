import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Button from "./Button";
import { colors, motion, radius, shadow, spacing, type } from "../../theme";

// Diálogo modal para ações destrutivas (remover item). Fecha pelo botão, pelo fundo ou pelo voltar do Android.
// O fundo clicável é irmão do cartão (na web, botão dentro de botão é HTML inválido).
export default function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel = "Cancelar", onConfirm, onCancel, tone = "danger" }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Fechar" accessibilityRole="button" />
        <Animated.View entering={FadeIn.duration(motion.quick)} style={styles.card} accessibilityViewIsModal>
          <Text style={type.title} accessibilityRole="header">{title}</Text>
          {message ? <Text style={[type.body, styles.message]}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="outline" size="md" onPress={onCancel} containerStyle={styles.flex} />
            <Button title={confirmLabel} variant={tone} size="md" onPress={onConfirm} containerStyle={styles.flex} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: "center", padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, maxWidth: 420, width: "100%", alignSelf: "center", ...shadow.raised },
  message: { color: colors.inkMuted, marginTop: spacing.xs },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  flex: { flex: 1 },
});

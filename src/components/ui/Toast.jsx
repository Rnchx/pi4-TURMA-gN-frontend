import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PressableScale from "./PressableScale";
import { font, colors, motion, radius, shadow, spacing } from "../../theme";

const ToastContext = createContext(null);

const tones = {
  success: { icon: "check-circle", fg: colors.accent },
  error: { icon: "alert-circle-outline", fg: colors.accent },
};

// Aviso breve de resultado (adicionar ao carrinho, erros de rede). Anunciado ao leitor de tela.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const insets = useSafeAreaInsets();

  const hide = useCallback(() => setToast(null), []);
  const show = useCallback((next) => {
    clearTimeout(timer.current);
    setToast({ tone: "success", ...next, id: Date.now() });
    AccessibilityInfo.announceForAccessibility?.(next.message);
    timer.current = setTimeout(() => setToast(null), next.duration ?? 2800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);
  const t = toast ? tones[toast.tone] : null;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        // Logo abaixo do cabeçalho: nunca cobre as barras de ação fixas no rodapé das telas.
        <View pointerEvents="box-none" style={[styles.layer, { top: insets.top + 64 }]}>
          <Animated.View
            key={toast.id}
            entering={FadeInDown.duration(motion.enter).easing(motion.easeOut)}
            exiting={FadeOutUp.duration(motion.quick)}
            style={styles.toast}
            accessibilityLiveRegion="polite"
            accessibilityRole={toast.tone === "error" ? "alert" : undefined}
          >
            <MaterialCommunityIcons name={t.icon} size={22} color={t.fg} />
            <Text style={styles.message}>{toast.message}</Text>
            {toast.actionLabel ? (
              <PressableScale
                onPress={() => { hide(); toast.onAction?.(); }}
                accessibilityRole="button"
                accessibilityLabel={toast.actionLabel}
                style={styles.action}
              >
                <Text style={styles.actionLabel}>{toast.actionLabel}</Text>
              </PressableScale>
            ) : null}
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider.");
  return context;
}

const styles = StyleSheet.create({
  layer: { position: "absolute", left: spacing.md, right: spacing.md, alignItems: "center" },
  toast: {
    width: "100%", maxWidth: 480, flexDirection: "row", alignItems: "center", gap: spacing.sm,
    paddingVertical: spacing.sm, paddingLeft: spacing.md, paddingRight: spacing.xs,
    backgroundColor: colors.primary, borderRadius: radius.lg, borderLeftWidth: 4, borderLeftColor: colors.accent, ...shadow.raised,
  },
  message: { flex: 1, color: colors.onPrimary, fontSize: 15, lineHeight: 21, fontFamily: font.semibold },
  action: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.sm, borderRadius: radius.md },
  actionLabel: { color: colors.accentOnPrimary, fontSize: 15, fontFamily: font.bold },
});

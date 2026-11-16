import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet as NativeStyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Easing, cubicBezier } from "react-native-reanimated";

export const palettes = {
  light: {
    primary: "#072858", header: "#072859", primaryDark: "#051C3F", primaryPressed: "#0B3370", primaryDetail: "#103778",
    primarySoft: "#E8EDF6", primaryMuted: "#C9D4E8", accent: "#F48A0B", accentSoft: "#FEF1E1",
    accentText: "#A85300", accentOnPrimary: "#F48A0B", background: "#F6F4EF", surface: "#FFFFFF",
    surfaceMuted: "#EEEBE4", ink: "#0D1B33", inkMuted: "#4F5D73", inkSubtle: "#8590A3",
    onPrimary: "#FFFFFF", onAccent: "#082957", border: "#E3E0D8", danger: "#B3261E",
    dangerSoft: "#FBE9E7", success: "#0B5D42", successSoft: "#E5F2EC",
    overlay: "rgba(5, 20, 45, 0.5)", skeleton: "#E6E3DB",
  },
  dark: {
    primary: "#68A5EB", header: "#072858", primaryDark: "#07182E", primaryPressed: "#8ABCF3", primaryDetail: "#183F6D",
    primarySoft: "#153352", primaryMuted: "#BDD0E8", accent: "#F59A23", accentSoft: "#3D2A13",
    accentText: "#FFB75C", accentOnPrimary: "#FF9E28", background: "#061426", surface: "#0D2038",
    surfaceMuted: "#152B46", ink: "#F5F8FC", inkMuted: "#B9C7D8", inkSubtle: "#8FA1B7",
    onPrimary: "#FFFFFF", onAccent: "#072858", border: "#29435F", danger: "#FF8A80",
    dangerSoft: "#3B1D24", success: "#8BBBF0", successSoft: "#153552",
    overlay: "rgba(0, 5, 14, 0.72)", skeleton: "#1A3553",
  },
};

let activeMode = "light";
const currentPalette = () => palettes[activeMode];

// Leituras diretas em propriedades JSX (ícones, loaders e navegação) acompanham o rerender.
export const colors = new Proxy({}, { get: (_target, key) => currentPalette()[key] });

export const font = {
  regular: "Outfit_400Regular", medium: "Outfit_500Medium", semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold", extrabold: "Outfit_800ExtraBold",
};
export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 14, lg: 18, xl: 26, pill: 999 };

const typography = (palette) => ({
  display: { fontSize: 27, lineHeight: 32, fontFamily: font.bold, color: palette.ink, letterSpacing: -0.4 },
  title: { fontSize: 21, lineHeight: 27, fontFamily: font.bold, color: palette.ink },
  heading: { fontSize: 18, lineHeight: 24, fontFamily: font.semibold, color: palette.ink },
  body: { fontSize: 16, lineHeight: 23, fontFamily: font.regular, color: palette.ink },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontFamily: font.semibold, color: palette.ink },
  small: { fontSize: 14, lineHeight: 20, fontFamily: font.regular, color: palette.inkMuted },
  smallStrong: { fontSize: 14, lineHeight: 20, fontFamily: font.semibold, color: palette.ink },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: font.medium, color: palette.inkMuted, letterSpacing: 2 },
  price: { fontSize: 18, lineHeight: 24, fontFamily: font.bold, color: palette.primary },
});
export const type = new Proxy({}, { get: (_target, key) => typography(currentPalette())[key] });

const shadows = (mode) => mode === "dark" ? {
  card: { boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.28)" },
  raised: { boxShadow: "0px 10px 28px rgba(0, 0, 0, 0.42)" },
  bar: { boxShadow: "0px -4px 16px rgba(0, 0, 0, 0.3)" },
} : {
  card: { boxShadow: "0px 2px 10px rgba(7, 40, 88, 0.07)" },
  raised: { boxShadow: "0px 10px 28px rgba(7, 40, 88, 0.18)" },
  bar: { boxShadow: "0px -4px 16px rgba(7, 40, 88, 0.08)" },
};
export const shadow = new Proxy({}, { get: (_target, key) => shadows(activeMode)[key] });

function themedValue(value, property, owner) {
  if (typeof value !== "string") return value;
  const light = palettes.light;
  const dark = palettes.dark;
  if (value === light.surface && property === "backgroundColor") return dark.surface;
  if (value === light.onPrimary && property === "color") return dark.onPrimary;
  if (value === light.primary && property === "color" && owner?.backgroundColor === light.accent) return dark.onAccent;
  const key = Object.keys(light).find((name) => light[name] === value);
  return key ? dark[key] : value;
}

function darken(value) {
  if (Array.isArray(value)) return value.map(darken);
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    result[key] = child && typeof child === "object" ? darken(child) : themedValue(child, key, value);
  }
  return result;
}

// Registra as duas paletas uma única vez e escolhe a folha ativa no momento do render.
export const StyleSheet = {
  ...NativeStyleSheet,
  create(definition) {
    const light = NativeStyleSheet.create(definition);
    const dark = NativeStyleSheet.create(darken(definition));
    return new Proxy(light, { get: (_target, key) => (activeMode === "dark" ? dark : light)[key] });
  },
};

export const motion = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1), easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  easeOutCss: cubicBezier(0.23, 1, 0.32, 1), press: 120, quick: 180, enter: 260,
};
export const touch = { min: 44, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 } };

const ThemeContext = createContext(null);
const THEME_KEY = "safra.appearance";
const themeStorage = {
  async get() {
    if (Platform.OS === "web") return globalThis.localStorage?.getItem(THEME_KEY) || null;
    return SecureStore.getItemAsync(THEME_KEY);
  },
  async set(value) {
    if (Platform.OS === "web") { globalThis.localStorage?.setItem(THEME_KEY, value); return; }
    await SecureStore.setItemAsync(THEME_KEY, value);
  },
};

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState("light");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    themeStorage.get().then((saved) => {
      const next = saved === "dark" ? "dark" : "light";
      activeMode = next;
      if (mounted) { setModeState(next); setReady(true); }
    }).catch(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);
  const setMode = async (next) => {
    if (!palettes[next]) return;
    activeMode = next;
    setModeState(next);
    await themeStorage.set(next);
  };
  const value = useMemo(() => ({ mode, dark: mode === "dark", ready, setMode, colors: palettes[mode] }), [mode, ready]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useAppTheme deve ser usado dentro de ThemeProvider.");
  return value;
}

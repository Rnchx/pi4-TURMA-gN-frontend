import { Easing } from 'react-native-reanimated';

// Sistema visual SAFRA: verde-floresta como cor principal, fundos naturais (creme e areia)
// e o laranja da marca como destaque. Contrastes conferidos para texto (WCAG AA, 4,5:1).
export const colors = {
  primary: '#1E6B43', // branco sobre ele: 6,6:1
  primaryDark: '#134A2E',
  primaryPressed: '#17573A',
  primarySoft: '#E3F1E7',
  primaryMuted: '#B9DCC5',
  accent: '#F28C1E', // sempre com texto escuro (ink: 7,1:1); nunca texto branco
  accentSoft: '#FFF1E0',
  accentText: '#A04A06', // laranja para texto sobre fundo claro (5,1:1)
  background: '#F7F5EF',
  surface: '#FFFFFF',
  surfaceMuted: '#EFEBE1',
  ink: '#1C2620',
  inkMuted: '#56655B', // sobre background: 5,4:1
  inkSubtle: '#7B877F', // somente para ícones e textos grandes
  onPrimary: '#FFFFFF',
  border: '#E2DDD0',
  danger: '#B53A25',
  dangerSoft: '#FBE9E5',
  success: '#1E6B43',
  successSoft: '#E3F1E7',
  overlay: 'rgba(16, 28, 20, 0.45)',
  skeleton: '#E7E2D6',
};

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

// Tamanhos pensados para 360 px de largura; o texto acompanha a fonte do sistema até 1,4x nos rótulos densos.
export const type = {
  display: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: colors.ink, letterSpacing: -0.3 },
  title: { fontSize: 21, lineHeight: 27, fontWeight: '700', color: colors.ink },
  heading: { fontSize: 17, lineHeight: 23, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400', color: colors.ink },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '600', color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: colors.inkMuted },
  smallStrong: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: colors.ink },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '600', color: colors.inkMuted, letterSpacing: 0.4 },
  price: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.primaryDark },
};

export const shadow = {
  card: { boxShadow: '0px 2px 10px rgba(28, 38, 32, 0.07)' },
  raised: { boxShadow: '0px 8px 24px rgba(28, 38, 32, 0.14)' },
  bar: { boxShadow: '0px -4px 16px rgba(28, 38, 32, 0.08)' },
};

// Movimento: ease-out forte para entradas e respostas; nada de ease-in em interface.
export const motion = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  press: 120,
  quick: 180,
  enter: 260,
};

export const touch = { min: 44, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 } };

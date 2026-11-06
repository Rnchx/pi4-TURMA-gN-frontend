import { Easing } from 'react-native-reanimated';

// Identidade oficial SAFRA Online (assets/design/images/apresentacao-safra-final.png):
// Azul Safra #072858, Laranja Safra #F48A0B, branco e o fundo claro da apresentação.
// Tipografia: Outfit (Bold / Regular). Contrastes conferidos (WCAG AA, 4,5:1 para texto).
export const colors = {
  primary: '#072858', // Azul Safra; branco sobre ele: 14,5:1
  primaryDark: '#051C3F',
  primaryPressed: '#0B3370',
  primaryDetail: '#103778', // azul das ondas e do círculo de detalhe
  primarySoft: '#E8EDF6',
  primaryMuted: '#C9D4E8', // texto secundário sobre o azul: 9,7:1
  accent: '#F48A0B', // Laranja Safra; com texto azul (5,8:1), nunca com texto branco
  accentSoft: '#FEF1E1',
  accentText: '#A85300', // laranja para texto sobre fundo claro (5,4:1)
  accentOnPrimary: '#F48A0B', // laranja sobre o azul (5,8:1), como "ONLINE" na assinatura
  background: '#F6F4EF',
  surface: '#FFFFFF',
  surfaceMuted: '#EEEBE4',
  ink: '#0D1B33', // 15,6:1 sobre o fundo
  inkMuted: '#4F5D73', // 6,1:1 sobre o fundo
  inkSubtle: '#8590A3', // somente ícones e textos grandes
  onPrimary: '#FFFFFF',
  onAccent: '#072858',
  border: '#E3E0D8',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  success: '#072858',
  successSoft: '#E8EDF6',
  overlay: 'rgba(5, 20, 45, 0.5)',
  skeleton: '#E6E3DB',
};

// Famílias carregadas em App.jsx (@expo-google-fonts/outfit). Com fonte personalizada, o peso
// vem da família, não de fontWeight (no Android, fontWeight não escolhe o arquivo da fonte).
export const font = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
  extrabold: 'Outfit_800ExtraBold',
};

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 };

// Cantos arredondados como no ícone do aplicativo.
export const radius = { sm: 8, md: 14, lg: 18, xl: 26, pill: 999 };

// Tamanhos pensados para 360 px de largura; o texto acompanha a fonte do sistema.
export const type = {
  display: { fontSize: 27, lineHeight: 32, fontFamily: font.bold, color: colors.ink, letterSpacing: -0.4 },
  title: { fontSize: 21, lineHeight: 27, fontFamily: font.bold, color: colors.ink },
  heading: { fontSize: 18, lineHeight: 24, fontFamily: font.semibold, color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, fontFamily: font.regular, color: colors.ink },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontFamily: font.semibold, color: colors.ink },
  small: { fontSize: 14, lineHeight: 20, fontFamily: font.regular, color: colors.inkMuted },
  smallStrong: { fontSize: 14, lineHeight: 20, fontFamily: font.semibold, color: colors.ink },
  // Rótulo espaçado em caixa-alta, como "ONLINE" e "IDENTIDADE FINAL" no manual da marca.
  caption: { fontSize: 12, lineHeight: 16, fontFamily: font.medium, color: colors.inkMuted, letterSpacing: 2 },
  price: { fontSize: 18, lineHeight: 24, fontFamily: font.bold, color: colors.primary },
};

export const shadow = {
  card: { boxShadow: '0px 2px 10px rgba(7, 40, 88, 0.07)' },
  raised: { boxShadow: '0px 10px 28px rgba(7, 40, 88, 0.18)' },
  bar: { boxShadow: '0px -4px 16px rgba(7, 40, 88, 0.08)' },
};

// Movimento: ease-out forte para entradas e respostas; nada de ease-in em interface.
// "O S que anda": a marca se move para a frente (da esquerda para a direita), como o carrinho.
export const motion = {
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
  easeInOut: Easing.bezier(0.77, 0, 0.175, 1),
  easeOutCss: 'cubic-bezier(0.23, 1, 0.32, 1)',
  press: 120,
  quick: 180,
  enter: 260,
};

export const touch = { min: 44, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 } };

export const colors = {
  background: '#0B1319', // Dark teal-tinted background
  card: 'rgba(20, 30, 40, 0.4)', // Transparent for glassmorphism
  text: '#FFFFFF',
  textSecondary: '#B0C4DE',
  primary: '#188B8D', // Teal
  accent: '#D4AF37', // Gold
  favorite: '#FF4500', // Orange red
  border: 'rgba(255, 255, 255, 0.2)',
};

export const typography = {
  fontFamily: 'Outfit_400Regular',
  sizes: {
    small: 14,
    medium: 18,
    large: 24,
    xlarge: 32,
    xxlarge: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const theme = {
  colors,
  typography,
  spacing,
};

export default theme;

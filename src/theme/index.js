export const colors = {
  background: '#1A1A1A',
  card: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  primary: '#8A2BE2', // Deep purple
  accent: '#FFD700', // Gold
  favorite: '#FF4500', // Orange red
  border: '#3D3D3D',
};

export const typography = {
  fontFamily: 'System', // We can update this to a custom font later
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

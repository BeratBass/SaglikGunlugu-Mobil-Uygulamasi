export const COLORS = {
  // Primary colors
  primary: '#4CAF50',
  secondary: '#66BB6A',
  
  // Background colors
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  
  // Gray scale colors
  darkGray: '#616161',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  
  // Green scale colors
  darkGreen: '#2E7D32',
  
  // Border and divider colors
  divider: '#E0E0E0',
  cardDivider: '#EEEEEE',
  inputBorder: '#BDBDBD',
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  border: '#CCCCCC',
  warningBackground: '#FFCCCCC', 

  
  // Gradient colors
  gradientStart: '#A5D6A7',
  gradientEnd: '#4CAF50',
} as const;

export type Colors = typeof COLORS; 
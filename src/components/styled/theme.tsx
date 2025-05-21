import { Theme } from '@emotion/react';

export const theme: Theme = {
  colors: {
    primary: '#bb8930',
    primaryDark: '#9a7228',
    secondary: '#1a1a2e',
    secondaryDark: '#14142a',
    background: '#f5f5f7',
    backgroundDark: '#1a1a2e',
    backgroundLight: '#ffffff',
    text: '#333333',
    textDark: '#E0DDE5',
    border: '#d1d1d1',
    error: '#dc3545',
    success: '#28a745',
    warning: '#ffc107',
    disabled: '#6c757d',
    highlight: 'rgba(187, 137, 48, 0.1)'
  },
  fonts: {
    primary: '"Cormorant Garamond", serif',
    secondary: 'Arial, sans-serif'
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.2rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
    xxxlarge: '2.5rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transitions: {
    default: '0.3s ease',
    fast: '0.2s ease',
    slow: '0.5s ease'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
};

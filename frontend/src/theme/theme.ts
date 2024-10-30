import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { variables } from '../styles/abstracts/variables';
import { components } from './components';
import { palette } from './palette';

const baseTheme = createTheme();

let theme = createTheme({
  palette,
  components: {
    ...components,
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: `blur(${variables.effects.blur})`,
          backgroundColor: variables.colors.glassBackground,
          borderRadius: variables.effects.borderRadius,
          boxShadow: variables.effects.boxShadow,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          width: `${variables.layout.sidebarWidth}px`,
        },
      },
    },
  },
  typography: {
    fontFamily: variables.typography.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: variables.typography.fontWeight.semibold,
    },
    // ... rest of typography config
  },
  shape: {
    borderRadius: parseInt(variables.effects.borderRadius),
  },
  shadows: [...baseTheme.shadows],
});

theme = responsiveFontSizes(theme);

export { theme };
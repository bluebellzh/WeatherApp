import { Components, Theme } from '@mui/material';
import { variables } from '../styles/abstracts/variables';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: variables.effects.borderRadius,
        textTransform: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: variables.effects.borderRadius,
        },
      },
    },
  },
};
'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#33c6dd',
      contrastText: '#000000'
    },
    secondary: {
      main: '#614dc9',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ec1c1c'
    }
  },
  typography: {
    fontFamily: "'Heebo', Arial, sans-serif"
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 700
        }
      }
    }
  }
});

export default theme;

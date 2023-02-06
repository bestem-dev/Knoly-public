import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a"
    },
    primary: {
      main: '#40ffb5',
      light: '#0f172a',
    },
    secondary: {
      main: '#9f30fa',
    },
    error: {
      main: red.A400,
    },
  },
  transitions: {
    duration: {
      enteringScreen: 100,
      leavingScreen: 100
    }
  },
  typography: {
    fontFamily: [
      "'Lexend'",
      "sans-serif"
    ].join(',')
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundImage: "linear-gradient(90deg, rgba(159,48,250,1) 0%, rgba(66,85,233,1) 100%)",
          color: "white"
        }
      } 
    }
  }
});

export default theme;
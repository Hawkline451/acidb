import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesHome } from './themes'

// loading component for suspense fallback
const useStylesHome = stylesHome

export default function Footer(){
  const classes = useStylesHome();
  return (
    <ThemeProvider theme={theme}>
    <footer className={classes.footer}>
      <Container>
        <Typography variant="body1">My sticky footer can be found here.</Typography>
      </Container>
    </footer>
    </ThemeProvider>
  );
}

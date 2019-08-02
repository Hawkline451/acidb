import React from 'react';

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './themes'

//Organism component
export default function Organism() {

  return (
    <ThemeProvider theme={theme}>
      <h1>
        Detail
      </h1>

      <div>
        I m an Organism (⌐■_■)
      </div>
    </ThemeProvider>
  );
}
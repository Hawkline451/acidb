import React from 'react';

// Styles
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './themes'

//Organism component
export default function Organism(props) {

  return (
    <ThemeProvider theme={theme}>
      <h1>
        Detail
      </h1>
      <h1>{props.match.params.id}</h1>

      <div>
        I m an Organism (⌐■_■)
      </div>
    </ThemeProvider>
  );
}
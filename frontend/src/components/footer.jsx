import React from 'react';
import Typography from '@material-ui/core/Typography';

// Styles
import { stylesFooter } from './css/themes'

// loading component for suspense fallback
const useStylesFooter = stylesFooter

export default function Footer() {
  const classes = useStylesFooter();
  //Phantom div for padding
  return (
    <div style={{height:15}}>
      <div>
      </div>
      <div className={classes.footer}>
        <div >
          <Typography variant="body1">My sticky footer can be found here.</Typography>
        </div>
      </div>
    </div>
  );
}

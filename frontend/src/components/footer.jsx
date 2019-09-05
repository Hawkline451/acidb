import React from 'react';
import Typography from '@material-ui/core/Typography';

// Styles
import { stylesFooter } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

// loading component for suspense fallback
const useStylesFooter = stylesFooter


export default function Footer() {
  const { t } = useTranslation();
  const classes = useStylesFooter();
  //Phantom div for padding
  return (
    <div style={{height:15}}>
      <div>
      </div>
      <div className={classes.footer}>
        <div >
          <Typography variant="body1">{t('footer.desc')}</Typography>
        </div>
      </div>
    </div>
  );
}

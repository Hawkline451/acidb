// Themes & Styles
import {
  createMuiTheme
} from '@material-ui/core/styles';
import {
  red
} from '@material-ui/core/colors';

import {
  fade,
  makeStyles
} from '@material-ui/core/styles';




// Theme
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#B35FA6'
    },
    secondary: {
      main: '#66B34D'
    },
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

// Component Styles
export const stylesHome = makeStyles(theme => ({
  fixedDiv: {
    paddingTop: 50,
  },
  tabLabel: {
    fontSize: 25
  },

}));

export const stylesAppNav = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },

  tabRoot: {
    minWidth: 20,
  },
  search: {
    marginLeft: 'auto',
    marginRight: -10,

    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: 'auto',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));
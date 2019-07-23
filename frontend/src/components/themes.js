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
      main: '#703D80'
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
  footer: {
    alignSelf: "end",
    textAlign: "center"
  },

}));

export const stylesInput = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  select: {
    flex: 0.5,
    textAlign: 'center'
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});

export const stylesTree = makeStyles({
  container: {
    margin: 20
  },
  icon: {
    fontSize: 20
  },
  node: {
    display: "flex",
    alignContent: "center"
  }
});

export const stylesAppNav = makeStyles(theme => ({

  tabRoot: {
    minWidth: 20,
    fontSize: 20,
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

}));
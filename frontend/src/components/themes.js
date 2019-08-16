// Themes & Styles
import {
  createMuiTheme
} from '@material-ui/core/styles';
import {
  red
} from '@material-ui/core/colors';

import {
  makeStyles
} from '@material-ui/core/styles';

// Theme
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8662BD',
    },
    secondary: {
      main: '#D6B3FE'
    },
    text: {
      primary: "#000000",
      secondary: "#ffffff"
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
    paddingTop: 60,
  },
  footer: {
    display: 'flex',
    alignSelf: "flex-end",
    textAlign: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary 
  },

}));

export const stylesInput = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    //borderRadius: 2,
  },
  input: {
    marginLeft: 8,
    width: '70%',
  },
  select: {
    width: '30%',
    textAlign: 'center',
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
    fontSize: 20,
    minWidth: 'auto'
  },
  tabMenu: {
    fontSize: 18,
    width: '10%'
  },

  homeButton: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  search: {
    marginLeft: 'auto',
    marginRight: -10,
    width: '25%'
  },

}));

export const stylesTable = makeStyles({
  formControl: {
    margin: 20,
    minWidth: '10%',
    wrap: 'nowrap'
  },
  errorInput: {
    background: '#ffdbdb'
  },
  customTooltip: {
    maxWidth: '50%',
  },
  customIcon: {
    maxWidth: '150%',
  },
  specialTextInput: {
    width: '100%'
  },
  verticalAlign: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },
  multilineDiv: {
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },
  buttonGrid:{
    width: '1%',
  }
});

export const stylesDetail = makeStyles({

  fixedList:{
    position: 'fixed',
    overflow: 'hidden',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    maxWidth: '20%',
  },
  table:{
    marginLeft: '15%',
    marginBottom: 50,
    width: '50%',
  },
  tableTitle:{
    marginTop: 20,
    marginLeft: '15%',
    width: '50%',
  },
  tableCell:{
    width: '50%',
    backgroundColor: theme.palette.primary.main,
    color:  theme.palette.text.secondary,
  },
  listItem:{
    backgroundColor: theme.palette.primary.main,    
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color:  theme.palette.text.primary, 
    },
    color:  theme.palette.text.secondary, 
  }
});
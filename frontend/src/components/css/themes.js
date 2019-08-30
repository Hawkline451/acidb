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
    paddingTop: 0,
  }
}));

// Navbar search input
export const stylesInput = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
    padding: 2,
    fontSize: 18
  },
  input: {
    padding: 0,
    height: 'auto'
  },
  selectTypeSearch: {
    width: '30%',
  },
  selectOrganismSearch: {
    width: '70%',
  },
});

// Tree
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

export const stylesFooter = makeStyles(theme => ({
  footer: {
    textAlign: "center",
    bottom: 0,
    width: "100%",
    position: 'absolute',
    padding: 2,
    background: theme.palette.primary.main,
    color: theme.palette.text.secondary
  },

}));

export const stylesTable = makeStyles({
  formControl: {
    margin: 20,
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
  buttonGrid: {
    width: '1%',
  },
  noDecoratorLink: {
    textDecoration: 'none',
  }
});

export const stylesDetail = makeStyles({

  fixedList: {
    position: 'fixed',
    overflow: 'hidden',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    maxWidth: '20%',
  },
  table: {
    marginLeft: '15%',
    marginBottom: 50,
    width: '50%',
  },
  tableTitle: {
    marginTop: 20,
    marginLeft: '15%',
    width: '50%',
  },
  tableCell: {
    width: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
  },
  listItem: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.text.primary,
    },
    color: theme.palette.text.secondary,
  }
});


// Styles select-react
export const customSelectStyles = {
  control: () => ({
    borderStyle: 'none',
    display: 'flex',

  }),
}
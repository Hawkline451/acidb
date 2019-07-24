import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  AppBar, InputBase, Typography, Toolbar, Paper, Input, Button, Popper, MenuList,
  Tab, Tabs, ClickAwayListener, IconButton, Divider, MenuItem, Select,
} from '@material-ui/core';
import {
  Search as SearchIcon
} from '@material-ui/icons';

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesAppNav, stylesInput } from './themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesAppNav = stylesAppNav
const useStylesInput = stylesInput

//Search Component
function CustomSearchInput() {
  const classes = useStylesInput();
  const { t } = useTranslation();

  const [values, setValues] = React.useState({
    searchType: 'default',
    searchQuery: null,
  });

  function handleChange(event) {
    const tmpValue = event.target.value
    const tmpName = event.target.name
    setValues(oldValues => ({
      ...oldValues,
      [tmpName]: tmpValue,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper className={classes.root}>
        <Select
          className={classes.select}
          value={values.searchType}
          onChange={handleChange}
          input={<Input name='searchType' />}
          displayEmpty
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            }
          }}
        >
          <MenuItem value={'default'}>Default</MenuItem>
          <MenuItem value={'asd1'}>ASD1</MenuItem>
          <MenuItem value={'asd2'}>ASD2</MenuItem>
        </Select>

        <Divider className={classes.divider} />
        <InputBase
          className={classes.input}
          placeholder={t('navbar.search')}
          name='searchQuery'
          onChange={handleChange}
        />
        <IconButton className={classes.iconButton} aria-label='Search' label='Submit' type='submit'>
          <SearchIcon />
        </IconButton>
      </Paper>
    </form>
  );
}

// Tab Menu component
function TabMenu(props) {
  const classes = useStylesAppNav();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  // Open popper under the tab
  function handleClick(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  
  function handleItemClick(event, newVal) {
    setAnchorEl(null)
    props.onChange(event, props.value)
    console.log(props)
  }
  // Hide menu when clicking outside te menu items
  function handleClickAway() {
    setAnchorEl(null)
  }

  return (
    <div>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Tab label='Tools Menu' onClick={handleClick} className={classes.tabRoot} />
      </ClickAwayListener>
      <Popper id={id} open={open} anchorEl={anchorEl} placement={'bottom-start'} className={classes.tabMenu}>
        <Paper square >
          <MenuList>
            <MenuItem onClick={handleItemClick} component={Link} to='/app/tools'>
              Tool 1
            </MenuItem>
            <MenuItem onClick={handleItemClick}>
              Tool 2
            </MenuItem>
          </MenuList>
        </Paper>
      </Popper>
    </div>
  )
}

//NavBar component
export default function NavBar() {

  const classes = useStylesAppNav();
  const { t } = useTranslation();

  // Tab underline state
  const [tabVal, setTabState] = React.useState({ underline: false });
  function handleTabChange(event, newVal) {
    setTabState({
      underline: newVal
    });
  }
  function cleanState(event) {
    setTabState({
      underline: false,
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>

        <AppBar position='static'>
          <Toolbar>
            <Button
              className={classes.homeButton}
              onClick={cleanState}
              component={Link} to='/app'>
              <Typography variant='h5' color='textSecondary' noWrap>
                {t('navbar.title')}
              </Typography>
            </Button>

            <Tabs name='tabVal' value={tabVal.underline} onChange={handleTabChange}>
              <Tab label={t('navbar.tree')} component={Link} to='/app/tree' className={classes.tabRoot} />
              <Tab label={t('navbar.tools')} component={Link} to='/app/tools' className={classes.tabRoot} />
              <TabMenu />
            </Tabs>

            <div className={classes.search}>
              <CustomSearchInput />
            </div>
          </Toolbar>
        </AppBar>

      </div>
    </ThemeProvider>
  );
}
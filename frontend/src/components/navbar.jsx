import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  AppBar, InputBase, Typography, Toolbar, List, ListItem, Paper, Input,
  Tab, Tabs, Drawer, ClickAwayListener, IconButton, Divider, MenuItem, Select,
} from '@material-ui/core';
import {
  Menu as MenuIcon, Home as HomeIcon, Search as SearchIcon
} from '@material-ui/icons';

import MediaQuery from 'react-responsive'

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesAppNav, stylesInput } from './themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesAppNav = stylesAppNav
const useStylesInput = stylesInput

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

export default function NavBar() {
  const classes = useStylesAppNav();
  const { t } = useTranslation();

  // Tab underline state
  const [tabVal, setTabState] = React.useState(false);
  function handleChange(event, newVal) {
    setTabState(newVal);
  }
  function cleanState(event) {
    setTabState(false);
  }

  // Responsive drawer state
  const [drawerOpen, setDrawer] = React.useState(false);
  function handleToogle(event) {
    if (event.type === 'keydown') {
      return;
    }
    setDrawer(!drawerOpen)
  }
  function handleClickAway(event) {
    setDrawer(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>

        <AppBar position='static'>
          <Toolbar>

            <MediaQuery maxWidth={800}>
              <Drawer open={drawerOpen} >
                <ClickAwayListener onClickAway={handleClickAway}>
                  <List>
                    <ListItem button onClick={handleToogle} label='Home' component={Link} to='/app' className={classes.tabRoot} >{t('navbar.home')}</ListItem>
                    <ListItem button onClick={handleToogle} label='Tree' component={Link} to='/app/tree' className={classes.tabRoot} >{t('navbar.tree')}</ListItem>
                    <ListItem button onClick={handleToogle} label='Tools' component={Link} to='/app/tools' className={classes.tabRoot} >{t('navbar.tools')}</ListItem>
                  </List>
                </ClickAwayListener>
              </Drawer>
              <MenuIcon onClick={() => setDrawer({ drawerOpen: true })} />
              <Typography variant='h5' noWrap>
                {t('navbar.title')}
              </Typography>
              <div className={classes.search}>
                <CustomSearchInput />
              </div>
            </MediaQuery>

            <MediaQuery minWidth={800}>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='Open drawer'
                onClick={cleanState}
                component={Link} to='/app'
              >
                <HomeIcon />
              </IconButton>
              <Typography variant='h5' noWrap>
                {t('navbar.title')}
              </Typography>

              <Tabs value={tabVal} onChange={handleChange}>
                <Tab label={t('navbar.tree')} component={Link} to='/app/tree' className={classes.tabRoot} />
                <Tab label={t('navbar.tools')} component={Link} to='/app/tools' className={classes.tabRoot} />
              </Tabs>
              <div className={classes.search}>
                <CustomSearchInput />
              </div>
            </MediaQuery>
          </Toolbar>
        </AppBar>

      </div>
    </ThemeProvider>
  );
}
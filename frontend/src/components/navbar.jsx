import React from 'react';
import { Link } from "react-router-dom";

import {
  AppBar, InputBase, Typography, Toolbar, List, ListItem,
  Tab, Tabs, Drawer, ClickAwayListener, IconButton
} from '@material-ui/core';

import {Menu as MenuIcon, Home as HomeIcon, Search as SearchIcon } from '@material-ui/icons';


import MediaQuery from 'react-responsive'

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesAppNav } from './themes'



// Internationalization
import { useTranslation } from "react-i18next";
import "../i18n";

const useStyles = stylesAppNav

export default function NavBar() {
  const classes = useStyles();
  const { t } = useTranslation();

  // Tab underline state
  const [value, setValue] = React.useState(false);
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  function cleanState(event) {
    setValue(false);
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
        <MediaQuery minWidth={800}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Open drawer"
                onClick={cleanState}
                component={Link} to="/app"
              >
                <HomeIcon />
              </IconButton>
              <Typography variant="h5" noWrap>
                {t('navbar.title')}
              </Typography>

              <Tabs value={value} onChange={handleChange}>
                <Tab label={t('navbar.tree')} component={Link} to="/app/tree" className={classes.tabRoot} />
                <Tab label={t('navbar.tools')} component={Link} to="/app/tools" className={classes.tabRoot} />
              </Tabs>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder={t('navbar.search')}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'Search' }}
                />
              </div>
            </Toolbar>
          </AppBar>
        </MediaQuery>

        <MediaQuery maxWidth={800}>
          <AppBar position='static'>
            <Toolbar>
              <Drawer open={drawerOpen}>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <List>
                    <ListItem button onClick={handleToogle} label="Home" component={Link} to="/app" className={classes.tabRoot} >{t('navbar.home')}</ListItem>

                    <ListItem button onClick={handleToogle} label="Tree" component={Link} to="/app/tree" className={classes.tabRoot} >{t('navbar.tree')}</ListItem>
                    <ListItem button onClick={handleToogle} label="Tools" component={Link} to="/app/tools" className={classes.tabRoot} >{t('navbar.tools')}</ListItem>
                  </List>
                </ClickAwayListener>
              </Drawer>
              <MenuIcon onClick={() => setDrawer({ drawerOpen: true })} />
              <Typography variant="h5" noWrap>
                {t('navbar.title')}
              </Typography>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder={t('navbar.search')}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'Search' }}
                />
              </div>
            </Toolbar>
          </AppBar>
        </MediaQuery>
      </div>
    </ThemeProvider>
  );
}
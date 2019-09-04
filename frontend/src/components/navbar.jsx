import React from 'react';
import {
  AppBar, Typography, Toolbar, Paper, Button, Popper, MenuList,
  Tab, Tabs, ClickAwayListener, MenuItem,
} from '@material-ui/core';

// npm
import {
  Link
} from 'react-router-dom';

// Components
import CustomSearchInput from './custom_search'

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesAppNav } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesNav = stylesAppNav

// Tab Menu component
function TabMenu(props) {
  const classes = useStylesNav();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  // Open popper under the tab
  function handleClick(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  function handleItemClick(event) {
    setAnchorEl(null)
    props.onChange(event, props.value)
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
            <MenuItem onClick={handleItemClick} component={Link} to='/app/tools_table'>
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

  const classes = useStylesNav();
  const { t } = useTranslation();

  // Tab underline state
  const [tabVal, setTabState] = React.useState({ underline: false });
  function handleTabChange(event, newVal) {
    setTabState({
      underline: newVal
    });
  }
  function cleanState() {
    setTabState({
      underline: false,
    });
  }

  return (
    <ThemeProvider theme={theme}>

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
            <Tab label={t('navbar.tree')} component={Link} to='/app/tools_tree' className={classes.tabRoot} />
            <Tab label={t('navbar.table')} component={Link} to='/app/tools_table' className={classes.tabRoot} />
            <TabMenu />
          </Tabs>

          <div className={classes.search}>
            <CustomSearchInput cleanTabs={cleanState}/>
          </div>
        </Toolbar>
      </AppBar>

    </ThemeProvider>
  );
}
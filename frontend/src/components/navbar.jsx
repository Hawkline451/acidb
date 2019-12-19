import React from 'react';
import {
  AppBar, Toolbar, Paper, Button, Popper, MenuList,
  Tab, Tabs, ClickAwayListener, MenuItem,
} from '@material-ui/core';

// NPM
import {
  Link
} from 'react-router-dom';

// Components
import CustomSearchInput from './search_bar'
import logo from '../acidb-logo.svg';

// Themes
import { stylesAppNav } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesNav = stylesAppNav

// Tab Menu component
function TabMenuCharts(props) {
  const classes = useStylesNav();
  const { t } = useTranslation();

  //Charts popper
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
        <Tab label={t('navbar.charts')} onClick={handleClick} className={classes.tabRoot} />
      </ClickAwayListener>
      <Popper id={id} open={open} anchorEl={anchorEl} placement={'bottom-start'} className={classes.tabMenu}>
        <Paper square >
          <MenuList>
            <MenuItem onClick={handleItemClick} component={Link} to='/app/tools_bar_chart'>
              {t('navbar.bar_chart')}
            </MenuItem>
            <MenuItem onClick={handleItemClick} component={Link} to='/app/tools_scatter_plot'>
              {t('navbar.scatter_plot')}
            </MenuItem>
          </MenuList>
        </Paper>
      </Popper>
    </div>
  )
}

function TabMenuSearch(props) {
  const classes = useStylesNav();
  const { t } = useTranslation();

  //Charts popper
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
        <Tab label={t('search')} onClick={handleClick} className={classes.tabRoot} />
      </ClickAwayListener>
      <Popper id={id} open={open} anchorEl={anchorEl} placement={'bottom-start'} className={classes.tabMenu}>
        <Paper square >
          <MenuList>
            <MenuItem onClick={handleItemClick} component={Link} to='/app/advance_search/'>
              {t('navbar.advance_organism_search')}
            </MenuItem>
            <MenuItem onClick={handleItemClick} component={Link} to='/app/advance_protein_search/'>
              {t('navbar.advance_protein_search')}
            </MenuItem>
          </MenuList>
        </Paper>
      </Popper>
    </div>
  )
}

//NavBar component
export default function NavBar(props) {

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

    <AppBar position='static' className={classes.appBar}>
      <Toolbar>
        <Button
          className={classes.homeButton}
          onClick={cleanState}
          component={Link} to='/'>
          <img src={logo} alt="acidb-logo" height={40} />
        </Button>

        <Tabs name='tabVal' value={tabVal.underline} onChange={handleTabChange}>
          <Tab label={t('navbar.documentation')} component={Link} to='/app/documentation' className={classes.tabRoot} />
          <Tab label={t('navbar.tree')} component={Link} to='/app/tools_tree' className={classes.tabRoot} />
          <Tab label={t('navbar.table')} component={Link} to='/app/tools_table' className={classes.tabRoot} />
          <Tab label={t('navbar.scatter_plot')} component={Link} to='/app/tools_scatter_plot' className={classes.tabRoot} />
          <TabMenuSearch />
          {
            //<Tab label={t('navbar.advance_organism_search')} component={Link} to='/app/advance_search/' className={classes.tabRoot} />
          }

        </Tabs>

        <div className={classes.search}>
          <CustomSearchInput cleanTabs={cleanState} {...props} />
        </div>
      </Toolbar>
    </AppBar>

  );
}


import React from 'react';
import {
  AppBar, Box, Toolbar, List, ListItem, Container,
  Tab, Tabs, Drawer, ClickAwayListener
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MediaQuery from 'react-responsive'

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesHome } from '../components/themes'

const useStyles = stylesHome

function AboutSection() {
  const classes = useStyles();


  return (
      <div className={classes.fixedDiv} style={{ backgroundColor: '#', height: '100vh' }}>
      <span id="about"></span>

        <Container fixed>
          <p align='center'>About</p>
          <p>Cras facilisis urna ornare ex volutpat, et
          convallis erat elementum. Ut aliquam, ipsum vitae
          gravida suscipit, metus dui bibendum est, eget rhoncus nibh
          metus nec massa. Maecenas hendrerit laoreet augue
          nec molestie. Cum sociis natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus.</p>

          <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
          <p>Cras facilisis urna ornare ex volutpat, et
          convallis erat elementum. Ut aliquam, ipsum vitae
          gravida suscipit, metus dui bibendum est, eget rhoncus nibh
          metus nec massa. Maecenas hendrerit laoreet augue
          nec molestie. Cum sociis natoque penatibus et magnis
          dis parturient montes, nascetur ridiculus mus.</p>

          <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
        </Container>

      </div>
  );
}

function FeaturesSection() {
  const classes = useStyles();

  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#', height: '50vh' }}>
    <span id="features"></span>

      <Container fixed>
        <p align='center'>features</p>
        <p>Cras facilisis urna ornare ex volutpat, et
        convallis erat elementum. Ut aliquam, ipsum vitae
        gravida suscipit, metus dui bibendum est, eget rhoncus nibh
        metus nec massa. Maecenas hendrerit laoreet augue
        nec molestie. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus.</p>

        <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
        <p>Cras facilisis urna ornare ex volutpat, et
        convallis erat elementum. Ut aliquam, ipsum vitae
        gravida suscipit, metus dui bibendum est, eget rhoncus nibh
        metus nec massa. Maecenas hendrerit laoreet augue
        nec molestie. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus.</p>

        <p>Duis a turpis sed lacus dapibus elementum sed eu lectus.</p>
      </Container>

    </div>
  );
}


export default function Home() {
  const classes = useStyles();
  const [drawerOpen, setState] = React.useState(false);

  function handleToogle(event) {
    if (event.type === 'keydown') {
      return;
    }
    setState(!drawerOpen)
  }

  function handleClickAway(event) {
    setState(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <MediaQuery maxWidth={800}>
          <AppBar position='fixed'>
            <Toolbar>
              <Drawer open={drawerOpen}>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <List>
                    <ListItem button onClick={handleToogle} component="a" href="#about" >> <span href="#about">About</span> </ListItem>
                    <ListItem button onClick={handleToogle} component="a" href="#features" >>  <span href="#features">Features</span> </ListItem>
                    <ListItem button onClick={handleToogle} component="a" href="/app" >> <span href="#about">APP</span> </ListItem>
                  </List>
                </ClickAwayListener>

              </Drawer>
              <MenuIcon onClick={() => setState({ drawerOpen: true })} />
            </Toolbar>
          </AppBar>

        </MediaQuery>

        <MediaQuery minWidth={800}>
          <AppBar position='fixed' >
            <Box width="40%">
              <Tabs value={false} centered>
                <Tab label={<span className={classes.tabLabel}>Home</span>} href="#about" />
                <Tab label={<span className={classes.tabLabel}>Features</span>} href="#features" />
                <Tab label={<span className={classes.tabLabel}>App</span>} href="/app" />
              </Tabs>
            </Box>
          </AppBar>
        </MediaQuery>
      </div>

      <AboutSection style={{ backgroundColor: '', height: '100vh' }} />
      <FeaturesSection style={{ backgroundColor: '', height: '100vh' }} />

    </ThemeProvider>
  );
};
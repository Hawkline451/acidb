import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  AppBar, Box, Toolbar, List, ListItem, Container, Button,
  Tab, Tabs, Drawer, ClickAwayListener, Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MediaQuery from 'react-responsive'

import Footer from '../components/footer'

// Themes
import { ThemeProvider } from '@material-ui/styles';
import { theme, stylesHome, stylesAppNav } from '../components/css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesHome = stylesHome
const useStylesNav = stylesAppNav

function AboutSection() {
  const classes = useStylesHome();


  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#' }}>

      <Container>
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
  const classes = useStylesHome();

  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#' }}>

      <Container>
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
  const classes = useStylesNav();
  const { t } = useTranslation();
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
        <AppBar position='static' >
          <Toolbar>

            <MediaQuery maxWidth={800}>
              <AppBar position='fixed'>
                <Toolbar>
                  <Drawer open={drawerOpen}>
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <List>
                        <ListItem button onClick={handleToogle} component="a" href="#about" > <span href="#about">About</span> </ListItem>
                        <ListItem button onClick={handleToogle} component="a" href="#features" > <span href="#features">Features</span> </ListItem>
                        <ListItem button onClick={handleToogle} component="a" href="/app" > <span href="#about">APP</span> </ListItem>
                      </List>
                    </ClickAwayListener>
                  </Drawer>
                  <MenuIcon onClick={() => setState({ drawerOpen: true })} />
                  <Button
                    className={classes.homeButton}
                    component={Link} to='/'>
                    <Typography variant='h5' color='textSecondary' noWrap>
                      {t('navbar.title')}
                    </Typography>
                  </Button>
                </Toolbar>
              </AppBar>
            </MediaQuery>

            <MediaQuery minWidth={800}>
              <Button
                className={classes.homeButton}
                component={Link} to='/'>
                <Typography variant='h5' color='textSecondary' noWrap>
                  {t('navbar.title')}
                </Typography>
              </Button>
              <Box>
                <Tabs value={false}>
                  <Tab label={'Home'} className={classes.tabRoot} href="#about" />
                  <Tab label={'Features'} className={classes.tabRoot} href="#features" />
                  <Tab label={'App'} className={classes.tabRoot} href="/app" />
                </Tabs>
              </Box>
            </MediaQuery>

          </Toolbar>
        </AppBar>
      </div>

      <div>
        <span id="about"></span>
        <AboutSection />
        <span id="features"></span>
        <FeaturesSection />
      </div>
      <Footer />


    </ThemeProvider>
  );
};
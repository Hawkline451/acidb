import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  AppBar, Box, Toolbar, List, ListItem, Container, Button,
  Tab, Tabs, Drawer, ClickAwayListener, Typography, Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MediaQuery from 'react-responsive';

// Components
import Footer from '../components/footer';
import logo from '../acidb-logo.svg';

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
        <Typography variant='h4' align='center'>About</Typography>
        <p>AciDB provides an extensive database of manually curated acidophilic organisms. AciDB includes taxonomy
          for each of the sequenced organisms, charts to visualize the genomes with custom axis, advanced search features
          and general information such as: Genome size, GC content, Optimal pH and temperature growth of each acidophilic
          organism.</p>
      </Container>

      <div align='center'>
        <Button
          component={Link} to='/app/documentation' variant='outlined' style={{ color: theme.palette.primary.main }}>
          <Typography variant='h4'>Go to AciDB</Typography>
        </Button>
      </div>

    </div>
  );
}

function FeaturesSection() {
  const classes = useStylesHome();
  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#F5F5F5' }}>

      <Container>
        <Typography variant='h4' align='center'>Features</Typography>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6}>
            <Typography variant='h5' align='center'>Genomic Data of more than 450 acidophilic organisms</Typography>
            <p>Navigate through all organisms by using taxonomy information. Genome metadata that include the full taxonomy,
               reported growth condition, references and direct links to the NCBI ftp site of the organism are available..</p>
          </Grid>

          <Grid item xs={6}>
            <img src={process.env.PUBLIC_URL + '/img/home_tax.png'} /> 
          </Grid>

        </Grid>
      </Container>
    </div>
  );
}

function CiteUs() {
  const classes = useStylesHome();
  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#' }}>

      <Container>
        <Typography variant='h4' align='center'>Cite Us</Typography>
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
                        <ListItem button onClick={handleToogle} component="a" href="#cite" > <span href="#cite">Cite Us</span> </ListItem>
                        <ListItem button onClick={handleToogle} component="a" href="/app/documentation" > Go to AciDB </ListItem>

                      </List>
                    </ClickAwayListener>
                  </Drawer>
                  <MenuIcon onClick={() => setState({ drawerOpen: true })} />
                  <Button
                    className={classes.homeButton}
                    component={Link} to='/'>
                    <img src={logo} alt="acidb-logo" height={40} />
                  </Button>
                </Toolbar>
              </AppBar>
            </MediaQuery>

            <MediaQuery minWidth={800}>
              <Button
                className={classes.homeButton}
                component={Link} to='/'>
                <img src={logo} alt="acidb-logo" height={40} />
              </Button>
              <Box>
                <Tabs value={false}>
                  <Tab label={'About'} className={classes.tabRoot} href="#about" />
                  <Tab label={'Features'} className={classes.tabRoot} href="#features" />
                  <Tab label={'Cite Us'} className={classes.tabRoot} href="#cite" />
                  <Tab label={'Go to Acidb'} className={classes.tabRoot} href="/app/documentation" />
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
        <span id="cite"></span>
        <CiteUs />
      </div>
      <Footer />


    </ThemeProvider>
  );
};
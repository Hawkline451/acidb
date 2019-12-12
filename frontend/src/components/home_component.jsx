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

const useStylesHome = stylesHome
const useStylesNav = stylesAppNav

function AboutSection() {
  const classes = useStylesHome();
  return (
    <div className={classes.fixedDiv} style={{ backgroundColor: '#' }}>

      <Container>
        <Typography variant='h4' align='center'>About</Typography>
        <p align='justify'>AciDB provides an extensive database of manually curated acidophilic organisms. AciDB includes taxonomy
          for each of the sequenced organisms, charts to visualize the genomes with custom axis, advanced search features
          and general information such as: Genome size, GC content, Optimal pH and temperature growth of each acidophilic
          organism.</p>
      </Container>

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}>
        <Grid item>
          <Button
            component={Link} to='/app/documentation' variant='outlined' style={{ backgroundColor: theme.palette.primary.main }}>
            <Typography variant='h5' style={{ color: '#ffffff' }}>Documentation</Typography>
          </Button>
        </Grid>
        <Grid item>
          <Button
            component={Link} to='/app/tools_table' variant='outlined' style={{ backgroundColor: theme.palette.primary.main }}>
            <Typography variant='h5' style={{ color: '#ffffff' }}>Go to AciDB</Typography>
          </Button>
        </Grid>
      </Grid>

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
          spacing={5}
        >
          <Grid item xs={6}>
            <Typography variant='h5' align='center'>Genomic Data of more than 450 acidophilic organisms</Typography>
            <p align='justify'>Navigate through all organisms by using taxonomy information. Genome metadata that include the full taxonomy,
               reported growth condition, references and direct links to the NCBI ftp site of the organism are available.</p>
          </Grid>

          <Grid item xs={6}>
            <div>
              <img alt='home_tax' src={process.env.PUBLIC_URL + '/img/home_tax.png'} style={{ top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', }} />
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >

          <Grid item xs={6}>
            <div>
              <img alt='home_plot' src={process.env.PUBLIC_URL + '/img/home_plot.png'} style={{ top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', }} />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h5' align='center'>Generate customizable scatter plots</Typography>
            <p align='justify'>Choose between different growth conditions and genome characteristic to customize each axis.
              Select genomes in the plot and get the data as a csv file containing all the genome metadata.</p>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          <Grid item xs={6}>
            <Typography variant='h5' align='center'>Advance search to get a curated dataset</Typography>
            <p align='justify'>Filter a dataset of organisms by either growth range parameters, genome metadata, taxonomic rank or
              all the previous conditions at the same time and download the obtained dataset complete information.</p>
          </Grid>

          <Grid item xs={6}>
            <div>
              <img alt='home_search' src={process.env.PUBLIC_URL + '/img/home_search.png'} style={{ top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', }} />
            </div>
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
        <p align='center'>Jil J, Nahuel D, Neira G, Holmes D. (2020) AciDB: A database of moderate and extremely acidophilic organism.</p>
        <p align='center'> Nucleic Acids Research 47:4442-4448. doi: <a href='http://dx.doi.org/10.1093/nar/gkz246<'>http://dx.doi.org/10.1093/nar/gkz246</a></p>
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
                        <ListItem button onClick={handleToogle} component="a" href="/app/documentation" > Documentation </ListItem>
                        <ListItem button onClick={handleToogle} component="a" href="/app/tools_table" > Go to AciDB </ListItem>
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
                  <Tab label={'Go to Acidb'} className={classes.tabRoot} href="/app/tools_table" />
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
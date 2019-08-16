import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import NavBar from '../components/navbar'
import Footer from '../components/footer'

import TreeComponent from '../components/tree'
import TableComponent from '../components/table_component'
import OrganismComponent from '../components/organism'
import { Loader } from '../components/loader'


import logo from '../logo.svg';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../components/themes'



function Todo() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>TODO...</div>
    </div>
  )
}

function Page() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          <NavBar />
        </div>
        <div>
          <Route
            path="/app"
            render={() => (
              <Switch>
                <Route path="/app/organism/:id" component={OrganismComponent} />
                <Route path="/app/tree" component={TreeComponent} />
                <Route path="/app/tools" component={Todo} />
                <Route path="/app/tools_table" component={TableComponent} />
              </Switch>
            )}
          />
          <Footer />
        </div>

      </BrowserRouter>
    </ThemeProvider>

  );
}

const AppPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
};
export default AppPage



import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import NavBar from '../components/navbar'
import Footer from '../components/footer'

import TreeComponent from '../components/tree'
import TableComponent from '../components/table_component'
import OrganismComponent from '../components/organism'
import { Loader } from '../components/loader'

import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../components/css/themes'

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
                <Route path="/app/tools_tree" component={TreeComponent} />
                <Route path="/app/tools" component={Loader} />
                <Route path="/app/tools_table" component={TableComponent} />
              </Switch>
            )}
          />
        </div>
        <Footer />
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



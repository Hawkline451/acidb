import React, { Suspense, Fragment } from 'react';
import { Switch, Route, BrowserRouter } from "react-router-dom";

import logo from '../logo.svg';
import NavBar from '../components/navbar'
import Tree from '../components/tree'

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
    <div>loading...</div>
  </div>
);

function Page() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
      </div>
      <div>
        <Route
          path="/app"
          render={() => (
            <Fragment>
              <Switch>
                <Route path="/app/tree" render={() => <Tree />} />
                <Route path="/app/tools" render={() => <div>Tools</div>} />
              </Switch>
            </Fragment>
          )}
        />
      </div>
    </BrowserRouter>
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



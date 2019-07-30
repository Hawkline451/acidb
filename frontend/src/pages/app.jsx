import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import logo from '../logo.svg';
import NavBar from '../components/navbar'
import TreeComponent from '../components/tree'
import TableComponent from '../components/table_component'

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
    <div>loading...</div>
  </div>
);

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
    <BrowserRouter>
      <div>
        <NavBar />
      </div>
      <div>
        <Route
          path="/app"
          render={() => (
            <Switch>
              <Route path="/app/tree" render={() => <TreeComponent />} />
              <Route path="/app/tools" render={() => <Todo />} />
              <Route path="/app/tools_table" render={() => <TableComponent />} />
            </Switch>
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



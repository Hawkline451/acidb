import React, { Component} from 'react';
import {Router ,Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
//Pages
import AppPage from './pages/app';
import HomePage from './pages/home';
import NotFoundPage from './pages/404';

// Test page
import TestComponent from './components/test';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();   
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={HomePage} />

          <Route exact path='/app' component={AppPage} />
          <Route exact path='/app/documentation' component={AppPage} />
          <Route exact path='/app/organism/:id' component={AppPage} />
          <Route exact path='/app/advance_search/:query' component={AppPage} />
          <Route exact path='/app/advance_search/' component={AppPage} />
          <Route exact path='/app/advance_protein_search/:query' component={AppPage} />
          <Route exact path='/app/advance_protein_search/' component={AppPage} />
          <Route exact path='/app/tools_tree' component={AppPage} />
          <Route exact path='/app/tools' component={AppPage} />
          <Route exact path='/app/tools_table' component={AppPage} />
          <Route exact path='/app/tools_scatter_plot' component={AppPage} />
          <Route path="/app/tools_bar_chart" component={AppPage} />

          {/* Test page*/}
          <Route exact path="/test_page" component={TestComponent}/>

          <Route exact path ='/404' component ={NotFoundPage}/>

          <Redirect to='/404'/>
        </Switch>
      </Router>
    )
  }
}
export default App

/**
export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
**/
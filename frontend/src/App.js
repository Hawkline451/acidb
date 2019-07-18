import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
//Pages
import AppPage from './pages/app';
import HomePage from './pages/home';
import NotFoundPage from './pages/404';



class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/app' component={AppPage} />
          <Route exact path ='/404' component ={NotFoundPage}/>
          <Route exact path='/tree' component={AppPage} />
          <Route exact path='/tools' component={AppPage} />
          <Route exact path='/home' component={HomePage} />


          <Redirect to='/404'/>
        </Switch>
      </Router> 
    )
  }
}
export default App

/**
class App extends Component {
  render() {
    return (
      <Suspense fallback={<Loader />}>
        <Page />
      </Suspense>
    )
  }
}
export default App



export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
**/
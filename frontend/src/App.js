import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
//Pages
import AppPage from './pages/app';
import HomePage from './pages/home';
import NotFoundPage from './pages/404';

// Test page
import TestComponent from './components/test';



function testDetail(props)  {
      return (<h1>{props.match.params.id}</h1>);
  
}

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/app' component={AppPage} />
          <Route exact path='/app/organism' component={AppPage} />
          <Route exact path='/app/tree' component={AppPage} />
          <Route exact path='/app/tools' component={AppPage} />
          <Route exact path='/app/tools_table' component={AppPage} />

          {/* Test parameter route*/}
          <Route exact path="/test/:id" component={testDetail}/>
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
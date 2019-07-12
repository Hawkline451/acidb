import React, { Component, Suspense } from 'react';
import logo from './logo.svg';
import './App.css';

import NavBar from './components/NavBar'

function Page() {
  return (
    <div>
      <NavBar />
    </div>
  );
}

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
    <div>loading...</div>
  </div>
);

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


/** 
export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
**/
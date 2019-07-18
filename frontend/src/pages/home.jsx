import React, { Suspense } from "react";

import logo from '../logo.svg';
import Home from '../components/home_component'


// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
    <div>loading...</div>
  </div>
);

const HomePage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
};
export default HomePage;

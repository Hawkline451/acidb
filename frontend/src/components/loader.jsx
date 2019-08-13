import React from 'react';
import logo from '../logo.svg';

// loading component for suspense fallback
export const Loader = () => (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <div>loading...</div>
    </div>
  );
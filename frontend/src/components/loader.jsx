import React from 'react';
import logo from '../logo.svg';

// loading component for suspense fallback
export const Loader = () => (
    <div align='center'>
      <img src={logo} className="App-logo" alt="logo"/>
      <div align='center'>Loading...</div>
    </div>
  )
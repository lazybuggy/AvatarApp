import React from 'react';
import logo from './logo.svg';
import './App.css';

import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          It's baby Luu
        </p>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);

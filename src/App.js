import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  AmplifyGreetings,
  AmplifyAuthenticator,
  AmplifySignOut,
} from "@aws-amplify/ui-react";
import { listQuotes } from "./graphql/queries";
import {
  createQuote as createQuoteMutation,
  deleteQuote as deleteQuoateMutation,
} from "./graphql/mutations";
import { API, Storage, Auth } from "aws-amplify";
import Authenticator from "./Authenticator";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { AuthState,onAuthUIStateChange } from '@aws-amplify/ui-components';

import Home from "./Home";
// import { AmplifyAuthenticator, AmplifySignOut,AmplifySignIn } from "@aws-amplify/ui-react";

const initalFormState = { character: "", text: "", likes: 0 };

// useEffect(()=>{

// },[])

function App() {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  {console.log("hmmm..",user)}

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return (
    <HashRouter>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/sign-in">Log in</NavLink>
      {authState === AuthState.SignedIn && user && <AmplifyGreetings username={user.username}></AmplifyGreetings>}
      <Route exact path="/" component={Home} />
      <Route
        path="/sign-in"
        component={(props) => (
          <Authenticator
            {...props}
            setUser={setUser}
            setAuthState={setAuthState}
          />
        )}
      />
    </HashRouter>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  AmplifyGreetings,
  AmplifyAuthenticator,
  AmplifySignOut,
} from "@aws-amplify/ui-react";
import { listQuotes } from "./graphql/queries";
// import { listQuotes } from "./graphql/queries";
// import {
//   createQuote as createQuoteMutation,
//   deleteQuote as deleteQuoateMutation,
// } from "./graphql/mutations";
import { API, Storage } from "aws-amplify";
import Authenticator from "./Authenticator";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

import Home from "./Home";
import Admin from "./Admin";
// import { AmplifyAuthenticator, AmplifySignOut,AmplifySignIn } from "@aws-amplify/ui-react";

// const initalFormState = { character: "", text: "", likes: 0 };

// useEffect(()=>{

// },[])

function App() {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  const [quotes, setQuotes] = useState([]);
  // const [formData, setFormData] = useState(initalFormState);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    const apiData = await API.graphql({ query: listQuotes });
    const quotesFromAPI = apiData.data.listQuotes.items;
    await Promise.all(
      quotesFromAPI.map(async (quote) => {
        if (quote.image) {
          const image = await Storage.get(quote.image);
          quote.image = image;
        }
        return quote;
      })
    );
    setQuotes(quotesFromAPI);
    // setQuotes(apiData.data.listQuotes.items);
  }

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
      {authState === AuthState.SignedIn && user && (
        <NavLink to="/admin">Admin Panel
        </NavLink>
      )}
      {authState === AuthState.SignedIn && user && (
        <AmplifyGreetings username={user.username}></AmplifyGreetings>
      )}
      <Route
        exact
        path="/"
        component={(props) => <Home {...props} quotes={quotes} />}
      />
      <Route
        exact
        path="/admin"
        component={(props) => (
          <Admin
            {...props}
            user={user}
            authState={authState}
            quotes={quotes}
            setQuotes={setQuotes}
          />
        )}
      />
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

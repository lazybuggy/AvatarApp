import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import { AmplifyGreetings } from "@aws-amplify/ui-react";
import { listQuotes } from "./graphql/queries";
import { Auth, API, Storage } from "aws-amplify";
import Authenticator from "./Authenticator";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

import Home from "./Home";
import Admin from "./Admin";
import Quotes from "./Quotes";

const App = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (authState === undefined) {
      Auth.currentAuthenticatedUser().then((authData) => {
        setAuthState(AuthState.SignedIn);
        setUser(authData);
      });
    }
  }, [authState]);

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, [user, authState]);

  return (
    <BrowserRouter>
      <div className="nav">
        <div>
          <NavLink to="/" className="link">
            Home
          </NavLink>
          {!user && (
            <NavLink to="/sign-in" className="link">
              Log in
            </NavLink>
          )}
          <NavLink to="/all-quotes" className="link">
            View All Quotes
          </NavLink>
          {authState === AuthState.SignedIn && user && (
            <NavLink to="/admin" className="link">
              Admin Panel
            </NavLink>
          )}
        </div>
        {authState === AuthState.SignedIn && user && (
          <AmplifyGreetings username={user.username}></AmplifyGreetings>
        )}
      </div>
      <Route
        exact
        path="/"
        component={(props) => <Home {...props} quotes={quotes} />}
      />
      <Route
        exact
        path="/all-quotes"
        component={(props) => (
          <Quotes {...props} quotes={quotes} setQuotes={setQuotes} />
        )}
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
    </BrowserRouter>
  );
};

export default App;

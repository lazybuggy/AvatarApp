import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./Admin.css";

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
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

import Home from "./Home";
// import { AmplifyAuthenticator, AmplifySignOut,AmplifySignIn } from "@aws-amplify/ui-react";

const initalFormState = { character: "", nation: "", text: "", likes: 0 };

// useEffect(()=>{

// },[])

function Admin(props) {
  const { user, authState, history, quotes, setQuotes } = props;
  const [formData, setFormData] = useState(initalFormState);

  //   const [authState, setAuthState] = useState();
  //   const [user, setUser] = useState();
  //   {
  //     console.log("hmmm..", user);
  //   }

  useEffect(() => {
    if (authState != AuthState.SignedIn && !user) {
      history.push("/");
    }
  }, [user]);

  async function createQuote() {
    if (!formData.character || !formData.text || !formData.nation) {
      return;
    }
    await API.graphql({
      query: createQuoteMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setQuotes([...quotes, formData]);
    setFormData(initalFormState);
  }

  async function deleteQuote({ id }) {
    const newQuotesArray = quotes.filter((quote) => quote.id !== id);
    setQuotes(newQuotesArray);
    await API.graphql({
      query: deleteQuoateMutation,
      variables: { input: { id } },
    });
  }

  async function onChange(e) {
    if (!e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    // fetchQuotes();
  }

  return authState === AuthState.SignedIn && user ? (
    <div className="Admin">
      <div className="Form">
        <input
          onChange={(e) =>
            setFormData({ ...formData, character: e.target.value })
          }
          placeholder="Character Name"
          value={formData.character}
        />
        <input
          onChange={(e) => setFormData({ ...formData, nation: e.target.value })}
          placeholder="Character's Nation"
          value={formData.nation}
        />
        <input
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          placeholder="Quote"
          value={formData.text}
        />
        <input type="file" onChange={onChange} />
        <button onClick={createQuote}>Add New Quote</button>
      </div>
      <div className="Quotes">
        {quotes.map((quote) => (
          <div key={quote.id} className="item">
            <div className="left">
              <h2>{quote.text}</h2>
              <div className="character"><h4>{quote.character}</h4>
              <span> -  </span> <h6>{quote.nation}</h6>
              </div>
            </div>
            <div className="right">
              <h6>{quote.likes}</h6>
              {quote.image && <img src={quote.image} className="image" />}
              <button onClick={() => deleteQuote(quote)}>Delete Quote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export default Admin;

import React, { useState, useEffect } from "react";
import "./Admin.css";
import {
  createQuote as createQuoteMutation,
  deleteQuote as deleteQuoateMutation,
} from "./graphql/mutations";
import { API, Storage } from "aws-amplify";
import { AuthState } from "@aws-amplify/ui-components";

const initalFormState = { character: "", nation: "", text: "", likes: 0 };

const Admin = (props) => {
  const { user, authState, history, quotes, setQuotes } = props;
  const [formData, setFormData] = useState(initalFormState);

  useEffect(() => {
    if (authState !== AuthState.SignedIn && !user) {
      history.push("/");
    }
  }, [user,history,authState]);

  const createQuote = async() => {
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

  const deleteQuote = async({ id }) =>{
    const newQuotesArray = quotes.filter((quote) => quote.id !== id);
    setQuotes(newQuotesArray);
    await API.graphql({
      query: deleteQuoateMutation,
      variables: { input: { id } },
    });
  }

  const onChange= async(e)=> {
    if (!e.target.files[0]) {
      return;
    }
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
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
              <div className="character">
                <h4>{quote.character}</h4>
                <span className="dash"> - </span>
                <h4>{quote.nation}</h4>
              </div>
            </div>
            <div className="right">
              <h6>{quote.likes}</h6>
              {quote.image && (
                <img src={quote.image} className="image" alt={quote.character} />
              )}
              <button onClick={() => deleteQuote(quote)}>Delete Quote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export default Admin;

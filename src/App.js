import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { listQuotes } from "./graphql/queries";
import {
  createQuote as createQuoteMutation,
  deleteQuote as deleteQuoateMutation,
  deleteQuote,
} from "./graphql/mutations";
import { API, Storage } from "aws-amplify";

const initalFormState = { character: "", text: "", likes: 0 };

function App() {
  const [quotes, setQuotes] = useState([]);
  const [formData, setFormData] = useState(initalFormState);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    const apiData = await API.graphql({ query: listQuotes });
    const quotesFromAPI = apiData.data.listQuotes.items;
    await Promise.all(quotesFromAPI.map(async quote =>{
      if(quote.image){
        const image = await Storage.get(quote.image);
        quote.image = image;
      }
      return quote;
    }))
    setQuotes(quotesFromAPI);
    // setQuotes(apiData.data.listQuotes.items);
  }

  async function createQuote() {
    if (!formData.character || !formData.text) {
      return;
    }
    await API.graphql({
      query: createQuoteMutation,
      variables: { input: formData },
    });
    if(formData.image){
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setQuotes([...quotes, formData]);
    setFormData(initalFormState);
  }

  async function onChange(e) {
    if (!e.target.files[0]){return;}
    const file = e.target.files[0];
    setFormData({...formData, image: file.name});
    await Storage.put(file.name,file);
    fetchQuotes();
  }

  return (
    <div className="App">
      <input
        onChange={(e) =>
          setFormData({ ...formData, character: e.target.value })
        }
        placeholder="Character Name"
        value={formData.character}
      />
      <input
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        placeholder="Quote"
        value={formData.text}
      />
      <input type="file" onChange={onChange}/>
      <button onClick={createQuote}>Add New Quote</button>

      <div>
        {quotes.map((quote) => (
          <div key={quote.id}>
            <h2>{quote.text}</h2>
            <h4>{quote.character}</h4>
            <h6>{quote.likes}</h6>
            {quote.image && <img src={quote.image}/>}
            <button onClick={() => deleteQuote(quote)}>Delete Quote</button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default App; //withAuthenticator(App);

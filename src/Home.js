import React, { useEffect } from "react";
// import logo from "./logo.svg";
import "./Home.css";
import HeartSVG from "./HeartSVG";
// import { listQuotes } from "./graphql/queries";
import { updateQuote as updateQuoteMutation } from "./graphql/mutations";
import { API, Storage } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";

// const initalFormState = { character: "", text: "", likes: 0 };

function Home(props) {
  const { quotes, setAuthState, setUser, setQuotes } = props;
  //   const [quotes, setQuotes] = useState([]);
  //   const [formData, setFormData] = useState(initalFormState);

  useEffect(() => {
    // console.log('wtHGGHVGVBKJBHVCFCVHJBGHf');
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
      console.log("BHJGBHBVHBN NVFFYU JKHUGY");
    });
  }, []);

  //   useEffect(() => {
  //     fetchQuotes();
  //   }, []);

  //   async function fetchQuotes() {
  //     const apiData = await API.graphql({ query: listQuotes });
  //     const quotesFromAPI = apiData.data.listQuotes.items;
  //     await Promise.all(
  //       quotesFromAPI.map(async (quote) => {
  //         if (quote.image) {
  //           const image = await Storage.get(quote.image);
  //           quote.image = image;
  //         }
  //         return quote;
  //       })
  //     );
  //     setQuotes(quotesFromAPI);
  //     // setQuotes(apiData.data.listQuotes.items);
  //   }

  //   async function createQuote() {
  //     if (!formData.character || !formData.text) {
  //       return;
  //     }
  //     await API.graphql({
  //       query: createQuoteMutation,
  //       variables: { input: formData },
  //     });
  //     if (formData.image) {
  //       const image = await Storage.get(formData.image);
  //       formData.image = image;
  //     }
  //     setQuotes([...quotes, formData]);
  //     setFormData(initalFormState);
  //   }

  //   async function deleteQuote({ id }) {
  //     const newQuotesArray = quotes.filter(quote=> quote.id !== id);
  //     setQuotes(newQuotesArray);
  //     await API.graphql({
  //       query: deleteQuoateMutation,
  //       variables: { input: { id } },
  //     });
  //   }

  //   async function onChange(e) {
  //     if (!e.target.files[0]) {
  //       return;
  //     }
  //     const file = e.target.files[0];
  //     setFormData({ ...formData, image: file.name });
  //     await Storage.put(file.name, file);
  //     fetchQuotes();
  //   }

  async function updateQuoteLikes(quote) {
    // const newQuotesArray = quotes.filter((quote) => quote.id !== id);
    // setQuotes(newQuotesArray);
    const likes = quote.likes + 1;
    console.log("we likey", likes);
    const updatedQuoteData = await API.graphql({
      query: updateQuoteMutation,
      variables: { input: { id: quote.id, likes: likes } },
    });
    const updatedQuote = updatedQuoteData.data.updateQuote;
    updatedQuote.image = quote.image;

    setQuotes(quotes.map((q) => (q.id === quote.id ? updatedQuote : q)));
    console.log("returbn", updatedQuote);
  }

  return (
    <div>
      {console.log(quotes)}

      {/* <input
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
      <input type="file" onChange={onChange} />
      <button onClick={createQuote}>Add New Quote</button> */}

      <div>
        {quotes.map((quote) => (
          <div key={quote.id}>
            <h2>{quote.text}</h2>
            <h4>{quote.character}</h4>
            <div className="likesContainer">
              <h3 className="likes">{quote.likes}</h3>
              <HeartSVG onClick={() => updateQuoteLikes(quote)} />
            </div>
            {quote.image && <img src={quote.image} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

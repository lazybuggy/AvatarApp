import React, { useState, useEffect } from "react";
import "./Quote.css";
import HeartSVG from "./HeartSVG";
import { updateQuote as updateQuoteMutation } from "./graphql/mutations";
import { API } from "aws-amplify";

const Quote = (props) => {
  const { quote } = props;
  const [q, updateQ] = useState(quote);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    updateQ(quote);
    setHasLiked(false);
  }, [quote]);

  const updateQuoteLikes = async (quote) => {
    const likes = quote.likes + 1;
    const updatedQuoteData = await API.graphql({
      query: updateQuoteMutation,
      variables: { input: { id: quote.id, likes: likes } },
    });
    const updatedQuote = updatedQuoteData.data.updateQuote;
    updatedQuote.image = quote.image;

    setHasLiked(true);
    updateQ(updatedQuote);
  };

  return (
    <div key={q.id} className="Quote">
      {q.image && (
        <img className="quoteImage" src={q.image} alt={q.character} />
      )}
      <div className="textContainer">
        <div>
          <h2 className="text">{q.text}</h2>
          <h4 className="character">{q.character}</h4>
          <h6 className="nation">{q.nation}</h6>
        </div>
        <div className={"likesContainer " + (hasLiked ? "liked" : null)}>
          <h3 className="likes">{q.likes}</h3>
          <HeartSVG onClick={() => updateQuoteLikes(q)} />
        </div>
      </div>
    </div>
  );
};

export default Quote;

import React from "react";
import Quote from "./Quote";

const Quotes = (props) => {
  const { quotes } = props;

  return (
    <div className="Home">
      {quotes.map((quote) => (
        <Quote key={quote.id} quote={quote} />
      ))}
    </div>
  );
};

export default Quotes;
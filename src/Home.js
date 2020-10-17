import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import Quote from "./Quote";

const Home = (props) => {
  const { quotes } = props;
  const [randomQuote, setRandomQuote] = useState();

  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
  }, [quotes]);

  useEffect(() => {
    getRandomQuote();
  }, [getRandomQuote]);

  return (
    <div className="Home">
      {randomQuote && <Quote quote={randomQuote} />}
      <button className="newQuote" onClick={() => getRandomQuote()}>
        GET NEW QUOTE
      </button>
    </div>
  );
};

export default Home;

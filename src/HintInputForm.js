import React, { useState } from "react";
import { database } from "./firebase";
import { CONST_CARDS } from "./Constant";

function HintInputForm({ cluegiver, incrementTurn, lobby, team }) {
  const [word, setWord] = useState("");
  const [count, setCount] = useState(1);

  const getTeam = team => {
    switch (team) {
      case CONST_CARDS.RED:
        return "redClues";
      case CONST_CARDS.BLUE:
        return "blueClues";
      default:
        return;
    }
  };

  const submitHandler = e => {
    e.preventDefault();

    const cleanWord =
      word.length > 0
        ? word
          .split(" ")[0]
          .trim()
          .toLowerCase()
        : "";

    database
      .ref("lobby")
      .child(lobby.id)
      .child(getTeam(team))
      .push({ word: cleanWord, count })
      .then(() => {
        incrementTurn();
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      <span>Give clue</span>
      <form className="HintInputForm" onSubmit={submitHandler}>
        <input
          className={getTeam(team) === "blueClues" ? "wordInputBlue" : "wordInputRed"}
          type="text"
          style={{ margin: "0 5px" }}
          value={word}
          placeholder="WORD"
          onChange={e => setWord(e.target.value.toUpperCase())}
          maxLength="12"
          size="12"
        />
        <span>with</span>
        <input
          className={getTeam(team) === "blueClues" ? "numInputBlue" : "numInputRed"}
          type="number"
          style={{ margin: "0 5px", width: "70px" }}
          value={count}
          onChange={e => setCount(e.target.value.toUpperCase())}
          min="0"
        />
        <span>occurences</span>
        <button
          style={{ margin: "0 5px", padding: "10px" }}
          className={getTeam(team) === "blueClues" ? "btn-secondary" : "btn-danger"}
          onClick={submitHandler}
        >
          Submit Hint
        </button>
      </form>
    </div>
  );
}

export default HintInputForm;

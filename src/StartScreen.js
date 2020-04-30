import React, { useContext, useEffect } from "react";
import { userContext } from "./userContext";
import Words from "./Words";
import _ from "lodash";
import { database } from "./firebase";
import { CONST_CARDS, CONST_LOBBY_STATE, CONST_GAME_STATE } from "./Constant";

import ClipboardJS from "clipboard";

export default function StartScreen({ lobbyId }) {
  const lobby = useContext(userContext);

  useEffect(() => {
    new ClipboardJS(".clipboard");
  }, []);

  const generateCards = () => {
    return _.sampleSize(Words, 25);
  };

  const cardDistributor = sample => {
    let cardState = {};
    let card = Array.from(sample);
    let totalCards = card.length;
    let numBlueCards = Math.floor(0.36 * totalCards);
    let numRedCards = numBlueCards - 1;

    let blueCards = card.splice(0, numBlueCards);
    let redCards = card.splice(0, numRedCards);
    let blackCard = card.splice(0, 1);
    let neutralCards = card;

    blueCards.map(card => (cardState[card] = { actual: CONST_CARDS.BLUE }));
    redCards.map(card => (cardState[card] = { actual: CONST_CARDS.RED }));
    neutralCards.map(
      card => (cardState[card] = { actual: CONST_CARDS.NEUTRAL })
    );
    cardState[blackCard] = { actual: CONST_CARDS.BLACK };

    return cardState;
  };

  const hasRedCluegiver =
    lobby.cluegiverRed && lobby.players && lobby.players[lobby.cluegiverRed];
  const hasBlueCluegiver =
    lobby.cluegiverBlue && lobby.players && lobby.players[lobby.cluegiverBlue];
  const playerArray = [];
  _.forEach(lobby.players, (value, key) => {
    playerArray.push({ id: key, name: value.name });
  });
  const hasRedPlayers =
    _.filter(
      playerArray,
      p => lobby.teams && lobby.teams[p.id] === CONST_CARDS.RED
    ).length > 0;
  const hasBluePlayers =
    _.filter(
      playerArray,
      p => lobby.teams && lobby.teams[p.id] === CONST_CARDS.BLUE
    ).length > 0;

  const canStart =
    hasRedCluegiver && hasBlueCluegiver && hasRedPlayers && hasBluePlayers;

  const startGame = () => {
    if (!hasRedCluegiver) return;
    if (!hasBlueCluegiver) return;
    if (!hasRedPlayers) return;
    if (!hasBluePlayers) return;

    const cards = generateCards();
    const cardState = cardDistributor(cards);
    const shuffledCards = _.shuffle(cards);

    database
      .ref("lobby")
      .child(lobby.id)
      .update({
        state: CONST_LOBBY_STATE.LIVE,
        cards: shuffledCards,
        cardState,
        gameState: CONST_GAME_STATE.CLUEGIVER_BLUE
      });
  };

  return (
    <div className="StartScreen-container">
      <h1
        style={{
          textAlign: "center",
          fontSize: "3rem",
          margin: "1rem",
          marginTop: "-2rem"
        }}
      >
        Not Codenames
      </h1>

      <div
        className="border "
        style={{ textAlign: "center", margin: "1rem", padding: "1rem" }}
      >
        <h3 style={{ margin: "0rem" }}>Share your join code with friends</h3>
        <input
          id="code"
          style={{ display: "inline", padding: ".75rem" }}
          type="text"
          defaultValue={lobbyId}
          maxLength={4}
          size={4}
        />
        <button
          className="btn-secondary clipboard"
          data-clipboard-target="#code"
        >
          Copy
        </button>
      </div>

      <ul className="StartScreen-list">
        <li>
          {hasBlueCluegiver ? "✔️" : "❌"} Someone needs to be the Blue
          Cluegiver
        </li>
        <li>
          {hasRedCluegiver ? "✔️" : "❌"} Someone needs to be the Red Cluegiver
        </li>
        <li>
          {hasBluePlayers ? "✔️" : "❌"} At least one player on the Blue Guesser
        </li>
        <li>
          {hasRedPlayers ? "✔️" : "❌"} At least one player on the Red Guesser
        </li>
      </ul>
      <button
        className="btn-success btn-large"
        onClick={startGame}
        disabled={!canStart}
      >
        Start Game!
      </button>
    </div>
  );
}

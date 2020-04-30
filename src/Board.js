import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import HintInputForm from "./HintInputForm";
import GameOverlay from "./GameOverlay";
import { userContext } from "./userContext";
import { database, auth } from "./firebase";
import { CONST_CARDS, CONST_GAME_STATE, CONST_LOBBY_STATE } from "./Constant";
import _ from "lodash";
import Words from "./Words";

export default function Board({ size }) {
  const lobby = useContext(userContext);
  const [numTotalRedCards, setNumTotalRedCards] = useState(Infinity);
  const [numTotalBlueCards, setNumTotalBlueCards] = useState(Infinity);
  const [numRemainingRedCards, setNumRemainingRedCards] = useState(Infinity);
  const [numRemainingBlueCards, setNumRemainingBlueCards] = useState(Infinity);

  const winningTeam = () => {
    if (numRemainingRedCards === 0) return CONST_CARDS.RED;
    if (numRemainingBlueCards === 0) return CONST_CARDS.BLUE;

    const blackCard = lobby.cards.filter(
      x => cardState[x].actual === CONST_CARDS.BLACK
    );
    const winnerFromBlackOutcome = lobby.cardState && lobby.cardState[blackCard] && lobby.cardState[blackCard].guessByTeam === CONST_CARDS.RED ? CONST_CARDS.BLUE : CONST_CARDS.RED;

    return winnerFromBlackOutcome;
  };

  const cardState = lobby.cardState;
  const hoverState = lobby.hoverState;
  const gameState = lobby.gameState;
  const lobbyState = lobby.state;
  const uid = auth && auth.currentUser && auth.currentUser.uid;
  const isCluegiver = lobby.cluegiverRed === uid || lobby.cluegiverBlue === uid;

  const incrementTurn = () => {
    if (!lobby.id) return;
    database
      .ref("lobby")
      .child(lobby.id)
      .child("gameState")
      .transaction(x => {
        if (x !== undefined) {
          x++;
        }
        return x;
      });
  };

  const endGame = () => {
    database
      .ref("lobby")
      .child(lobby.id)
      .child("state")
      .set(CONST_LOBBY_STATE.GAMEOVER);
  };

  useEffect(() => {
    if (lobby && lobby.cards) {
      const numRedCards = lobby.cards.filter(
        x => cardState[x].actual === CONST_CARDS.RED
      ).length;

      const numBlueCards = lobby.cards.filter(
        x => cardState[x].actual === CONST_CARDS.BLUE
      ).length;

      const numBlueCardsRemaining = lobby.cards.filter(
        x =>
          cardState[x].actual === CONST_CARDS.BLUE &&
          cardState[x].guess === undefined
      ).length;

      const numRedCardsRemaining = lobby.cards.filter(
        x =>
          cardState[x].actual === CONST_CARDS.RED &&
          cardState[x].guess === undefined
      ).length;

      setNumTotalRedCards(numRedCards);
      setNumTotalBlueCards(numBlueCards);
      setNumRemainingRedCards(numRedCardsRemaining);
      setNumRemainingBlueCards(numBlueCardsRemaining);

      if (numRedCardsRemaining === 0) {
        endGame();
      }

      if (numBlueCardsRemaining === 0) {
        endGame();
      }
    }
  }, [gameState]);

  const canGiveHint =
    (uid === lobby.cluegiverRed &&
      gameState % 4 === CONST_GAME_STATE.CLUEGIVER_RED) ||
    (uid === lobby.cluegiverBlue &&
      gameState % 4 === CONST_GAME_STATE.CLUEGIVER_BLUE);

  const blueClues = _.toArray(lobby.blueClues);
  const redClues = _.toArray(lobby.redClues);

  const canEndTurn =
    (lobby.teams &&
      lobby.teams[uid] === CONST_CARDS.RED &&
      gameState % 4 === CONST_GAME_STATE.PLAYER_RED) ||
    (lobby.teams &&
      lobby.teams[uid] === CONST_CARDS.BLUE &&
      gameState % 4 === CONST_GAME_STATE.PLAYER_BLUE);

  const currentTurn = gameState => {
    let role;
    let turn = gameState % 4; // the only possible values of (x mod 4) are 0, 1, 2, 3 (which are the remainders)
    switch (turn) {
      case CONST_GAME_STATE.CLUEGIVER_BLUE:
        if (canGiveHint) {
          role = (
            <HintInputForm
              lobby={lobby}
              cluegiver="Blue Cluegiver"
              team={CONST_CARDS.BLUE}
              incrementTurn={incrementTurn}
            />
          );
        } else {
          role = `Waiting for Blue Cluegiver to provide a clue`;
        }

        break;
      case CONST_GAME_STATE.PLAYER_BLUE:
        const word = blueClues && _.last(blueClues).word;
        const count = blueClues && _.last(blueClues).count;
        role = (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                Blue Guessers have to find {numRemainingBlueCards} more cards
                with hint "{word.toUpperCase()}" ({count})
              </div>
              {canEndTurn && (
                <button className="btn-small btn-end" onClick={incrementTurn}>
                  End Turn
                </button>
              )}{" "}
            </div>
          </>
        );
        break;
      case CONST_GAME_STATE.CLUEGIVER_RED:
        if (canGiveHint) {
          role = (
            <HintInputForm
              lobby={lobby}
              cluegiver="Red cluegiver"
              team={CONST_CARDS.RED}
              incrementTurn={incrementTurn}
            />
          );
        } else {
          role = "Waiting for Red Cluegiver to provide a clue";
        }
        break;
      case CONST_GAME_STATE.PLAYER_RED: {
        const word = redClues && redClues.length > 0 && _.last(redClues).word;
        const count = redClues && redClues.length > 0 && _.last(redClues).count;
        role = (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <div>
                Red Guessers have to find {numRemainingRedCards} more cards with
                hint "{word.toUpperCase()}" ({count})
              </div>
              {canEndTurn && (
                <button className="btn-small btn-end" onClick={incrementTurn}>
                  End Turn
                </button>
              )}
            </div>
          </>
        );
        break;
      }
      default:
        role = "";
    }
    return role;
  };

  const onMouseEnter = cardName => {
    const uid = auth.currentUser.uid;
    if (cardName && uid && lobby.id) {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("hoverState")
        .child(cardName)
        .child(uid)
        .set(true);
    }
  };

  const onMouseLeave = cardName => {
    const uid = auth.currentUser.uid;
    if (cardName && uid && lobby.id) {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("hoverState")
        .child(cardName)
        .child(uid)
        .remove();
    }
  };

  const handleClick = (cardName, uid) => {
    if (isCluegiver) return;

    const team = lobby.teams[uid];

    const isBlueGuesserAndBluesTurn =
      lobby.gameState % 4 === CONST_GAME_STATE.PLAYER_BLUE &&
      team === CONST_CARDS.BLUE;

    const isRedGuesserAndRedsTurn =
      lobby.gameState % 4 === CONST_GAME_STATE.PLAYER_RED &&
      team === CONST_CARDS.RED;

    const hasGuess =
      cardState[cardName] && cardState[cardName].guess !== undefined;

    if (!hasGuess && (isBlueGuesserAndBluesTurn || isRedGuesserAndRedsTurn)) {
      const guessByName =
        lobby.players && lobby.players[uid] && lobby.players[uid].name;
      if (guessByName) {
        database
          .ref("lobby")
          .child(lobby.id)
          .child("cardState")
          .child(cardName)
          .child("guessBy")
          .set(guessByName);
        database
          .ref("lobby")
          .child(lobby.id)
          .child("cardState")
          .child(cardName)
          .child("guessByTeam")
          .set(lobby.teams[uid]);
      }

      database
        .ref("lobby")
        .child(lobby.id)
        .child("cardState")
        .child(cardName)
        .child("guess")
        .set(team)
        .then(() => {
          const ifGuessBlack =
            cardState && cardState[cardName].actual === CONST_CARDS.BLACK;

          if (ifGuessBlack) {
            endGame();
          }

          const isGuessRight =
            cardState &&
            cardState[cardName] &&
            cardState[cardName].actual === team;

          if (!isGuessRight) {
            incrementTurn();
          }
        });
    }
  };

  const pickNewTeams = () => {
    database
      .ref("lobby")
      .child(lobby.id)
      .update({
        state: CONST_LOBBY_STATE.MENU,
        cardState: null,
        cards: null,
        hoverState: null,
        redClues: null,
        blueClues: null,
        gameState: null
      });
  };

  const restartGame = () => {
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

    const cards = generateCards();
    const cardState = cardDistributor(cards);
    const shuffledCards = _.shuffle(cards);

    database
      .ref("lobby")
      .child(lobby.id)
      .update({
        state: CONST_LOBBY_STATE.LIVE,
        cardState,
        cards: shuffledCards,
        hoverState: null,
        redClues: null,
        blueClues: null,
        gameState: 0
      });
  };

  const playersHovering = cardName => {
    return (
      hoverState &&
      hoverState[cardName] &&
      Object.keys(hoverState[cardName])
        .filter(x => x !== lobby.cluegiverRed && x !== lobby.cluegiverBlue)
        .map(
          uid => lobby.players && lobby.players[uid] && lobby.players[uid].name
        )
        .filter(x => !!x)
    );
  };

  return (
    <div className="Board">
      <div className="Board-narrator">
        {lobbyState === CONST_LOBBY_STATE.GAMEOVER ? (
          <GameOverlay
            pickNewTeams={pickNewTeams}
            restartGame={restartGame}
            winningTeam={winningTeam}
          />
        ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              {currentTurn(lobby.gameState)}
            </div>
          )}
      </div>

      <div className="Board-cards Board-cards-size-5">
        {lobby.cards &&
          lobby.cards.map(card => (
            <Card
              isCluegiver={isCluegiver}
              cardName={card}
              key={card}
              cardState={cardState && cardState[card]}
              playersHovering={playersHovering(card)}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              handleClick={handleClick}
            />
          ))}
      </div>
    </div>
  );
}

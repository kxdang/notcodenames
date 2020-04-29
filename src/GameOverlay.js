import React from "react";
import { CONST_CARDS } from "./Constant";

import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

export default function GameOverlay({
  pickNewTeams,
  restartGame,
  winningTeam
}) {
  const { width, height } = useWindowSize();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      <h1>
        Game Over{" "}
        {winningTeam() === CONST_CARDS.BLUE ? "BLUE TEAM WON" : "RED TEAM WON"}!
      </h1>
      <button className="btn-secondary" onClick={restartGame}>
        Play with same teams
      </button>
      <button className="btn-secondary" onClick={pickNewTeams}>
        Pick new teams
      </button>
      <Confetti width={width} height={height} numberOfPieces="25" />
    </div>
  );
}

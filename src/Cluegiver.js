import React from "react";
import {
  CONST_CARDS_CSS_COLORS,
  CONST_CARDS,
  CONST_LOBBY_STATE
} from "./Constant";

export default function Cluegiver({
  team,
  player,
  lobbyState,
  onClick,
  hasTurn,
  lastClue
}) {
  const getTeamName = () => {
    switch (team) {
      case CONST_CARDS.RED:
        return "Red";
      case CONST_CARDS.BLUE:
        return "Blue";
      default:
        return "";
    }
  };

  const getTeamColor = () => {
    switch (team) {
      case CONST_CARDS.RED:
        return CONST_CARDS_CSS_COLORS.RED;
      case CONST_CARDS.BLUE:
        return CONST_CARDS_CSS_COLORS.BLUE;
      default:
        return "";
    }
  };

  const getContent = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="role-primary">
          {player ? player.name : "Click to join"}
        </div>
        <div className="role-secondary">as {getTeamName()} Cluegiver</div>
      </div>
    );
  };

  return (
    <div className="Cluegiver">
      <div
        className="Cluegiver-content"
        style={{
          position: "relative",
          background: getTeamColor(),
          cursor: lobbyState === CONST_LOBBY_STATE.MENU ? "pointer" : "initial",
          border: hasTurn ? "0.3rem solid rgba(255, 202, 0, 0.9)" : "0px"
        }}
        onClick={onClick}
      >
        {getContent()}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1rem",
            fontSize: ".7rem",
            color: "#fafafa",
            display: lastClue && lastClue.word ? "block" : "none"
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>Last clue:</span> <br />{" "}
          {lastClue && lastClue.word.toUpperCase()} (
          {lastClue && lastClue.count})
        </div>
      </div>
    </div>
  );
}
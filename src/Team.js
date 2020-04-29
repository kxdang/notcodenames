import React from "react";
import Person from "./Person";
import {
  CONST_CARDS_CSS_COLORS,
  CONST_CARDS,
  CONST_LOBBY_STATE
} from "./Constant";
import _ from "lodash";

export default function Team({ team, players, lobbyState, onClick, hasTurn }) {
  //teamData returns an array specific to color
  const getTeamColour = () => {
    switch (team) {
      case CONST_CARDS.RED:
        return CONST_CARDS_CSS_COLORS.RED;
      case CONST_CARDS.BLUE:
        return CONST_CARDS_CSS_COLORS.BLUE;
      case CONST_CARDS.NEUTRAL:
        return CONST_CARDS_CSS_COLORS.NEUTRAL;
      default:
        return "#fff";
    }
  };

  const teamSuffix = team => {
    const msg = {
      [CONST_CARDS.RED]: ["⚠️No Red Guessers!", "as Red Guessers"],
      [CONST_CARDS.BLUE]: ["⚠️ No Blue Guessers!", "as Blue Guessers"],
      [CONST_CARDS.NEUTRAL]: ["No Spectators", "as Spectators"]
    };

    return (
      <>
        {lobbyState === CONST_LOBBY_STATE.LIVE && players.length === 0
          ? msg[team][0]
          : msg[team][1]}
      </>
    );
  };

  const clickToJoinPrompt = lobbyState === CONST_LOBBY_STATE.MENU && (
    <span className={players.length === 0 ? "role-primary" : "role-secondary"}>
      Click to join
    </span>
  );

  const n = 5;
  const takePlayers = _.take(players, n);
  const hasMoreThanNPlayers = players.length > n;

  return (
    <div
      className="Team"
      style={{
        background: getTeamColour(),
        cursor: lobbyState === CONST_LOBBY_STATE.MENU && "pointer",
        border: hasTurn ? ".3rem solid #ffca00" : ""
      }}
      onClick={onClick}
    >
      {/* <div className="Team-title">{teamTitle(team)}</div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        {clickToJoinPrompt}

        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "2px",
            color: "#fff"
          }}
        >
          {takePlayers.map(player => (
            <Person key={player.id} name={player.name} />
          ))}
          {hasMoreThanNPlayers && " and more..."}
        </span>
        <span className="role-secondary">{teamSuffix(team)}</span>
      </div>
    </div>
  );
}

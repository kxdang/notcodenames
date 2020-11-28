import React, { useState } from "react";
import { userContext } from "./userContext";
import {
  CONST_CARDS_CSS_COLORS,
  CONST_CARDS,
  CONST_LOBBY_STATE
} from "./Constant";

import { database, auth } from "./firebase";

export default function Cluegiver({
  team,
  player,
  lobby,
  onClick,
  hasTurn,
  lastClue,
  hintToggle,
}) {
  const [showHint, setShowHint] = useState(true)

  const uid = auth && auth.currentUser && auth.currentUser.uid;


  const isRedComponentAndRedCluegiver = team === CONST_CARDS.RED && lobby.cluegiverRed === uid
  const isBlueComponentAndBlueCluegiver = team === CONST_CARDS.BLUE && lobby.cluegiverBlue === uid

  const canToggleHint = isRedComponentAndRedCluegiver || isBlueComponentAndBlueCluegiver

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
          {player ? player.name.substring(0, 12) : "Click to join"}
        </div>
        <div className="role-secondary">as {getTeamName()} Cluegiver</div>
      </div>
    );
  };

  const eyes = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  const eyesOff = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>

  return (
    <div className="Cluegiver">
      <div
        className="Cluegiver-content"
        style={{
          position: "relative",
          background: getTeamColor(),
          cursor: lobby.state === CONST_LOBBY_STATE.MENU ? "pointer" : "initial",
          border: hasTurn ? "0.3rem solid rgba(255, 202, 0, 0.9)" : "0px"
        }}
        onClick={onClick}
      >
        {getContent()}

        {canToggleHint && lobby.state === CONST_LOBBY_STATE.LIVE && <div style={{ fontSize: "1rem", cursor: "pointer", padding: "0.8rem" }} onClick={() => { hintToggle(); setShowHint(!showHint) }}>{showHint ?
          eyes : eyesOff
        }</div>}

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

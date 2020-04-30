import React, { useContext } from "react";
import Cluegiver from "./Cluegiver";
import { CONST_CARDS, CONST_GAME_STATE, CONST_LOBBY_STATE } from "./Constant";
import { userContext } from "./userContext";

import _ from "lodash";

import { database, auth } from "./firebase";

export default function CluegiverContainer() {
  const lobby = useContext(userContext);

  const cluegiverRed =
    lobby.players && lobby.cluegiverRed
      ? lobby.players[lobby.cluegiverRed]
      : null;
  const cluegiverBlue =
    lobby.players && lobby.cluegiverBlue
      ? lobby.players[lobby.cluegiverBlue]
      : null;

  const cluegiverBlueTurn =
    lobby.gameState % 4 === CONST_GAME_STATE.CLUEGIVER_BLUE;
  const cluegiverRedTurn =
    lobby.gameState % 4 === CONST_GAME_STATE.CLUEGIVER_RED;

  const blueClues = _.toArray(lobby.blueClues);
  const redClues = _.toArray(lobby.redClues);
  const lastBlueClue = lobby.blueClues && _.last(blueClues);
  const lastRedClue = lobby.redClues && _.last(redClues);

  const getTeamId = team => {
    switch (team) {
      case CONST_CARDS.RED:
        return "cluegiverRed";
      case CONST_CARDS.BLUE:
        return "cluegiverBlue";
      default:
        return "";
    }
  };

  const joinTeam = team => {
    if (lobby.state !== CONST_LOBBY_STATE.MENU) return;
    if (!lobby.id) return;

    // if user is already a spymaster, remove itself
    if (team === CONST_CARDS.RED) {
      if (lobby.cluegiverBlue === auth.currentUser.uid) {
        database
          .ref("lobby")
          .child(lobby.id)
          .child(getTeamId(CONST_CARDS.BLUE))
          .remove();
      }
    } else if (team === CONST_CARDS.BLUE) {
      if (lobby.cluegiverRed === auth.currentUser.uid) {
        database
          .ref("lobby")
          .child(lobby.id)
          .child(getTeamId(CONST_CARDS.RED))
          .remove();
      }
    }

    // remove self from teams
    database
      .ref("lobby")
      .child(lobby.id)
      .child("teams")
      .child(auth.currentUser.uid)
      .remove();

    // add self as spymaster
    database
      .ref("lobby")
      .child(lobby.id)
      .child(getTeamId(team))
      .set(auth.currentUser.uid);
  };

  return (
    <div className="Cluegiver-container">
      <Cluegiver
        team={CONST_CARDS.BLUE}
        player={cluegiverBlue}
        lobbyId={lobby.id}
        lobbyState={lobby.state}
        onClick={() => joinTeam(CONST_CARDS.BLUE)}
        hasTurn={cluegiverBlueTurn}
        lastClue={lastBlueClue}
      />
      <Cluegiver
        team={CONST_CARDS.RED}
        player={cluegiverRed}
        lobbyId={lobby.id}
        lobbyState={lobby.state}
        onClick={() => joinTeam(CONST_CARDS.RED)}
        hasTurn={cluegiverRedTurn}
        lastClue={lastRedClue}
      />
    </div>
  );
}

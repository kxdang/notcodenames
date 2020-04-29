import React, { useContext } from "react";
import Spymaster from "./Spymaster";
import { CONST_CARDS, CONST_GAME_STATE, CONST_LOBBY_STATE } from "./Constant";
import { userContext } from "./userContext";

import _ from "lodash";

import { database, auth } from "./firebase";

export default function SpymasterContainer() {
  const lobby = useContext(userContext);

  const spymasterRed =
    lobby.players && lobby.spymasterRed
      ? lobby.players[lobby.spymasterRed]
      : null;
  const spymasterBlue =
    lobby.players && lobby.spymasterBlue
      ? lobby.players[lobby.spymasterBlue]
      : null;

  const spymasterBlueTurn =
    lobby.gameState % 4 === CONST_GAME_STATE.SPYMASTER_BLUE;
  const spymasterRedTurn =
    lobby.gameState % 4 === CONST_GAME_STATE.SPYMASTER_RED;

  const blueClues = _.toArray(lobby.blueClues);
  const redClues = _.toArray(lobby.redClues);
  const lastBlueClue = lobby.blueClues && _.last(blueClues);
  const lastRedClue = lobby.redClues && _.last(redClues);

  const getTeamId = team => {
    switch (team) {
      case CONST_CARDS.RED:
        return "spymasterRed";
      case CONST_CARDS.BLUE:
        return "spymasterBlue";
      default:
        return "";
    }
  };

  const joinTeam = team => {
    if (lobby.state !== CONST_LOBBY_STATE.MENU) return;
    if (!lobby.id) return;

    // if user is already a spymaster, remove itself
    if (team === CONST_CARDS.RED) {
      if (lobby.spymasterBlue === auth.currentUser.uid) {
        database
          .ref("lobby")
          .child(lobby.id)
          .child(getTeamId(CONST_CARDS.BLUE))
          .remove();
      }
    } else if (team === CONST_CARDS.BLUE) {
      if (lobby.spymasterRed === auth.currentUser.uid) {
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
    <div className="Spymaster-container">
      <Spymaster
        team={CONST_CARDS.BLUE}
        player={spymasterBlue}
        lobbyId={lobby.id}
        lobbyState={lobby.state}
        onClick={() => joinTeam(CONST_CARDS.BLUE)}
        hasTurn={spymasterBlueTurn}
        lastClue={lastBlueClue}
      />
      <Spymaster
        team={CONST_CARDS.RED}
        player={spymasterRed}
        lobbyId={lobby.id}
        lobbyState={lobby.state}
        onClick={() => joinTeam(CONST_CARDS.RED)}
        hasTurn={spymasterRedTurn}
        lastClue={lastRedClue}
      />
    </div>
  );
}

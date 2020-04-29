import _ from "lodash";
import React, { useContext } from "react";
import Team from "./Team";
import { userContext } from "./userContext";
import { CONST_CARDS, CONST_GAME_STATE, CONST_LOBBY_STATE } from "./Constant";
import { database, auth } from "./firebase";

export default function TeamContainer({ props }) {
  const lobby = useContext(userContext);

  const playerArray = [];
  _.forEach(lobby.players, (value, key) => {
    playerArray.push({ id: key, name: value.name });
  });
  // [{ id: key, name: value.name}, { id: key, name: value.name }, { id: key, name: value.name }]

  const teamRed = playerArray.filter(
    player => lobby.teams && lobby.teams[player.id] === CONST_CARDS.RED
  );

  const teamBlue = playerArray.filter(
    player => lobby.teams && lobby.teams[player.id] === CONST_CARDS.BLUE
  );

  const teamNeutral = playerArray.filter(player => {

    if (lobby.teams === undefined) {
      if (player.id === lobby.cluegiverBlue) {
        return false;
      }

      if (player.id === lobby.cluegiverRed) {
        return false;
      }

      return true; //push to neutral team
    }

    if (lobby.teams[player.id] === CONST_CARDS.NEUTRAL) {
      return true;
    }

    if (lobby.cluegiverBlue === player.id) {
      return false;
    }

    //check if player is in clueGiver spot, I do not want them in teamNeutral,return false
    if (lobby.cluegiverRed === player.id) {
      return false;
    }

    //check if they are NOT in a team
    if (lobby.teams[player.id] === undefined) {
      return true;
    }

    return false;
  });

  const teamBlueTurn = lobby.gameState % 4 === CONST_GAME_STATE.PLAYER_BLUE;
  const teamRedTurn = lobby.gameState % 4 === CONST_GAME_STATE.PLAYER_RED;

  const joinTeam = team => {
    if (lobby.state !== CONST_LOBBY_STATE.MENU) return;

    if (lobby.cluegiverBlue === auth.currentUser.uid) {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("cluegiverBlue")
        .remove();
    }

    if (lobby.cluegiverRed === auth.currentUser.uid) {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("cluegiverRed")
        .remove();
    }

    if (team) {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("teams")
        .child(auth.currentUser.uid)
        .set(team);
    } else {
      database
        .ref("lobby")
        .child(lobby.id)
        .child("teams")
        .child(auth.currentUser.uid)
        .remove();
    }
  };

  return (
    <div className="Team-container">
      <Team
        team={CONST_CARDS.BLUE}
        players={teamBlue}
        lobbyState={lobby.state}
        lobbyId={lobby.id}
        onClick={() => joinTeam(CONST_CARDS.BLUE)}
        hasTurn={teamBlueTurn}
      />
      <Team
        team={CONST_CARDS.RED}
        players={teamRed}
        lobbyState={lobby.state}
        lobbyId={lobby.id}
        onClick={() => joinTeam(CONST_CARDS.RED)}
        hasTurn={teamRedTurn}
      />
      <Team
        team={CONST_CARDS.NEUTRAL}
        players={teamNeutral}
        lobbyState={lobby.state}
        lobbyId={lobby.id}
        onClick={() => joinTeam()}
      />
    </div>
  );
}

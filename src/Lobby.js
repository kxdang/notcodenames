import React, { useState, useEffect } from "react";
import { userContext } from "./userContext";
import SpymasterContainer from "./SpymasterContainer";
import TeamContainer from "./TeamContainer";
import StartScreen from "./StartScreen";
import Board from "./Board";
import SettingsModal from "./SettingsModal";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import Words from "./Words";

import { database, auth } from "./firebase";
import { CONST_LOBBY_STATE } from "./Constant";

const Lobby = () => {
  const history = useHistory();
  const [name, setName] = useState(localStorage.getItem("name"));
  const [lobby, setLobby] = useState({});
  const [lobbyId] = useState(
    history.location.pathname
      .substring(1)
      .split("/")[0]
      .split("#")[0]
      .split("?")[0]
      .toLowerCase()
  );
  const [uid, setUid] = useState(null);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUid(user.uid)
    }
  })

  useEffect(() => {
    // Fetch lobby data
    database
      .ref("lobby")
      .child(lobbyId)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          setLobby(Object.assign(snapshot.val(), { id: snapshot.key }));
        } else {
          database
            .ref("lobby")
            .child(lobbyId)
            .set({
              state: CONST_LOBBY_STATE.MENU,
              created: firebase.database.ServerValue.TIMESTAMP
            });
        }
      });

    // Dispose
    return () => {
      database
        .ref("lobby")
        .child(lobbyId)
        .off();
    };
    // eslint-disable-next-line
  }, [])

  const askForNameIfNeeded = () => {
    return new Promise((resolve) => {
      if (!name) {
        // Wait one second so that other UI (lobby, board, teams) can render before we show our blocking prompt
        setTimeout(() => {
          let newName = prompt("What is your name?", "Player");
          if (!newName) {
            newName = _.sample(Words);
          }

          newName = newName.split(" ")[0]
            .trim();

          setName(newName);
          localStorage.setItem("name", newName);

          resolve(newName);
        }, 1000);
      } else {
        resolve(name);
      }
    });
  }

  // Join lobby as player
  useEffect(() => {
    if (!uid) return;
    console.log("asdf")
    askForNameIfNeeded().then(newName => {
      // Set Presence
      database
        .ref(".info/connected")
        .on("value", snapshot => {
          if (snapshot.val() === false) {
            return;
          }

          if (lobbyId && uid) {
            const playerRef = database
              .ref("lobby")
              .child(lobbyId)
              .child("players")
              .child(uid);

            playerRef
              .onDisconnect()
              .remove()
              .then(() => {
                playerRef.set({ name: newName });
              })
          }
        });
    });

    // Dispose
    return () => {
      database
        .ref("lobby")
        .child(lobbyId)
        .child("players")
        .child(uid)
        .remove();

      database
        .ref(".info/connected")
        .off()
    };
    // eslint-disable-next-line
  }, [uid]);

  return (
    <div style={{ position: "relative" }}>
      <div className="Lobby">
        <div className="Board-settings">
          <button className="btn-small" onClick={() => window.location.href = '/'}>Home</button>
          <button
            className="btn-small"
            onClick={() => (document.getElementById("modal-1").checked = true)}
          >
            Settings
          </button>
        </div>

        <userContext.Provider value={lobby}>
          <SpymasterContainer />
          {lobby.state === 0 ? (
            <StartScreen lobbyId={lobbyId} />
          ) : (
              <Board size={5} />
            )}
          <TeamContainer />
        </userContext.Provider>
      </div>
      <SettingsModal lobbyId={lobbyId} uid={uid} lobby={lobby} />
    </div>
  );
};

export default Lobby;

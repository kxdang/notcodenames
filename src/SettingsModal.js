import React, { useState, useEffect } from "react";
import { database } from "./firebase";

export default function SettingsModal({ lobbyId, uid }) {
  const currentName = localStorage.getItem("name");
  const [name, setName] = useState(currentName);

  useEffect(() => {
    document.getElementById("modal-1").addEventListener("change", () => {
      setName(localStorage.getItem("name"));
    });
  }, []);

  const handleClick = () => {
    if (name && lobbyId && uid) {
      localStorage.setItem("name", name);

      database
        .ref("lobby")
        .child(lobbyId)
        .child("players")
        .child(uid)
        .set({
          name: name
        });
    }

    document.getElementById("modal-1").checked = false;
  };

  return (
    <div style={{ position: "absolute" }}>
      <div className="row flex-spaces child-borders" />
      <input className="modal-state" id="modal-1" type="checkbox" />
      <div
        className="modal"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <label className="modal-bg" htmlFor="modal-1" />
        <div
          className="modal-body"
          style={{
            transform: "none",
            position: "relative",
            left: "0",
            top: "0"
          }}
        >
          <label className="btn-close" htmlFor="modal-1">
            X
          </label>
          <h4 className="modal-title">Settings</h4>
          <h5 className="modal-subtitle">Configure your settings below!</h5>
          <div className="form-group">
            <label htmlFor="paperInputs1" />
            <h5>Change Name:</h5>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name Change"
              id="paperInputs1"
            />
          </div>

          <button className="btn-save" onClick={handleClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function HowToPlayModal() {



    const handleClick = () => {
        document.getElementById("modal-2").checked = false;
    };

    return (
        <div style={{ position: "absolute" }}>
            <div className="row flex-spaces child-borders" />
            <input className="modal-state" id="modal-2" type="checkbox" />
            <div
                className="modal"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <label className="modal-bg" htmlFor="modal-2" />
                <div
                    className="modal-body"
                    style={{
                        transform: "none",
                        position: "relative",
                        left: "0",
                        top: "0"
                    }}
                >
                    <label className="btn-close" htmlFor="modal-2">
                        X
                     </label>
                    <h4 className="modal-title">how to play</h4>
                    <h5 className="modal-subtitle" style={{ color: "#4d3e3e", fontWeight: "bold" }}>Cluegivers:</h5>
                    <p>Give a one word clue and the number of cards for your team to guess.<br></br>Try connecting multiple words with your clue!</p>


                    <h5 className="modal-subtitle" style={{ color: "#4d3e3e", fontWeight: "bold" }}>Guessers:</h5>
                    <p>Select the cards you think your cluegiver wanted you to guess<br></br> Discuss amongst your team!</p>


                    <button className="btn-save" onClick={handleClick}>
                        Close
          </button>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { CONST_CARDS } from "./Constant";

import { auth } from "./firebase";

import tippy from "tippy.js";

import _ from "lodash";

export default function Card({
  cardName,
  cardState,
  playersHovering,
  onMouseEnter,
  onMouseLeave,
  handleClick,
  isSpymaster,
  guesser
}) {
  const [tippyInstance, setTippyInstance] = useState(null);
  const [hasGuess, setHasGuess] = useState(null);
  const [showSkull, setShowSkull] = useState(false);

  useEffect(() => {
    setTippyInstance(
      tippy(`#${cardName}`, {
        trigger: "manual",
        showOnCreate: false,
        delay: 0,
        duration: 0,
        hideOnClick: false,
        animation: false,
        theme: "light"
      })
    );

    if (isSpymaster && cardState["actual"] === CONST_CARDS.BLACK) {
      setShowSkull(true);
    }
  }, []);

  useEffect(() => {
    if (!hasGuess && playersHovering && playersHovering.length > 0) {
      // console.log("hello", cardName);
      tippyInstance &&
        tippyInstance[0] &&
        tippyInstance[0].setContent(playersHovering.join(", "));
      tippyInstance && tippyInstance[0] && tippyInstance[0].show();
    } else {
      // console.log("bye", cardName);
      tippyInstance && tippyInstance[0] && tippyInstance[0].hide();
    }
  }, [playersHovering]);

  useEffect(() => {
    if (cardState && cardState["guess"] !== undefined) {
      setHasGuess(true);
      tippyInstance && tippyInstance[0] && tippyInstance[0].hide();
    }
  }, [cardState]);

  const getColorForGuess = () => {
    if (!isSpymaster && !cardState["guess"]) return "#dbdbdb";

    switch (cardState["actual"]) {
      case CONST_CARDS.NEUTRAL:
        return "var(--green)";
      case CONST_CARDS.RED:
        return "var(--red)";
      case CONST_CARDS.BLUE:
        return "var(--blue)";
      case CONST_CARDS.BLACK:
        return "var(--black)";
      default:
        return "#dbdbdb";
    }
  };

  const onClick = e => {
    const uid = auth.currentUser.uid;
    handleClick(cardName, uid);
  };

  const isGuessCorrect = cardState["guess"] === cardState["actual"];

  if (cardState["guess"] !== undefined) {
    return (
      <div
        className="Card-autohide"
        style={{
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: getColorForGuess(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <div
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "rgba(255, 255, 255, 1)",
            fontSize: ".8rem",
            padding: "1rem"
          }}
        >
          <span style={{ color: "#333", fontSize: ".6rem" }}>
            {isGuessCorrect ? "Correct" : "Incorrect"} guess by
          </span>
          <br /> {cardState["guessBy"]}
        </div>
      </div>
    );
  } else {
    return (
      <div
        id={cardName}
        style={{
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isSpymaster ? "#dbdbdb" : getColorForGuess(),
          overflow: "hidden",
          cursor: isSpymaster ? "initial" : "pointer",
          border:
            playersHovering && playersHovering.length > 0
              ? "2px solid #777"
              : "2px solid transparent"
        }}
        onMouseEnter={() => onMouseEnter(cardName)}
        onMouseLeave={() => onMouseLeave(cardName)}
        onClick={onClick}
      >
        <div style={{ color: getColorForGuess() }}>▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒</div>
        <div>
          {showSkull && "☠️"}
          <span className="Card-text">{cardName}</span>
          {showSkull && "☠️"}
        </div>
        <div style={{ color: getColorForGuess() }}>▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒</div>
      </div>
    );
  }
}

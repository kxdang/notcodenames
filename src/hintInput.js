import React from "react";

function hintInput() {
  return (
    <form>
      <label>Word:</label>
      <input name="word" type="text" />
      <label>Number of hints</label>
      <input name="numOfHints" type="number" />
    </form>
  );
}

export default hintInput;

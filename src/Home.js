import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Home = () => {
  const [joinCode, setJoinCode] = useState("");

  const history = useHistory();

  const generateId = length => {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const newGame = () => {
    history.push(`/${generateId(4)}`);
  };

  const joinGame = e => {
    e.preventDefault();
    if (joinCode.length > 0) {
      history.push(`/${joinCode}`);
    }
  };

  return (
    <div>
      <section className="Home">
        <div className="Home-menu">
          <h1
            style={{
              marginTop: "-4rem",
              fontSize: "4rem",
              background: "#fafafa",
              textAlign: "center",
              margin: "0 1rem"
            }}
          >
            Not Codenames
          </h1>
          <h3
            style={{
              margin: "0.5rem 1rem",
              background: "#fafafa",
              textAlign: "center"
            }}
          >
            An online multiplayer boardgame
          </h3>
          <div
            style={{
              margin: "2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="Home-join-input">
              <form onSubmit={joinGame}>
                <div className="row">
                  <input
                    style={{ background: "#fff" }}
                    type="text"
                    placeholder="Enter join code (a5kd)"
                    onChange={e => setJoinCode(e.target.value.trim())}
                  />
                  <button type="submit" className="btn-secondary">
                    Join
                  </button>
                </div>
              </form>
            </div>
            <div className="row">or</div>
            <button className="btn-success" onClick={newGame}>
              Start a new game
            </button>
          </div>
        </div>
        <div className="Home-bg-left" />
        <div className="Home-bg-right" />
      </section>
      <section className="Home-rules">
        <h2>How to play</h2>
        {/*<ol className="Home-rules-list">
          <li>
            Cluegivers give a one word clue to help their team select hidden
            words and specify the number of related cards.
          </li>
          <li>The Cluegiver's team will try to guess and find their word.</li>
          <li>First team to find all their words win!</li>
        </ol> */}

        <div className="container">
          Two teams race to find all their respective cards (🟥 or 🟦).
          <br />
          <br />
          Each team has one Cluegiver and Guessers.
          <br />
          <br />
          Each round, the Cluegivers will give <strong>one word</strong> and
          <br />
          the <strong> # of cards</strong> that the word relates to. <br />
          <br />
          Guessers will work together to use their clues to find their cards.
          <br />
          <br />
          First team to find all their cards win! 🎉
        </div>

        <h3>Four types of cards on the board</h3>
        <div className="container">
          🟥 cards belong to the red team. <br />
          <br />
          🟦 cards belong to the blue team.
          <br />
          <br />
          🟫 cards are neutral, if you reveal this card then your turn ends
          immediately. <br />
          <br />
          The ⬛ card will cause your team to lose immediately and end the game.
        </div>

        {/* <div className="container">
          The Red and Blue team will compete to find all their cards on the
          board.
          <br />
          <br />
          Guessers will find their respective cards (red or blue) using clues
          provided by the Cluegiver.
          <br />
          <br />
          Each clue will consist of <strong>one word</strong> and the{" "}
          <strong>number of cards</strong> that word corresponds.
          <br />
          <br />
          Make sure your clue does not help the other team out in finding their
          cards. And also make sure your team does not find the ☠️
          <strong>explosive card</strong>☠️ which will end the game immediately.
        </div> */}
        <div />
      </section>
      <section className="Home-about">
        <h2>About Not Codenames</h2>
        <div>
          <i>Not Codenames</i> is like <i>Codenames</i>but not.
        </div>
      </section>
      <section className="Home-feedback">
        <h2>Enjoy Playing or have a Feature request?</h2>
        <a
          href="https://www.buymeacoffee.com/notcodenames"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/default-green.png"
            alt="Buy Me A Coffee"
            style={{ height: "51px", width: "217px" }}
          />
        </a>
        <h4>Created by: Adrian and Kien</h4>
      </section>
    </div>
  );
};

export default Home;

import React from "react";

import Navbar from "./Navbar";

import Home from "./Home";
import About from "./About";

import Lobby from "./Lobby";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Router>
        {/* <Navbar /> */}

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/:id">
            <Lobby />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

import React from "react";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-brand">
        <h4>
          <a href="/">Not Codenames</a>
        </h4>
      </div>
      <div className="collapsible">
        <input id="collapsible2" type="checkbox" name="collapsible2" />
        <button>
          <label htmlFor="collapsible2">
            <div className="bar1" />
            <div className="bar2" />
            <div className="bar3" />
          </label>
        </button>
        <div className="collapsible-body">
          <ul className="inline">
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

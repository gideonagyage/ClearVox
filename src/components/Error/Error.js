import React from "react";
import "./Error.css";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>Oops! Page not found</h2>
        <p>
          The page you are looking is unavailable.
          <br />
          <Link to="/">
            <button type="button" className="btn-home">
              Go Home
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Error;

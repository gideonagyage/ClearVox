import React from "react";
import "./Loading.css";


const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner-grow" role="status">
        <span className="visually-hidden" >Loading...</span>
      </div>
    </div>
  );
};

export default Loading;

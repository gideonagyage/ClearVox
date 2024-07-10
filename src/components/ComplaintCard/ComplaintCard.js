import React, { useContext } from "react";
import "./ComplaintCard.css";
import { AuthContext } from "../Auth/AuthProvider";
import { useLocation } from 'react-router-dom'; // Import useLocation

const ComplaintCard = ({ complaint, onUpdate, onDelete }) => {

  // Get the user from the context
  const { user } = useContext(AuthContext);
  const userEmail = user.email;

  // Get the current route
  const location = useLocation();

  return (
    <div className="card-big my-3 bg-light">
      <div className="card-body text-center">
        <h4 className="card-title">{complaint.title}</h4>
        <p className="card-text">{complaint.description}</p>
        <p className="card-text">
          <small className="text-muted">
            Status: {complaint.status} | Date:{" "}
            {new Date(complaint.dateCreated).toLocaleDateString()}
          </small>
          <br/> <br/>
          
          <small className="text-muted">
            By: {complaint.fullName}
          </small>
        </p>
        <br/>
        {/* Conditionally render buttons based on userEmail or route */}
        {(userEmail === "gideonagyage@gmail.com" || location.pathname === '/db-customer') && (
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-w btn-primary mr-2"
              onClick={() => onUpdate(complaint)}
            >
              Edit
            </button>
            <button
              className="btn btn-w btn-danger"
              onClick={() => onDelete(complaint.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;

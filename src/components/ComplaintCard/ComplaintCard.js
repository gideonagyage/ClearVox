import React from "react";
import "./ComplaintCard.css";

const ComplaintCard = ({ complaint, onUpdate, onDelete }) => {
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
        </p>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary mr-2"
            onClick={() => onUpdate(complaint)}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(complaint.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;

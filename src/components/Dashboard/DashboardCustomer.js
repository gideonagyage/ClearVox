import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import "./Dashboard.css";

const DashboardCustomer = () => {

console.log("Component: CustomerDashboard");

const [userComplaints, setUserComplaints] = useState([]);

// Get the user from the context
const { user } = useContext(AuthContext);


return (
  <div className="dashboard-container full-height">
    <div className="card text-center m-4 p-0">
      <h1> Welcome <span className="text-center text-lowercase"> {user.email} </span> </h1>
    </div>

    <div className="text-center m-4">
      
      {/* Complaints Section */}
      <div className="complaints-section">
        <div className="card p-4">
          <h5 className="card-heading">Submitted Complaints</h5>
          {userComplaints.length > 0 ? (
            <ul>
              {userComplaints.map((complaint) => (
                <li key={complaint.id}>
                  <h3>{complaint.title}</h3>
                  <p>{complaint.description}</p>
                  {/* Add other relevant complaint information */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No complaints submitted yet.</p>
          )}
        </div>
      </div>
    </div>

    {/* Other relevant sections*/}
  </div>
);
};


export default DashboardCustomer;

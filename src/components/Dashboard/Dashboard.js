import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [userComplaints, setUserComplaints] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    // Fetch user complaints from API or database
    fetch("/api/user/complaints")
      .then((res) => res.json())
      .then((data) => setUserComplaints(data))
      .catch((error) =>
        console.error("Error fetching user complaints:", error)
      );

    // Fetch user profile from API or database
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => setUserProfile(data))
      .catch((error) => console.error("Error fetching user profile:", error));
  }, []);

  return (
    <div className="dashboard-container">
      <br />

      <div className="dashboard-content">


        <div className="card mb-4">
          <div className="card-header text-start">Profile</div>
          <div className="text-center m-1">
            <img
              // src={userProfile.profilePicture}
              src="./img/illus/avatar_female.svg"
              alt="Avatar"
              className="rounded-circle"
              id="profilePicture"
              width="100"
              height="100"
            />
            </div>
          <div className="card-body text-start">
            <p className="card-title text-center m-3" id="patientName">
              {userProfile.name}
            </p>
            <p className="card-text mb-2">
              Date of Birth: <br />
              <span id="dateOfBirth">{userProfile.dateOfBirth}</span>
            </p>
            <p className="card-text mb-2">
              Gender: <br />
              <span id="gender">{userProfile.gender}</span>
            </p>
            <p className="card-text mb-2">
              Phone Number: <br />
              <span id="phoneNumber">{userProfile.phoneNumber}</span>
            </p>
            <p className="card-text mb-2">
              Emergency Contact: <br />
              <span id="emergencyContact">{userProfile.emergencyContact}</span>
            </p>
            <p className="card-text mb-2">
              Insurance Type: <br />
              <span id="insuranceType">{userProfile.insuranceType}</span>
            </p>
          </div>
        </div>



        <div className="card user-info">
          <h5 className="card-header">User Profile</h5>
          <p>Name: {userProfile.name}</p>
          <p>Email: {userProfile.email}</p>
          {/* Add other relevant profile information */}
        </div>

        <div className="card complaints-section">
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

      {/* Other relevant sections*/}
    </div>
  );
};

export default Dashboard;

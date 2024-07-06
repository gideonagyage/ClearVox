import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { useFirebase } from '../Auth/UseFirebase';

const DashboardCustomer = () => {
  const [userComplaints, setUserComplaints] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  // Get the user from the context
  const { user } = useContext(AuthContext);
  const { db } = useFirebase(); // Get the Firestore database instance

  useEffect(() => {
    // Fetch user complaints from Firestore
    const fetchUserComplaints = async () => {
      try {
        const userRef = db.collection("users").doc(user.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists()) {
          const complaints = userDoc.data().complaints || [];
          setUserComplaints(complaints);
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user complaints:", error);
      }
    };

    if (user) {
      fetchUserComplaints();
    }
  }, [user, db]);

  useEffect(() => {
    // Fetch user profile from Firestore
    const fetchUserProfile = async () => {
      try {
        const userRef = db.collection("users").doc(user.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, db]);

  return (
    <div className="dashboard-container">
      <br />

      <div className="row text-center">
        {/* Profile Section */}
        <div className="col-md-4 col-12 profile-section">
          <div className="card">
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
                <span id="emergencyContact">
                  {userProfile.emergencyContact}
                </span>
              </p>
              <p className="card-text mb-2">
                Insurance Type: <br />
                <span id="insuranceType">{userProfile.insuranceType}</span>
              </p>
            </div>
          </div>
        </div>
        {/* Complaints Section */}
        <div className="col-md-8 col-12 complaints-section">
          <div className="card">
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

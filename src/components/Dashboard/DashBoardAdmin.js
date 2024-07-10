import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {

console.log("Component: AdminDashboard");

const [userComplaints, setUserComplaints] = useState([]);
const navigate = useNavigate(); // Initialize useNavigate

// Get the user from the context
const { user } = useContext(AuthContext);
const userEmail = user.email;

// Function to fetch complaints from localStorage
const fetchComplaints = () => {
  const storedComplaints = localStorage.getItem("complaints");
  if (storedComplaints) {
    setUserComplaints(JSON.parse(storedComplaints));
  }
};

// Function to save complaints to localStorage
const saveComplaints = (complaints) => {
  localStorage.setItem("complaints", JSON.stringify(complaints));
};

// Load complaints on component mount
useEffect(() => {
  fetchComplaints();
}, []);

// Function to add a new complaint
const addComplaint = (newComplaint) => {
  // Generate a unique ID for the new complaint
  const newId = Date.now().toString();
  const updatedComplaints = [...userComplaints, { ...newComplaint, id: newId }];
  setUserComplaints(updatedComplaints);
  saveComplaints(updatedComplaints);
};

// Function to update a complaint
const updateComplaint = (updatedComplaint) => {
  // Navigate to the ComplaintForm component with the complaint ID
  navigate(`/complaint-form-update/${updatedComplaint.id}`); 
};

// Function to delete a complaint
const deleteComplaint = (complaintId) => {
  const updatedComplaints = userComplaints.filter(
    (complaint) => complaint.id !== complaintId
  );
  setUserComplaints(updatedComplaints);
  saveComplaints(updatedComplaints);
};

return (
  <div className="dashboard-container full-height">
    <div className="card m-4 p-2">
      <h3 className="m-3 text-blue"> Welcome, Gideon Agyage | Admin </h3>
    </div>

    <div className="text-center m-4">
      {/* Complaints Section */}
      <div className="complaints-section">
        <div className="card p-3 bg-mid-gray">
          <h5 className="card-heading text-center">Submitted Complaints</h5>
          {userComplaints.length > 0 ? (
            <div className="text-center">
            {userComplaints.map((complaint) => (
              <div key={complaint.id} className="text-center">
                <ComplaintCard
                  complaint={complaint}
                  onUpdate={updateComplaint}
                  onDelete={deleteComplaint}
                />
              </div>
            ))}
          </div>
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

export default DashboardAdmin;

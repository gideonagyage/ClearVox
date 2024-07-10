// DashboardSuperAdmin.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import "./Dashboard.css";

const DashboardSuperAdmin = () => {
  console.log("Component: SuperAdminDashboard");

  const [userComplaints, setUserComplaints] = useState([]);

  // Get the user from the context
  const { user } = useContext(AuthContext);

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
    const updatedComplaints = userComplaints.map((complaint) =>
      complaint.id === updatedComplaint.id ? updatedComplaint : complaint
    );
    setUserComplaints(updatedComplaints);
    saveComplaints(updatedComplaints);
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
        <h1 className="m-5"> Welcome, Gideon Agyage </h1>
      </div>

      <div className="text-center m-4">
        {/* Complaints Section */}
        <div className="complaints-section">
          <div className="card p-3 bg-mid-gray">
            <h5 className="card-heading">Submitted Complaints</h5>
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

export default DashboardSuperAdmin;

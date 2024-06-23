import React, { useState, useEffect } from "react";
import "./ComplaintList.css";
import axios from "axios";
import { Table } from "react-bootstrap";

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch complaints from the backend API
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("/api/complaints");
        setComplaints(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="container mt-2">
      <div className="form-title">
        <h2 className="text-center form-title-text">Complaints List</h2>
      </div>

      {complaints.length === 0 ? (
        <p className="text-center">No complaints found.</p>
      ) : (
        <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Category</th>
              <th>Urgency Level</th>
              <th>Date of Incident</th>
              <th>Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.fullName}</td>
                <td>{complaint.email}</td>
                <td>{complaint.contactNumber}</td>
                <td>{complaint.category}</td>
                <td>{complaint.urgencyLevel}</td>
                <td>{complaint.dateOfIncident}</td>
                <td>{complaint.status}</td>
                <td>{complaint.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;

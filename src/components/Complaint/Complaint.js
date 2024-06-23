import React, { useState, useEffect } from "react";
import "./Complaint.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

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

  const handleViewComplaint = (complaintId) => {
    navigate(`/complaints/${complaintId}`);
  };

  const handleEditComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowEditModal(true);
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      await axios.delete(`/api/complaints/${complaintId}`);
      setComplaints(complaints.filter((c) => c._id !== complaintId));
    } catch (error) {
      console.error(error);
    }
  };

  const validationSchema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    contactNumber: yup.string().required("Contact number is required"),
    category: yup.string().required("Category is required"),
    urgencyLevel: yup.string().required("Urgency level is required"),
    dateOfIncident: yup.date().required("Date of incident is required"),
  });

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`/api/complaints/${selectedComplaint._id}`, values);
      const updatedComplaints = complaints.map((c) =>
        c._id === selectedComplaint._id ? values : c
      );
      setComplaints(updatedComplaints);
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-2">
      <div className="form-title">
        <h2 className="text-center form-title-text">Complaints</h2>
      </div>

      {complaints.length === 0 ? (
        <p className="text-center">No complaints found.</p>
      ) : (
        <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Category</th>
              <th>Urgency Level</th>
              <th>Date of Incident</th>
              <th>Actions</th>
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
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewComplaint(complaint._id)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning mx-2"
                    onClick={() => handleEditComplaint(complaint)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteComplaint(complaint._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* Edit Complaint Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={selectedComplaint}
            validationSchema={validationSchema}
            onSubmit={handleEditSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name:</label>
                  <Field
                    type="text"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      touched.fullName && errors.fullName ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                {/* ... other form fields ... */}
                <Button type="submit" className="btn btn-primary">
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Complaint;

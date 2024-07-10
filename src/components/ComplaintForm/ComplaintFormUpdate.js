import React, { useState, useEffect } from "react";
import "./ComplaintForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Modal/Modal";


const ComplaintFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  category: Yup.string().required("Please select a category"),
  description: Yup.string().required("Description is required"),
  preferredContactMethod: Yup.string().required(
    "Please select a preferred contact method"
  ),
});

const ComplaintFormUpdate = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const history = useNavigate();
  const { complaintId } = useParams(); // Get the complaint ID from the URL

  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    contactNumber: "",
    category: "",
    description: "",
    preferredContactMethod: "",
  });

  useEffect(() => {
    // Fetch the complaint from localStorage based on the complaintId
    const storedComplaints = localStorage.getItem("complaints");
    if (storedComplaints) {
      const complaints = JSON.parse(storedComplaints);
      const foundComplaint = complaints.find((c) => c.id === complaintId);
      if (foundComplaint) {
        setInitialValues(foundComplaint);
      }
    }
  }, [complaintId]);

  const handleComplaintSubmit = (values, { resetForm }) => {
    // Update the complaint in localStorage
    const storedComplaints = localStorage.getItem("complaints");
    let complaints = [];
    if (storedComplaints) {
      complaints = JSON.parse(storedComplaints);
    }

    // Find the complaint to update
    const index = complaints.findIndex((c) => c.id === complaintId);
    if (index !== -1) {
      complaints[index] = { ...complaints[index], ...values };
      localStorage.setItem("complaints", JSON.stringify(complaints));

      console.log("Complaint updated:", complaints[index]);

      // Redirect to success page
      history.push("/success");

      // Show the modal for 3 seconds
      setModalContent(
        <div className="text-center my-3">
          <h1>Complaint Updated successfully.</h1>
        </div>
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 3000);
    } else {
      console.error("Complaint not found for update.");
    }
  };

  return (
    <div className="container mt-2 full-height">
      <div className="form-title">
        <h2 className="text-center form-title-text">Update Complaint</h2>
      </div>

      <Formik
        initialValues={initialValues} // Use the fetched initial values
        validationSchema={ComplaintFormSchema}
        onSubmit={handleComplaintSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <div className="row justify-content-center signing-form">
            <div className="col-md-7 col-lg-6">
              <div className="login-wrap p-0">
                <Form className="col-12 d-block m-0">
                  {/* Full name */}
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name:</label>
                    <Field
                      name="fullName"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <Field
                      name="contactNumber"
                      type="tel"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="contactNumber"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <Field name="category" as="select" className="form-control">
                      <option value="">Select category</option>
                      <option value="Service">Service</option>
                      <option value="Product">Product</option>
                      <option value="Staff Conduct">Staff Conduct</option>
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Description with textarea */}
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <Field
                      name="description"
                      as="textarea"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="form-group">
                    <label htmlFor="preferredContactMethod">
                      Preferred Contact Method:
                    </label>
                    <Field
                      name="preferredContactMethod"
                      as="select"
                      className="form-control"
                    >
                      <option value="">Please select</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </Field>
                    <ErrorMessage
                      name="preferredContactMethod"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  {/* Update and Reset Buttons */}
                  <div className="form-group mt-5 mb-5 text-end">
                    <button
                      type="submit"
                      className="btn-submit mx-4"
                      disabled={isSubmitting}
                    >
                      Update
                    </button>
                    <button type="reset" className="btn-reset">
                      Reset
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Formik>

      {/* Modal */}
      <Modal show={showModal} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default ComplaintFormUpdate;

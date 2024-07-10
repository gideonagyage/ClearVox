import React, { useState, useContext } from "react";
import "./ComplaintForm.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { AuthContext } from "../Auth/AuthProvider";

const ComplaintForm = () => {
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

  const [showModal, setShowModal] = useState(false); // Showing the Modal
  const [modalContent, setModalContent] = useState(""); // The contents of the Modal

  // Get the user from the context
  const { user } = useContext(AuthContext);
  const userEmail = user.email;

  const history = useNavigate();

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };

  const handleComplaintSubmit = (values, { resetForm }) => {
    // Generate a unique ID for the complaint
    const complaintId = Date.now().toString();

    // Create the complaint object
    const complaint = {
      id: complaintId,
      ...values,
      status: "Pending", // Set initial status to "Pending"
      dateCreated: new Date().toISOString(), // Get current date and time
      createdBy: userEmail,
    };

    // Store the complaint in localStorage
    const storedComplaints = localStorage.getItem("complaints");
    let complaints = [];
    if (storedComplaints) {
      complaints = JSON.parse(storedComplaints);
    }
    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    console.log("Complaint submitted:", complaint); // Log the submitted complaint

    // Redirect to success page
    history.push("/success");

    // Show the modal for 3 seconds
    setModalContent(
      <div className="text-center my-3">
        <h1>Complaint Submitted successfully.</h1>
      </div>
    );
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      resetForm(); // Reset the form after 3 seconds
    }, 3000); // Close the modal after 3 seconds
  };

  return (
    <div className="container mt-2 full-height">
      <div className="form-title">
        <h2 className="text-center form-title-text">Complaint Form</h2>
      </div>

      <Formik
        initialValues={{
          fullName: "",
          contactNumber: "",
          category: "",
          description: "",
          preferredContactMethod: "",
        }}
        validationSchema={ComplaintFormSchema}
        onSubmit={handleComplaintSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          // Form component from Formik to encapsulate form fields

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

                  {/* Submit and Reset Buttons */}
                  <div className="form-group mt-5 mb-5 text-end">
                    <button
                      type="submit"
                      className="btn-submit mx-4"
                      disabled={isSubmitting}
                    >
                      Submit
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

export default ComplaintForm;

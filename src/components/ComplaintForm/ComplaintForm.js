import React from "react";
import "./ComplaintForm.css";
// Importing Formik components and Yup for form handling and validation
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// useHistory hook from react-router-dom for navigation
import { useNavigate } from "react-router-dom";

// Validation schema for the form fields using Yup
const ComplaintFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  category: Yup.string().required("Please select a category"),
  urgencyLevel: Yup.string().required("Please select the urgency level"),
  description: Yup.string().required("Description is required"),
  dateOfIncident: Yup.date().required("Date of incident is required"),
  preferredContactMethod: Yup.string().required(
    "Please select a preferred contact method"
  ),
});

// ComplaintForm component definition
const ComplaintForm = () => {
  // Hook to navigate programmatically
  const history = useNavigate();

  return (
    <div className="container mt-2">
      <div className="form-title">
        <h2 className="text-center form-title-text">Complaint Form</h2>
      </div>

      {/* Formik component to handle the form submission */}
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          contactNumber: "",
          category: "",
          urgencyLevel: "",
          description: "",
          dateOfIncident: "",
          preferredContactMethod: "",
        }}
        validationSchema={ComplaintFormSchema}
        onSubmit={(values, actions) => {
          // Logic to handle form submission
          console.log(values);
          actions.setSubmitting(false);
          // Redirect to success page after form submission
          history.push("/success");
        }}
      >
        {({ isSubmitting }) => (
          // Form component from Formik to encapsulate form fields
          <Form>
            {/* Full name and Email */}
            <div className="row">
              {/* Full name */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name:</label>
                  <Field name="fullName" type="text" className="form-control" />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">Email Address:</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number:</label>
              <Field name="contactNumber" type="tel" className="form-control" />
              <ErrorMessage
                name="contactNumber"
                component="div"
                className="text-danger"
              />
            </div>

            {/* Category and Urgency Level */}
            <div className="row">
              {/* Category */}
              <div className="col-md-6">
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
              </div>

              {/* Urgency level */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="urgencyLevel">Urgency Level:</label>
                  <Field
                    name="urgencyLevel"
                    as="select"
                    className="form-control"
                  >
                    <option value="">Select level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Field>
                  <ErrorMessage
                    name="urgencyLevel"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
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

            {/* Date of Incident */}
            <div className="form-group">
              <label htmlFor="dateOfIncident">Date of Incident:</label>
              <Field
                name="dateOfIncident"
                type="date"
                className="form-control"
                max={new Date().toISOString().split("T")[0]}
              />
              <ErrorMessage
                name="dateOfIncident"
                component="div"
                className="text-danger"
              />
            </div>

            {/* Upload Files */}
            <div class="mb-3 form-group">
              <label
                for="formFileMultiple"
                className="form-label"
                htmlFor="files"
              >
                Upload File (<b>Optional</b>), max 50MB:
              </label>
              <div>
                <input
                  class="form-control"
                  type="file"
                  id="files"
                  name="files"
                  multiple
                />
              </div>
              <ErrorMessage
                name="files"
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
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="SMS">SMS</option>
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
                disabled={isSubmitting}>
                Submit
              </button>
              <button type="reset" className="btn-reset">
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ComplaintForm;

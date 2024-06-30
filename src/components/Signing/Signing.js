import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../Modal/Modal";
import { useFirebase } from "../Auth/UseFirebase";

import "./Signing.css";

const Signing = () => {
  const [showSignIn, setShowSignIn] = useState(true); // Initially show sign in
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [showModal, setShowModal] = useState(false); // Showing the Modal
  const [modalContent, setModalContent] = useState(""); // The contents of the Modal

  const {
    signUpUser,
    signInUser,
    resetPassword,
    addStaffToOrg,
    addOrganization,
    addUser,
  } = useFirebase(); // Get functions from useFirebase


  // Click listener for forgot password
  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");
    setModalContent(
      <div className="text-center">
        <h3 className="text-capitalize m-4">Forgot Password?</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleReset}
        >
          {({ setResetting }) => (
            <div className="justify-content-center text-center signing-form">
              <div className="w-100">
                <Form>
                  <div className="form-group">
                    <Field
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn mt-2"
                      disabled={setResetting || isLoading}
                    >
                      {isLoading ? "Sending Link..." : "Reset"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Formik>
      </div>
    );
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };

  const handleShowSignUp = () => {
    setShowSignIn(false);
    console.log("To Sign Up link clicked");
  };

  const handleShowSignIn = () => {
    setShowSignIn(true);
    console.log("To Sign In link clicked");
  };

  const initialValues = {
    // For Personal
    name: "",
    email: "",
    password: "",
    // For Organization
    confirmPassword: "",
    orgName: "",
    orgPhone: "",
    orgEmail: "",
    subscriptionTier: "basic",
  };

  const validationSchema = Yup.object().shape({
    // For Personal
    name: Yup.string().required("Your name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),

    // For Organization
    confirmPassword: Yup.string().when("password", {
      is: (val) => val !== undefined && val.length > 0, // Check if val is defined
      then: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    orgName: Yup.string().required("Organization's name is required"),
    orgPhone: Yup.string()
      .required("Organization's phone number is required")
      .matches(/^\+?[0-9\s-]+/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    orgEmail: Yup.string()
      .email("Invalid email format")
      .required("Organization's email is required"),
    subscriptionTier: Yup.string().required(
      "Please select a subscription tier"
    ),
  });

  // Signing in or Signing Up
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true); // Set loading state

    try {
      if (showSignIn) {
        try {
        // Sign In
        await signInUser(values.email, values.password);
        // ... (handle successful sign-in)
        }catch (error) {
          // Handle errors
          console.error("Error during sign in:", error);
          // Display error message to the user
        }
      } else {
        try{
        // Sign Up
        const { user } = await signUpUser(values.email, values.password);
        await addUser(user.uid, values.name, values.email, values.orgName);
        await addOrganization(
          values.orgName, {
          orgName: values.orgName,
          orgPhone: values.orgPhone,
          orgEmail: values.orgEmail,
          orgPlan: values.subscriptionTier,
          orgStatus: "active"
        }); // Create organization document
        await addStaffToOrg(
          values.orgName, {
          id: user.uid,
          name: values.name,
          email: values.email,
          role: "admin",
          notifications: {},
          todo_list: {},
          }); // Add staff to document
        setShowSignIn(true); // Switch to sign in after successful sign up
        }
        catch (error) {
          // Handle errors
          console.error("Error during sign-in/sign-up:", error);
          // Display error message to the user
        }
    }
    } catch (error) {
      // Handle errors
      console.error("Error during sign-in/sign-up:", error);
      // Display error message to the user
    } finally {
      setIsLoading(false); // Reset loading state
      setSubmitting(false);
    }
  };

    // Resetting Password
    const handleReset = async (values, { setResetting }) => {
      setIsLoading(true); // Set loading state
  
      try {
        // Simulate API call (replace with your actual logic)
        await resetPassword(values.email);
      } catch (error) {
        // Handle errors
      console.error("Error sending reset link to email:", error);
      } finally {
        setIsLoading(false); // Reset loading state
        setResetting(false);
      }
    };

  // Scroll to the top when the component mounts
  useEffect(() => {
    console.log("Component mounted, scrollling to top");
    window.scrollTo(0, 0);
  }, [5]);

  return (
    <div className="Signing">
      {/* Sign In */}
      {showSignIn && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <div className="container">
              <h1 className="text-center">Sign In</h1>
              <div className="row justify-content-center signing-form">
                <div className="col-md-6 col-lg-4">
                  <div className="login-wrap p-0">
                    <Form>
                      <div className="form-group">
                        <Field
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          id="password-field"
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                        <span
                          toggle="#password-field"
                          className="toggle-password"
                        />
                      </div>

                      <div className="form-group text-center">
                        <div className="m-3">
                          <a href="#" onClick={handleForgotPasswordClick}>
                            Forgot Password?
                          </a>
                        </div>

                        <button
                          type="submit"
                          className="form-control btn submit px-3"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                      </div>
                    </Form>
                    <br />
                    <div className="m-3 text-center">
                      Don&rsquo;t have an account?{" "}
                      <a href="#" onClick={handleShowSignUp}>
                        Sign Up
                      </a>
                    </div>
                    <br /> <br />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      )}

      {/* Sign Up */}
      {!showSignIn && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <div className="container">
              <h1 className="text-center">Sign Up</h1>
              <div className="row justify-content-center signing-form">
                <div className="col-md-6 col-lg-4">
                  <div className="login-wrap p-0">
                    <Form>
                      <div className="form-group">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          name="name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          id="password-field"
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                        <span
                          toggle="#password-field"
                          className="toggle-password"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          id="confirm-password-field"
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
                        <span
                          toggle="#password-field"
                          className="toggle-password"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Organization's Name"
                          name="orgName"
                        />
                        <ErrorMessage
                          name="orgName"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="tel"
                          className="form-control"
                          placeholder="Organization's Phone Number"
                          name="orgPhone"
                        />
                        <ErrorMessage
                          name="orgPhone"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          type="email"
                          className="form-control"
                          placeholder="Organization's Email"
                          name="orgEmail"
                        />
                        <ErrorMessage
                          name="orgEmail"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="form-group">
                        <label>Subscription Tier</label>
                        <Field
                          as="select"
                          className="form-control"
                          name="subscriptionTier"
                        >
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                        </Field>
                        <ErrorMessage
                          name="subscriptionTier"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <br />
                      <div className="form-group text-center">
                        <button
                          type="submit"
                          className="form-control btn submit px-3"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                      </div>
                    </Form>
                    <div className="text-center">
                      <br />
                      <div className="m-3 text-center">
                        Already have an account?{" "}
                        <a href="#" onClick={handleShowSignIn}>
                          Sign In
                        </a>
                      </div>
                      <br /> <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      )}

      {/* Modal */}
      <Modal show={showModal} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Signing;

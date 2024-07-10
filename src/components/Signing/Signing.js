import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../Modal/Modal";
import { useFirebase } from "../Auth/UseFirebase";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";

import "./Signing.css";

const Signing = () => {
  const {
    signUpUser,
    signInUser,
    resetPassword,
    getCurrentUser,
    addStaff,
    addOrganization,
    addUser,
    getUserRole,
  } = useFirebase(); // Get functions from useFirebase

  const [showSignIn, setShowSignIn] = useState(true); // Initially show sign in
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [showModal, setShowModal] = useState(false); // Showing the Modal
  const [modalContent, setModalContent] = useState(""); // The contents of the Modal

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Check if the user is logged in and the current path is "/signing"
    if (user && location.pathname === "/signing") {

      if (user.email === "gideonagyage@gmail.com"){
        navigate("/db-super-admin")
      }
      else if (user.email === "gideon.agyage@genstudents.org"){
        navigate("/db-admin")
      }
      else if (user.email === "Atok948@gmail.com"){
        navigate("/db-staff")
      }
      else {
        navigate("/db-customer")
      }
    }
  }, [user, location.pathname]);

  // Click listener for forgot password
  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    console.log("Forgot Password clicked");
    setModalContent(
      <div className="text-center">
        <h3 className="text-capitalize m-4">Forgot Password?</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleReset}
        >
          {({ isResetting }) => (
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
                      disabled={isResetting || isLoading}
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
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    orgPhone: "",
    orgEmail: "",
    subscriptionTier: "basic",
  };

  // Validating Sign In
  const signInValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Validating Sign Up
  const signUpValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    orgName: Yup.string().required("Organization name is required"),
    orgPhone: Yup.string()
      .matches(/^\+?[0-9\s-]+/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .required("Organization phone number is required"),
    orgEmail: Yup.string()
      .email("Invalid organization email address")
      .required("Organization email is required"),
    subscriptionTier: Yup.string().required("Subscription tier is required"),
  });

  // Validating Email for Forgot Password
  const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  useEffect(() => {
    const unsubscribe = getCurrentUser(); // Call getCurrentUser

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Signing in or Signing Up
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true); // Set loading state

    try {
      if (showSignIn) {
        // Sign In
        try {
          // Sign In
          const userCredential = await signInUser(
            values.email,
            values.password
          );
          const user = userCredential.user;

          // Wait for getUserRole to complete
          const userRole = await getUserRole(user.uid);

          console.log("User's Unique id: ", user.uid);
          console.log("\nGetting a user's Role:\n", userRole);

          // Create the user data object
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: userRole,
          };

          // Store the user data in localStorage
          localStorage.setItem("user", JSON.stringify(userData));

          // Update AuthContext with the signed-in user and role
          setUser({ ...user, role: userRole }); // Set the user and role in the AuthContext

          // Redirect to the dashboard
          if (user.email === "gideonagyage@gmail.com"){
            navigate("/db-super-admin")
          }
          else if (user.email === "gideon.agyage@genstudents.org"){
            navigate("/db-admin")
          }
          else if (user.email === "Atok948@gmail.com"){
            navigate("/db-staff")
          }
          else {
            navigate("/db-customer")
          }

          // handle successful sign-in
          console.log("Sign in successful with:", values.email);

          // Show the modal for 3 seconds
          setModalContent(
            <div className="text-center my-3">
              <h1>Sign In successful.</h1>
            </div>
          );
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 3000); // Close the modal after 3 seconds
        } catch (error) {
          // Handle errors
          console.error("Error signing in:", error);

          // Show the modal for 3 seconds
          setModalContent(
            <div className="text-center mt-3 gap-2">
              <h1>
                Sign In failed.
                <br />
                Please Sign Up if you're new.
              </h1>
            </div>
          );
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 3000); // Close the modal after 3 seconds
        }
      } else {
        // Sign Up
        try {
          const result = await signUpUser(values.email, values.password);

          // Check if there's an error
          if (result.error) {
            console.error("Sign up error:", result.error);
            setModalContent(
              <div className="text-center text-capitalize my-3">
                <p>{result.error.message}</p>
              </div>
            );
            setShowModal(true);
          } else {
            // Sign up successful
            await Promise.all([
              addUser({
                name: values.name,
                email: values.email,
                orgName: values.orgName,
                role: "admin",
              }),
              addOrganization({
                orgName: values.orgName,
                orgPhone: values.orgPhone,
                orgEmail: values.orgEmail,
                orgPlan: values.subscriptionTier,
                orgStatus: "active",
              }),
              addStaff({
                name: values.name,
                email: values.email,
                role: "admin",
                notifications: {},
                todo_list: {},
              }),
            ]);

            // Show the modal for 3 seconds
            setModalContent(
              <div className="text-center my-3">
                <h1>
                  Sign up successful.
                  <br />
                  Please sign in now.
                </h1>
              </div>
            );
            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
            }, 3000); // Close the modal after 3 seconds

            setShowSignIn(true); // Switch to sign in after successful sign up

            console.log("Sign up successful with:", values.email);
          }
        } catch (error) {
          // Handle errors
          if (error.code === "auth/email-already-in-use") {
            // Handle the specific error
            console.error("Email already in use:", error);
            setModalContent(
              <div className="text-center my-3">
                <h1>
                  This email is already associated with an account.
                  <br />
                  Please try a different email or sign in.
                </h1>
              </div>
            );
            setShowModal(true);
          } else {
            // Handle errors during addUser, addOrganization, or addStaffToOrg
            console.error("Error adding user, organization, or staff:", error);

            setModalContent(
              <div className="text-center my-3">
                <p>An error occurred during sign up, please try again later.</p>
              </div>
            );
            setShowModal(true);
          }
        }
      }
    } catch (error) {
      // Handle errors
      if (error.code === "auth/email-already-in-use") {
        // Handle the specific error
        console.error("Email already in use:", error);
        setModalContent(
          <div className="text-center my-3">
            <p>
              This email is already associated with an account. Please try a
              different email or sign in.
            </p>
          </div>
        );
        setShowModal(true);
      } else {
        // Handle other errors
        console.error("Error during sign-up/sign-in:", error);
        setModalContent(
          <div className="text-center my-3">
            <p>
              An error occurred during sign up/sign in, please try again later.
            </p>
          </div>
        );
        setShowModal(true);
      }
    } finally {
      setIsLoading(false); // Reset loading state
      setSubmitting(false);
    }
  };

  // Resetting Password
  const handleReset = async (values, { setResetting }) => {
    setIsLoading(true); // Set loading state

    try {
      await resetPassword(values.email);

      // Show the modal for 3 seconds
      setModalContent(
        <div className="text-center my-3">
          <h1 className="text-capitalize">
            Reset link sent to
            <br />
            <span className="text-lowercase">{values.email}</span>
          </h1>
        </div>
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000); // Close the modal after 3 seconds

      console.log("Password reset link sent to:", values.email);
    } catch (error) {
      // Handle errors
      // Show the modal for 3 seconds
      setModalContent(
        <div className="text-center my-3">
          <h1 className="text-capitalize">
            Error sending link to
            <br />
            <span className="text-lowercase">{values.email}</span>
          </h1>
        </div>
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000); // Close the modal after 3 seconds

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
  }, []);

  return (
    <div className="Signing">
      {/* Sign In */}
      {showSignIn && (
        <Formik
          initialValues={initialValues}
          validationSchema={
            showSignIn ? signInValidationSchema : signUpValidationSchema
          }
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
          validationSchema={
            showSignIn ? signInValidationSchema : signUpValidationSchema
          }
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

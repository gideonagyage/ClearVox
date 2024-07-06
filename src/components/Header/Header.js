import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import ModalSignOut from "../Modal/ModalSignOut";
import { AuthContext } from "../Auth/AuthProvider";

const Header = () => {
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validationSchema: yup.object({
      search: yup
        .string()
        .trim()
        .min(3, "Search term must be at least 3 characters")
        .max(50, "Search term must be less than 50 characters"),
    }),
    onSubmit: (values) => {
      // Handle search submission
      console.log("Search:", values.search);
    },
  });

  const [showModal, setShowModal] = useState(false); // Showing the Modal
  const location = useLocation();
  const navigate = useNavigate(); // Get the navigate function
  const { user } = useContext(AuthContext); // Get the user from the context

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };

  // Click listener for the Pricing
  const handleAccountSignOut = (event) => {
    event.preventDefault();

    setShowModal(true);
    console.log("Account SignOut clicked");
  };

  // Check if the current route is '/signing'
  if (location.pathname !== "/" && user) {
    return (
      <>
        <header className="header navbar navbar-expand-lg">
          <div className="container-fluid">
            {/* ClearVox Logo */}
            <Link to="/" className="navbar-brand">
              <img
                src="./img/logo/clearvox_word.png"
                alt="ClearVox Logo"
                style={{ height: 40, width: "auto" }}
              />
            </Link>

            {/* Navbar Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="toggle-navbar navbar-toggler-icon"></span>
            </button>

            {/* NavBar List, Search functionality and Account Sign out */}
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              {/* Navbar List */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 head-nav-list">
                <li className="nav-item">
                  <Link
                    to="/dashboard"
                    className={`nav-link ${
                      location.pathname === "/dashboard" ? "disabled" : ""
                    }`}
                    aria-current="page"
                    style={{
                      color:
                        location.pathname === "/dashboard"
                          ? "#1E3C70"
                          : "white",
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/complaint-form"
                    className={`nav-link ${
                      location.pathname === "/complaint-form" ? "disabled" : ""
                    }`}
                    aria-current="page"
                    style={{
                      color:
                        location.pathname === "/complaint-form"
                          ? "#1E3C70"
                          : "white",
                    }}
                  >
                    Form
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/complaints"
                    className={`nav-link ${
                      location.pathname === "/complaints" ? "disabled" : ""
                    }`}
                    aria-current="page"
                    style={{
                      color:
                        location.pathname === "/complaints"
                          ? "#1E3C70"
                          : "white",
                    }}
                  >
                    Complaints
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/profile"
                    className={`nav-link ${
                      location.pathname === "/profile" ? "disabled" : ""
                    }`}
                    aria-current="page"
                    style={{
                      color:
                        location.pathname === "/profile" ? "#1E3C70" : "white",
                    }}
                  >
                    Profile
                  </Link>
                </li>
              </ul>

              {/* Complaint Search Field */}
              <form
                className={`d-flex ${
                  location.pathname !== "/complaints" ? "d-none" : ""
                }`}
                onSubmit={formik.handleSubmit}
              >
                <div className="input-group">
                  <input
                    className=" search-input form-control"
                    type="search"
                    placeholder="Search complaints..."
                    aria-label="Search"
                    name="search"
                    value={formik.values.search}
                    onChange={formik.handleChange}
                  />
                  <button
                    className="search-btn"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    <img
                      src="./img/icons/search.svg"
                      alt="search"
                      style={{ height: 28, width: "auto" }}
                    />
                  </button>
                </div>
              </form>

              {/* User Account to Sign out */}
              <div className="ms-3 text-center">
                <img
                  onClick={handleAccountSignOut}
                  src="./img/icons/account.svg"
                  alt="account"
                  className="img-account"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Modal to Sign Out */}
        <ModalSignOut show={showModal} onClose={closeModal}></ModalSignOut>
      </>
    );
  } else {
    if (location.pathname !== "/") {
      return (
        <>
          <header className="header navbar navbar-expand-lg">
            <div className="container-fluid">
              {/* ClearVox Logo */}
              <Link to="/" className="navbar-brand">
                <img
                  src="./img/logo/clearvox_word.png"
                  alt="ClearVox Logo"
                  style={{ height: 40, width: "auto" }}
                />
              </Link>
            </div>
          </header>
        </>
      );
    }
  }
};

export default Header;

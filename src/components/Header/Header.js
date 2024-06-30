import React from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

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

  const location = useLocation();

  // Check if the current route is '/signing'
  if (location.pathname  !== "/") {
    return (
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Navbar List */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 head-nav-list">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link" aria-current="page">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/complaint-form" className="nav-link">
                Form
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/complaints" className="nav-link">
                Complaints
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </li>
          </ul>

          {/* Complaint Search Field */}
          <form className="d-flex" onSubmit={formik.handleSubmit}>
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

          {/* User Account */}
          <div className="ms-3 text-center">
            {/* <span className="user-name">John Doe</span> */}

            <img
              src="./img/icons/account.svg"
              alt="account" className="img-account" />

            {/* Link to Logout */}
            {/* Modal to Sign Out */}
            <Link to="/SignOut" className="logout-link ms-2 visually-hidden">
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </header>
    );
  } else {
    return null; // Don't render the header
  }
};

export default Header;

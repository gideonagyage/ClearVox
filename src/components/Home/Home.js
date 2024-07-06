import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Modal from "../Modal/Modal";
import { AuthContext } from "../Auth/AuthProvider";
import { useFirebase } from '../Auth/UseFirebase';


import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    navigate("/signing");
    window.scrollTo(0, 0); // Scroll to the top
    console.log("Scrolled to the Top View");
  };

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Refs for sections
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Scroll to the About Us
  const scrollToAboutUs = () => {
    const aboutUsSection = document.querySelector(".about-us");
    aboutUsSection.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the Features
  const scrollToFeatures = () => {
    featuresRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("Scrolled to the Features");
  };

  // Scroll to the Testimonials
  const scrollToTestimonials = () => {
    testimonialsRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("Scrolled to the Testimonials");
  };

  // Scroll to the Contact Us
  const scrollToContactMe = () => {
    const contactUsSection = document.querySelector(".contact-us");
    contactUsSection.scrollIntoView({ behavior: "smooth" });
    console.log("Scrolled to Contact Me");
  };

  // Click listener for the Pricing
  const handlePricingClick = (event) => {
    event.preventDefault();

    console.log("Categories for pricing is clicked");

    setModalContent(
      <div className="text-center m-2">
        <h2>Pricing</h2>
        <div className="pricing-container">
          {/* Table for Pricing */}
          <table>
            <thead>
              <tr>
                <th>
                  Basic
                  <br />
                  $29
                </th>
                <th>
                  Standard
                  <br />
                  $59
                </th>
                <th>
                  Premium
                  <br />
                  $99
                </th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Complaint Submission</td>
              </tr>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Complaint Tracking</td>
              </tr>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Complaint Categorization</td>
              </tr>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/close.svg"
                    alt="times"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Complaint Assignment</td>
              </tr>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/close.svg"
                    alt="times"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Communication Management</td>
              </tr>
              <tr>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/close.svg"
                    alt="times"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/close.svg"
                    alt="times"
                  />
                </td>
                <td>
                  <img
                    className="media-icon"
                    src="./img/icons/done.svg"
                    alt="checked"
                  />
                </td>
                <td>Reporting and Analytics</td>
              </tr>
            </tbody>
          </table>
          {/* End of Table */}
        </div>
      </div>
    );
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };


  // Get the user from the context
  const { user } = useContext(AuthContext);

  // Call useFirebase outside the useEffect callback
  const { getCurrentUser } = useFirebase();

  useEffect(() => {
    const unsubscribe = getCurrentUser(); // Call getCurrentUser

    // Cleanup the listener when the component unmounts
    return () => unsubscribe(); 
  }, []);

// Use the user object in your component's logic
if (user) {
  // User is logged in
  console.log("User is logged in:", user.email);
} else {
  // User is not logged in
  console.log("User is not logged in");
}

  return (
    <div className="container">
      {/* Header of the Home Page */}
      <header className="home-header navbar navbar-expand-lg">
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-list">
              <li className="nav-item">
                <a
                  onClick={scrollToAboutUs}
                  className="nav-link"
                  aria-current="page"
                >
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a onClick={scrollToFeatures} className="nav-link">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={handlePricingClick}>
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                <a onClick={scrollToTestimonials} className="nav-link">
                  Testimonials
                </a>
              </li>
              <li className="nav-item">
                <a onClick={scrollToContactMe} className="nav-link">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Background Waves */}
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave-2"></div>
        <div className="wave-2"></div>
      </div>

      {/* All other contents on the main page */}
      <div>
        {/* Heading of the Home Page */}
        <div className="main-content">
          <br /> <br /> <br />
          <span>Streamline Your Complaint Management</span>
          <br />
          <p>
            ClearVox is your all-in-one solution for efficient complaint
            management.
            <br />
            Track, resolve, and analyze complaints with ease.
          </p>
          {/* To Dashboard if user is signed in, else to the sign up and sign in page */}
          <p>
            <Link to="/dashboard">
              <button
                type="button"
                className="btn-register text-capitalize"
                onClick={scrollToTop}
              >
                {/* Conditional button text */}
                {user ? "My Dashboard" : "Get Started"}
              </button>
            </Link>
          </p>
          {/* Home's main content */}
          <div className="misc">
            <br /> <br />
            {/* Features and Testimonials */}
            <div>
              {/* Features */}
              <h2 ref={featuresRef} className="m-6 text-center">
                FEATURES
              </h2>
              <div className="row text-center">
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_submission.svg"
                    alt="Complaint Submission"
                    className="feature-image"
                  />
                  <p className="feature text-start">
                    <strong>Complaint Submission</strong> <br />
                    Users can easily submit complaints through a user-friendly
                    interface.
                  </p>
                </div>
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_tracking.svg"
                    alt="Complaint Tracking"
                    className="feature-image"
                  />
                  <p className="feature text-end">
                    <strong>Complaint Tracking</strong> <br />
                    Track the status of complaints in real-time, from submission
                    to resolution.
                  </p>
                </div>
              </div>
              <div className="row text-center">
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_categorization.svg"
                    alt="Complaint Categorization"
                    className="feature-image"
                  />
                  <p className="feature text-start">
                    <strong>Complaint Categorization</strong> <br />
                    Organize complaints by category for better analysis and
                    reporting.
                  </p>
                </div>
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_assignment.svg"
                    alt="Complaint Assignment"
                    className="feature-image"
                  />
                  <p className="feature text-end">
                    <strong>Complaint Assignment</strong> <br />
                    Assign complaints to specific agents or teams for efficient
                    handling.
                  </p>
                </div>
              </div>
              <div className="row text-center">
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_management.svg"
                    alt="Communication Management"
                    className="feature-image"
                  />
                  <p className="feature text-start">
                    <strong>Communication Management</strong> <br />
                    Communicate with customers throughout the complaint
                    resolution process.
                  </p>
                </div>
                <div className="col-md-5 col-12 text-center card">
                  <img
                    src="./img/illus/comp_analytics.svg"
                    alt="Reporting and Analytics"
                    className="feature-image"
                  />
                  <p className="feature text-end">
                    <strong>Reporting and Analytics</strong> <br />
                    Generate reports and insights on complaint trends and
                    performance.
                  </p>
                </div>
              </div>
              <br /> <br />
              {/* Testimonials */}
              <div>
                <h2 ref={testimonialsRef} className="m-6 text-center">
                  Testimonials
                </h2>
                <Carousel autoPlay infiniteLoop>
                  {/* 1st Carousel */}
                  <div className="myCarousel">
                    <div className="img-box">
                      <img
                        src="./img/photos/man_1.jpg"
                        alt="Nicholas Amankwah"
                      />
                    </div>
                    <p className="testimonial">
                      "ClearVox has been a game-changer for our customer service
                      team. It's streamlined our complaint management process,
                      making it easier to track, resolve, and analyze
                      complaints. We've seen a significant improvement in our
                      customer satisfaction since implementing ClearVox."
                    </p>
                    <p className="overview">
                      <b>Nicholas Amankwah</b>, Customer Service Manager, Alpha
                      House Corporation
                    </p>
                  </div>
                  {/* 2nd Carousel */}
                  <div className="myCarousel">
                    <div className="img-box">
                      <img src="./img/photos/man_2.jpg" alt="Samuel Osei" />
                    </div>
                    <p className="testimonial">
                      "I used to dread dealing with customer complaints, but
                      ClearVox has made it so much easier. The intuitive
                      interface and powerful features have helped us resolve
                      complaints quickly and efficiently. I highly recommend
                      ClearVox to any business looking to improve their
                      complaint management process."
                    </p>
                    <p className="overview">
                      <b>Emmanuel Osei</b>, Operations Manager, Syrus
                      Technologies Inc
                    </p>
                  </div>
                  {/* 3rd Carousel */}
                  <div className="myCarousel">
                    <div className="img-box">
                      <img src="./img/photos/lady_1.jpg" alt="Sarah Akoto" />
                    </div>
                    <p className="testimonial">
                      "ClearVox has given us valuable insights into our customer
                      complaints. The reporting and analytics features have
                      helped us identify trends and areas for improvement. We're
                      now able to proactively address customer concerns and
                      prevent future issues."
                    </p>
                    <p className="overview">
                      <b>Roberta Mensah</b>, Marketing Director, Hopper Finance
                      Inc.
                    </p>
                  </div>
                  {/* 4th Carousel */}
                  <div className="myCarousel">
                    <div className="img-box">
                      <img src="./img/photos/lady_2.jpg" alt="Deborah Aryee" />
                    </div>
                    <p className="testimonial">
                      "ClearVox has been a lifesaver for our small business.
                      It's affordable, easy to use, and has helped us improve
                      our customer service significantly. We're now able to
                      handle complaints efficiently and keep our customers
                      happy."
                    </p>
                    <p className="overview">
                      <b>Jessica Aryee</b>, Owner, Debar Micro Finance Ltd
                    </p>
                  </div>
                </Carousel>
              </div>
              {/* To Dashboard if user is signed in, else to the sign up and sign in page */}
              <p className="text-center">
                <Link to="/dashboard">
                  <button
                    type="button"
                    className="btn-register text-capitalize"
                    onClick={scrollToTop}
                  >
                    {/* Conditional button text */}
                    {user ? "My Dashboard" : "Get Started"}
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal show={showModal} onClose={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </div>
  );
};

export default Home;

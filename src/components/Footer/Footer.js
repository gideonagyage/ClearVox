import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";

import "./Footer.css";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Click listener for the Developer
  const handleDeveloperClick = (event) => {
    event.preventDefault();
    console.log("Meet the Developer is clicked");
    setModalContent(
      <div className="text-center">
        <h2 className="text-capitalize dev-heading">Gideon Agyage</h2>
        <img
          className="dev-image"
          src="./img/photos/developer.jpeg"
          alt="Developer"
        />
        <p>
          Hi There! I'm the developer behind Clearvox. My passion lies in
          creating innovative solutions that address real-world challenges. With
          a strong foundation in web development, I’ve crafted Clearvox to be
          reliable, user-friendly, and scalable. Feel free to reach out—I’m
          always eager to collaborate on exciting projects!
        </p>
      </div>
    );
    setShowModal(true);
  };

  // Click listener for the Careers
  const handleCareersClick = (event) => {
    event.preventDefault();
    console.log("Careers is clicked");
    setModalContent(
      <div className="text-center">
        <h2>Careers</h2>
        <p>
          While Clearvox is thriving, we currently don’t have any open
          positions. However, we’re constantly growing, so keep an eye out for
          future opportunities. If you’re passionate about software development
          and customer-centric solutions, stay tuned!
        </p>
      </div>
    );
    setShowModal(true);
  };

  // Click listener for the Terms and Policies
  const handleTermsClick = (event) => {
    event.preventDefault();
    console.log("Terms and Policies is clicked");
    setModalContent(
      <div className="text-center">
        <h2>Terms & Policies</h2>
        <p>
          At Clearvox, we value your trust and privacy. Our Terms & Policies
          outline how we collect, use, and protect your information. We strive
          to provide a transparent and secure experience for all our users. By
          using our website and service you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </div>
    );
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    console.log("Closed the Modal");
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About Us */}
          <div className="col-md-4 about-us">
            <h4 className="footer-title">About Us</h4>
            <p className="footer-title-line" />
            <ul className="list-unstyled">
              <li>
                <a href="#" onClick={handleDeveloperClick}>
                  Meet the Developer
                </a>
              </li>
              <li>
                <a href="#" onClick={handleCareersClick}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" onClick={handleTermsClick}>
                  Terms & Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-md-4 contact-us">
            <h4 className="footer-title">Contact Me</h4>
            <p className="footer-title-line" />
            <ul className="list-unstyled">
              <li>
                <a href="mailto:gideonagyage@gmail.com">
                  <img
                    src="./img/icons/mail.svg"
                    className="media-icon"
                    alt="Mail Icon"
                  />{" "}
                  Send an Email
                </a>
              </li>
              <li>
                <a href="tel:+1234567890">
                  <img
                    src="./img/icons/phone.svg"
                    className="media-icon"
                    alt="Phone Icon"
                  />{" "}
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <Link to="/contact-me">
                  {" "}
                  <img
                    src="./img/icons/form.svg"
                    className="media-icon"
                    alt="Form Icon"
                  />{" "}
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3">
            <h4 className="footer-title">Social Media</h4>
            <p className="footer-title-line" />
            <ul className="list-unstyled">
              <li>
                <a href="https://www.facebook.com/gideonagyage">
                  <img
                    src="./img/icons/facebook.svg"
                    className="media-icon"
                    alt="Facebook Icon"
                  />{" "}
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/gideonagyage">
                  <img
                    src="./img/icons/linkedin.svg"
                    className="media-icon"
                    alt="Linkedin Icon"
                  />{" "}
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/gideonagyage">
                  <img
                    src="./img/icons/instagram.svg"
                    className="media-icon"
                    alt="Instagram Icon"
                  />{" "}
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright ClearVox */}
        <div className="row mt-3">
          <div className="col-md-12 text-center">
            <p className="text-muted">
              Copyright &copy; {new Date().getFullYear()} ClearVox.
              <br /> All rights reserved.
            </p>
          </div>
        </div>

        {/* Modal */}
        <Modal show={showModal} onClose={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </footer>
  );
};

export default Footer;

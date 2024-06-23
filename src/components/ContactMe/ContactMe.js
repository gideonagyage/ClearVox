import React from "react";
import "./ContactMe.css";

const ContactMe = () => {
  return (
    <div className="container">
      <br />
      <h1 className="text-center">Get In Touch</h1>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-wrap p-0">
            <form action="#" className="signin-form text-center">
              <div className="form-group">
                <input
                  type="name"
                  className="form-control"
                  placeholder="Name"
                  required=""
                />
              </div>
              <div className="form-group">
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required=""
                />
              </div>
              <div className="form-group">
                <input
                  id="subject"
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  required=""
                />
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  type="text-area"
                  className="form-control"
                  placeholder="Message"
                  required=""
                />
              </div>
              <div>
                <button type="submit" className="btn">
                  Send Email
                </button>
              </div>
            </form>
          </div>
          <br /> <br />
        </div>
      </div>
    </div>
  );
};

// Exporting the component for use in other parts of the application
export default ContactMe;

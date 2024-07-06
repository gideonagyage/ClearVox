import React, { useState, useContext } from "react";
import { useFirebase } from "../Auth/UseFirebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthProvider";

import "./ModalSignOut.css";

const ModalSignOut = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, signOut } = useContext(AuthContext);

  const {
    signOutUser
  } = useFirebase();

  // Sign out
  const handleSignOut = async () => {
    setLoading(true); // Set loading state to true
    try {
      await signOutUser(); // Sign out the user
      localStorage.removeItem("user"); // Remove user data from localStorage
      setUser(null); // Update the user state
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false); // Reset loading state to false
      onClose();
      navigate("/signing"); // Redirect to the signing page
    }
  };

  const handleClose = () => {
    setLoading(false); // Reset loading state to false
    onClose(); // Close the modal after sign-out is complete
  };

  if (!show) {
    return null; // Don't render if not shown
  }

  return (
    <div className="modal">
      <div className="modal-content-sign-out text-center">
        <span className="close" onClick={handleClose}>
          &times;
        </span>

        <h3 className="text-lowercase my-4">
          <span className="text-capitalize">Do</span> you want to sign out?
        </h3>

        <div className="text-center">
          <button
            className="btn-sign-out m-2"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? "Signing Out..." : "Sign Out"}
          </button>
          <br />
          <button className="btn-cancel m-2" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSignOut;

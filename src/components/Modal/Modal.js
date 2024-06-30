// src/components/Modal/Modal.js
import React from 'react';
import './Modal.css';


const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null; // Don't render if not shown
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;

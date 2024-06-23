import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";
import Complaint from "./components/Complaint/Complaint";
import Loading from "./components/Loading/Loading";
import ComplaintList from "./components/ComplaintList/ComplaintList";
import Error from "./components/Error/Error";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Signing from "./components/Signing/Signing";
import Profile from "./components/Profile/Profile";
import ContactMe from "./components/ContactMe/ContactMe";

function App() {
  return (
    <Router>
      <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Signing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<ContactMe />} />
        <Route path="/complaint" element={<ComplaintForm />} />
        <Route path="/complaint/:id" element={<Complaint />} />
        <Route path="/complaint-list" element={<ComplaintList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/header" element={<Header />} />
        <Route path="/complaint-form" element={<ComplaintForm />} />
        <Route path="/contact-me" element={<ContactMe />} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Popper from "popper.js";
import { Switch } from "react-router-dom";
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
    
    <div className="app-container">
      
      <Header />

      {/* Your main content goe here */}
      <div className="content-wrapper"> 

        <Home />

        <Signing />

        <Profile />

        <Complaint />

        <ComplaintForm />

        <ComplaintList />

        <Dashboard />

        <Error />

        <ContactMe />

        <Loading />

      </div>

      <Footer />

    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";
import Complaint from "./components/Complaint/Complaint";
import Loading from "./components/Loading/Loading";
import Error from "./components/Error/Error";
import Home from "./components/Home/Home";
import Signing from "./components/Signing/Signing";
import Profile from "./components/Profile/Profile";
import ContactMe from "./components/ContactMe/ContactMe";
import PrivateRoute from "./components/Auth/PrivateRoute";
import DashboardCustomer from "./components/Dashboard/DashboardCustomer";
import DashboardStaff from "./components/Dashboard/DashboardStaff";
import DashboardAdmin from "./components/Dashboard/DashBoardAdmin";
import DashboardSuperAdmin from "./components/Dashboard/DashboardSuperAdmin";
import ComplaintFormUpdate from "./components/ComplaintForm/ComplaintFormUpdate";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Change and add logic to end loading after fetching API data

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Using useState and useEffect to determine when the Loading shows or disappears */}
        {isLoading && <Loading />}

        {/* Customed Header for other Components */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signing" element={<Signing />} />
          <Route path="*" element={<Error />} />
          <Route path="/contact-me" element={<ContactMe />} />

          <Route element={<PrivateRoute />}>
            <Route path="/db-customer" element={<DashboardCustomer />} />
            <Route path="/db-staff" element={<DashboardStaff />} />
            <Route path="/db-admin" element={<DashboardAdmin />} />
            <Route path="/db-super-admin" element={<DashboardSuperAdmin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/complaint-form" element={<ComplaintForm />} />
            <Route path="/complaint-form-update/:complaintId?" element={<ComplaintFormUpdate />} />
            <Route path="/complaints" element={<Complaint />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect, useContext } from "react";
import "./AddUser.css";
import { AuthContext } from "../Auth/AuthProvider";
import DashboardAdmin from "./DashBoardAdmin";
import DashboardCustomer from "./DashboardCustomer";
import DashboardStaff from "./DashboardStaff";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import { useFirebase } from "../Auth/UseFirebase";
import Loading from "../Loading/Loading";
import { useNavigate, useLocation } from "react-router-dom";

const AddUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { getUserRole } = useFirebase();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Check if the user is logged in and the current path is "/signing"
    if (!user && location.pathname === "/dashboard") {
      navigate("/signing"); // Redirect to the dashboard
    }
  }, [navigate]);

  useEffect(() => {
    // Check for user in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); 

  // Get the user role by checking role

  // const fetchUserRole = async () => {
  //   if (user) {
  //     try {
  //       const userId = user.uid;
  //       const fetchedUserRole = getUserRole(userId);
  //       setUserRole(fetchedUserRole);
  //       console.log("Role of user: ", fetchedUserRole);
  //     } catch (error) {
  //       console.error("Error fetching user role:", error);
  //     } finally {
  //       setIsLoading(false); // Set loading to false after fetching role
  //     }
  //   }
  // };

  //
  //
  // --- Make user role by comparing email ---
  const fetchUserRole = async () => {
    if (user) {
      try {
        const fetchedUserRole = user.email;
        setUserRole(fetchedUserRole);
      } catch (error) {
        console.error("Error fetching user email:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching role
      }
    }
  };

  useEffect(() => {
    fetchUserRole(); // Call fetchUserRole when the component mounts
  }, [fetchUserRole]);

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <div className="text-center full-height">
          <Loading />
        </div>
      ) : user && userRole ? (
        <>
          {userRole === "gideon.agyage@genstudents.org" && <DashboardStaff />}
          {userRole === "gideonagyage@gmail.com" && <DashboardSuperAdmin />}
        </>
      ) : (
        <DashboardCustomer />
      )}
    </div>
  );
};

export default AddUser;

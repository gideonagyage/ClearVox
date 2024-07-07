import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { AuthContext } from "../Auth/AuthProvider";
import DashboardAdmin from "./DashBoardAdmin";
import DashboardCustomer from "./DashboardCustomer";
import DashboardStaff from "./DashboardStaff";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import { useFirebase } from "../Auth/UseFirebase";
import Loading from "../Loading/Loading";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
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
  }, [user, location.pathname]);

  // Check for user in local storage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  const fetchUserRole = async () => {
    if (user) {
      try {
        const userId = user.uid;
        const fetchedUserRole = await getUserRole(userId);
        setUserRole(fetchedUserRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching role
      }
    }
  };

  useEffect(() => {
    fetchUserRole(); // Call fetchUserRole when the component mounts
  }, [user]); // Only run when the user changes

  // console.log("Get the user Role: \n", getUserRole(user.uid));
  // console.log("Get the userId: \n", user.uid);
  // console.log("Get the userEmail: \n", user.email);
  // console.log("Get the userName: \n", user.name);
  // console.log("Get the userRole: \n", user.role);

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <div className="text-center full-height">
          <Loading />
        </div>
      ) : user && userRole ? (
        <>
          {userRole === "customer" && <DashboardCustomer />}
          {userRole === "staff" && <DashboardStaff />}
          {userRole === "admin" && <DashboardAdmin />}
          {userRole === "super-admin" && <DashboardSuperAdmin />}
        </>
      ) : (
        <h1 className="text-center m-4 full-height">
          Currently you can't access the dashboard.
        </h1>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { AuthContext } from "../Auth/AuthProvider";
import DashboardAdmin from "./DashBoardAdmin";
import DashboardCustomer from "./DashboardCustomer";
import DashboardStaff from "./DashboardStaff";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import { useFirebase } from "../Auth/UseFirebase";

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const { getUserRoleById } = useFirebase();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Check for user in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchUserRole = async () => {
      if (user && user.id) {
        try {
          const userId = user.id;
          const fetchedUserRole = await getUserRoleById(userId);
          setUserRole(fetchedUserRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchUserRole();
  }, [user, getUserRoleById]);

  // Store user in local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <div className="text-center m-4">Loading...</div> // Loading indicator
      ) : user && userRole ? (
        <>
          {userRole === "customer" && <DashboardCustomer />}
          {userRole === "staff" && <DashboardStaff />}
          {userRole === "admin" && <DashboardAdmin />}
          {userRole === "super-admin" && <DashboardSuperAdmin />}
        </>
      ) : (
        <h1 className="text-center m-4">Please sign in to access the dashboard.</h1>
      )}
    </div>
  );
};

export default Dashboard;

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  onValue,
  push,
} from "firebase/database";

import { useState, useEffect } from "react";
import { config } from "dotenv";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Load environment variables from .env
config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Custom Hook for Firebase Interactions
const useFirebase = () => {
  // State for storing data
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [reports, setReports] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  // Sign out
  const signOutUser = async () => {
    localStorage.removeItem("user");
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get current user
  const getCurrentUser = () => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  };

  // --- AUTHENTICATION ---

  const getCurrentUserId = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      return user.uid;
    } else {
      // User is not authenticated
      return null;
    }
  };

  // Sign up a new user
  const signUpUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // handle successful sign-up
      console.log("Account created successfully");
      return userCredential;
    } catch (error) {
      // handle errors
      console.error("Error signing up:", error);
      throw error;
    }
  };

  // Sign in an existing user
  const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // handle successful sign-in
      console.log("Logged in successfully");
      return userCredential;
    } catch (error) {
      // handle errors
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Send a password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      // handle successful password reset email sent
      console.log("Password reset email sent successfully");
    } catch (error) {
      // handle errors
      console.error("Error sending password reset email:", error);
    }
  };

  // Send an email verification to the user
  const sendMailVerification = async (userId) => {
    try {
      await sendEmailVerification(userId);
      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  // --- USERS ---

  // Get all users (using onValue for real-time updates)
  const getUsers = () => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        setUsers(
          Object.entries(usersData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setUsers([]);
      }
    });
  };

  // Add a user
  const addUser = async (newUser) => {
    try {
      const usersRef = ref(db, "users");
      const newUserId = push(usersRef).key;
      newUser.dateAdded = Date.now();
      await set(child(usersRef, newUserId), newUser);
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  // Get user info by ID
  const getUserInfo = async (userId) => {
    try {
      const userRef = ref(db, "users", userId);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { id: userId, ...snapshot.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };

  // Update a user
  const updateUser = async (userId, updatedUser) => {
    try {
      const userRef = ref(db, "users", userId);
      await update(userRef, updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      const userRef = ref(db, "users", userId);
      await remove(userRef);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  // Get user role by ID
  const getUserRole = async (userId) => {
    try {
      const userDocRef = ref(db, "users", userId);
      const docSnap = await get(userDocRef);
      if (docSnap.exists()) {
        return docSnap.val().role;
      } else {
        console.error("User document not found:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  // --- ORGANIZATIONS ---

  // Get all organizations (using onValue for real-time updates)
  const getOrganizations = () => {
    const organizationsRef = ref(db, "org");
    onValue(organizationsRef, (snapshot) => {
      const organizationsData = snapshot.val();
      if (organizationsData) {
        setOrganizations(
          Object.entries(organizationsData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setOrganizations([]);
      }
    });
  };

  // Add an organization to the database
  const addOrganization = async (organizationData) => {
    try {
      const organizationRef = ref(db, "org");
      const newOrgId = push(organizationRef).key; // Generate unique ID
      organizationData.orgDateJoined = Date.now(); // Add timestamp
      await set(child(organizationRef, newOrgId), organizationData);
    } catch (error) {
      console.error("Error adding organization:", error);
      throw error;
    }
  };

  // Get organization details by ID
  const getOrganizationInfo = async (orgId) => {
    try {
      const orgDocRef = ref(db, "org", orgId);
      const docSnap = await get(orgDocRef);
      if (docSnap.exists()) {
        return { id: orgId, ...docSnap.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting organization details:", error);
      return null;
    }
  };

  // Update the organization
  const updateOrganization = async (orgId, organizationData) => {
    try {
      const organizationRef = ref(db, "org", orgId);
      await update(organizationRef, organizationData);
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  };

  // Delete an organization
  const deleteOrganization = async (orgId) => {
    try {
      const organizationRef = ref(db, "org", orgId);
      await remove(organizationRef);
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  };

  // Get organization by name
  const getOrganizationByName = async (orgName) => {
    try {
      const organizationsRef = ref(db, "org");
      const snapshot = await get(organizationsRef);
      if (snapshot.exists()) {
        const organizationsData = snapshot.val();
        for (const orgId in organizationsData) {
          if (organizationsData[orgId].name === orgName) {
            return { id: orgId, ...organizationsData[orgId] };
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting organization by name:", error);
      return null;
    }
  };

  // Get organization ID by name
  const getOrganizationIdByName = async (orgName) => {
    try {
      const organizationsRef = ref(db, "org");
      const snapshot = await get(organizationsRef);
      if (snapshot.exists()) {
        const organizationsData = snapshot.val();
        for (const orgId in organizationsData) {
          if (organizationsData[orgId].name === orgName) {
            return orgId;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error getting organization ID by name:", error);
      return null;
    }
  };

  // --- TICKETS ---

  // Get all tickets for a specific organization (using onValue for real-time updates)
  const getTickets = () => {
    const ticketsRef = ref(db, "org", "tickets");
    onValue(ticketsRef, (snapshot) => {
      const ticketsData = snapshot.val();
      if (ticketsData) {
        setTickets(
          Object.entries(ticketsData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setTickets([]);
      }
    });
  };

  // Add a ticket to a specific organization
  const addTicket = async (ticketData) => {
    try {
      const ticketsRef = ref(db, "org", "tickets");
      const newTicketId = push(ticketsRef).key; // Generate unique ID
      ticketData.dateAdded = Date.now(); // Add timestamp
      await set(child(ticketsRef, newTicketId), ticketData);
    } catch (error) {
      console.error("Error adding ticket:", error);
      throw error;
    }
  };

  // Update a ticket for a specific organization
  const updateTicket = async (ticketId, updatedTicketData) => {
    try {
      const ticketRef = ref(db, "org", "tickets", ticketId);
      await update(ticketRef, updatedTicketData);
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  };

  // Delete a ticket for a specific organization
  const deleteTicket = async (ticketId) => {
    try {
      const ticketRef = ref(db, "org", "tickets", ticketId);
      await remove(ticketRef);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  };

  // Get details of a ticket
  const getTicketInfo = async (ticketId) => {
    try {
      const ticketRef = ref(db, "org", "tickets", ticketId);
      const ticketDoc = await get(ticketRef);
      if (ticketDoc.exists()) {
        return { id: ticketId, ...ticketDoc.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting ticket:", error);
      return null;
    }
  };

  // --- STAFF ---

  // Get all staff for a specific organization (using onValue for real-time updates)
  const getStaff = () => {
    const staffRef = ref(db, "staff");
    onValue(staffRef, (snapshot) => {
      const staffData = snapshot.val();
      if (staffData) {
        setStaff(
          Object.entries(staffData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setStaff([]);
      }
    });
  };

  // Add a staff member to a specific organization
  const addStaff = async (staffData) => {
    try {
      const staffRef = ref(db, "staff");
      const newStaffId = push(staffRef).key; // Generate unique ID
      staffData.dateAdded = Date.now(); // Add timestamp
      await set(child(staffRef, newStaffId), staffData);
    } catch (error) {
      console.error("Error adding staff:", error);
      throw error;
    }
  };

  // Update a staff member for a specific organization
  const updateStaff = async (staffId, updatedStaffData) => {
    try {
      const staffRef = ref(db, "staff", staffId);
      await update(staffRef, updatedStaffData);
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  };

  // Delete a staff member for a specific organization
  const deleteStaff = async (staffId) => {
    try {
      const staffRef = ref(db, "staff", staffId);
      await remove(staffRef); // remove from organization
      const userRef = ref(db, "users", staffId);
      await remove(userRef); // remove from users
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  };

  // Get a specific staff member for a specific organization
  const getStaffInfo = async (staffId) => {
    try {
      const staffRef = ref(db, "staff", staffId);
      const staffDoc = await get(staffRef);
      if (staffDoc.exists()) {
        return { id: staffId, ...staffDoc.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting staff:", error);
      return null;
    }
  };

  // --- CUSTOMERS ---

  // Get all customers for a specific organization (using onValue for real-time updates)
  const getCustomers = () => {
    const customersRef = ref(db, "org", "customers");
    onValue(customersRef, (snapshot) => {
      const customersData = snapshot.val();
      if (customersData) {
        setCustomers(
          Object.entries(customersData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setCustomers([]);
      }
    });
  };

  // Add a customer to a specific organization
  const addCustomer = async (customerData) => {
    try {
      const customersRef = ref(db, "org", "customers");
      const newCustomerId = push(customersRef).key; // Generate unique ID
      customerData.dateAdded = Date.now(); // Add timestamp
      await set(child(customersRef, newCustomerId), customerData);
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  };

  // Update a customer for a specific organization
  const updateCustomer = async (customerId, updatedCustomerData) => {
    try {
      const customerRef = ref(db, "org", "customers", customerId);
      await update(customerRef, updatedCustomerData);
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  // Delete a customer for a specific organization
  const deleteCustomer = async (customerId) => {
    try {
      const customerRef = ref(db, "org", "customers", customerId);
      await remove(customerRef); // remove from organization
      const userRef = ref(db, "users", customerId);
      await remove(userRef); // remove from users
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  };

  // Get a specific customer for a specific organization
  const getCustomerInfo = async (customerId) => {
    try {
      const customerRef = ref(db, "org", "customers", customerId);
      const customerDoc = await get(customerRef);
      if (customerDoc.exists()) {
        return { id: customerId, ...customerDoc.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting customer:", error);
      return null;
    }
  };

  //
  // --- REPORTS ---
  //

  // Get all reports (using onValue for real-time updates)
  const getReports = () => {
    const reportRef = ref(db, "messages", "reports");
    onValue(reportRef, (snapshot) => {
      const reportsData = snapshot.val();
      if (reportsData) {
        setReports(
          Object.entries(reportsData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setReports([]);
      }
    });
  };

  // Add a report to the messages
  const addReport = async (reportData) => {
    try {
      const reportRef = ref(db, "messages", "reports");
      const newReportId = push(reportRef).key; // Generate unique ID
      reportData.dateAdded = Date.now(); // Add timestamp
      await set(child(reportRef, newReportId), reportData);
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    try {
      const reportRef = ref(db, "messages", "reports", reportId);
      await remove(reportRef);
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  };

  // Get report information
  const getReportInfo = async (reportId) => {
    try {
      const reportRef = ref(db, "messages", "reports", reportId);
      const docRef = await get(reportRef);
      if (docRef.exists()) {
        return { id: reportId, ...docRef.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting report information:", error);
      return null;
    }
  };

  //
  // --- ENQUIRIES ---
  //

  // Get all enquiries (using onValue for real-time updates)
  const getEnquiries = () => {
    const enquiryRef = ref(db, "messages", "enquiries");
    onValue(enquiryRef, (snapshot) => {
      const enquiriesData = snapshot.val();
      if (enquiriesData) {
        setEnquiries(
          Object.entries(enquiriesData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setEnquiries([]);
      }
    });
  };

  // Add an enquiry to the messages
  const addEnquiry = async (enquiryData) => {
    try {
      const enquiryRef = ref(db, "messages", "enquiries");
      const newEnquiryId = push(enquiryRef).key; // Generate unique ID
      enquiryData.dateAdded = Date.now(); // Add timestamp
      await set(child(enquiryRef, newEnquiryId), enquiryData);
    } catch (error) {
      console.error("Error adding an enquiry:", error);
      throw error;
    }
  };

  // Delete a enquiry
  const deleteEnquiry = async (enquiryId) => {
    try {
      const enquiryRef = ref(db, "messages", "enquiries", enquiryId);
      await remove(enquiryRef);
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      throw error;
    }
  };

  // Get enquiry information
  const getEnquiryInfo = async (enquiryId) => {
    try {
      const enquiryRef = ref(db, "messages", "enquiries", enquiryId);
      const docRef = await get(enquiryRef);
      if (docRef.exists()) {
        return { id: enquiryId, ...docRef.val() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting enquiry information:", error);
      return null;
    }
  };

  //
  // Fetch initial data on component mount
  //
  useEffect(() => {
    getUsers();
    getOrganizations();
    getTickets();
    getStaff();
    getCustomers();
    getReports();
    getEnquiries();
  }, []);

  return {
    db,
    // Authenticating
    user,
    isLoading,
    signOutUser,
    getCurrentUser,
    signUpUser,
    signInUser,
    resetPassword,
    sendMailVerification,
    // Users
    getCurrentUserId,
    users,
    getUsers,
    addUser,
    getUserInfo,
    updateUser,
    deleteUser,
    getUserRole,
    // Organizations
    organizations,
    getOrganizations,
    addOrganization,
    getOrganizationInfo,
    updateOrganization,
    deleteOrganization,
    getOrganizationByName,
    getOrganizationIdByName,
    // Tickets
    tickets,
    getTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    getTicketInfo,
    // Staff
    staff,
    getStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffInfo,
    // Customers
    customers,
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerInfo,
    // Reports
    reports,
    getReports,
    getReportInfo,
    addReport,
    deleteReport,
    // Enquiries
    enquiries,
    getEnquiries,
    getEnquiryInfo,
    addEnquiry,
    deleteEnquiry,
  };
};

export { useFirebase };

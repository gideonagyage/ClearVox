import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { config } from "dotenv";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

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

//
// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//
// --- Custom Hook for Firebase Interactions ---
const useFirebase = () => {

  //
  // --- State for storing data ---
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [reports, setReports] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //
  // --- Sign out ---
  const signOutUser = async () => {
    localStorage.removeItem("user");
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //
  // --- Get current user ---
  const getCurrentUser = () => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  };

  //
  // --- AUTHENTICATION ---
  //

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

  //
  // --- USERS ---
  //

  // Get all users
  const getUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };

  // Add a user
  const addUser = async (newUser) => {
    try {
      const usersRef = collection(db, "users");
      await addDoc(usersRef, newUser);
      getUsers(); //refresh the user list
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Get user info by ID
  const getUserInfo = async (userId) => {
    try {
      const userIdRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(userIdRef);
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
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
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updatedUser);
      getUsers(); // Refresh the user list after updating
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
      getUsers(); // Refresh the user list after deleting
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Get user role by ID
  const getUserRole = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data().role;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  //
  // --- ORGANIZATIONS ---
  //

  // Get all organizations
  const getOrganizations = async () => {
    try {
      const organizationsRef = collection(db, "org");
      const querySnapshot = await getDocs(organizationsRef);
      const organizationsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrganizations(organizationsList);
    } catch (error) {
      console.error("Error getting organizations:", error);
    }
  };

  // Add an organization to the database
  const addOrganization = async (organizationData) => {
    try {
      const registrationTimestamp = firebase.firestore.Timestamp.now();
      organizationData.orgDateJoined = registrationTimestamp;

      const organizationRef = collection(db, "org");
      await addDoc(organizationRef, organizationData);

      getOrganizations(); // Refresh list of oirganizations
    } catch (error) {
      console.error("Error adding organization:", error);
    }
  };

  // Get organization details by ID
  const getOrganizationInfo = async (orgId) => {
    try {
      const orgDocRef = doc(db, "org", orgId);
      const docSnap = await getDoc(orgDocRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
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
      const organizationRef = doc(db, "org", orgId);
      await updateDoc(organizationRef, organizationData);
      getOrganizations(); // Refresh the organizations list
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  // Delete an organization
  const deleteOrganization = async (orgId) => {
    try {
      const organizationRef = doc(db, "org", orgId);
      await deleteDoc(organizationRef);
      getOrganizations(); // Refresh the organization list
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  // Get organization by name
  const getOrganizationByName = async (orgName) => {
    try {
      const organizationsCollection = collection(db, "org");
      const q = query(organizationsCollection, where("name", "==", orgName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting organization by name:", error);
      return null;
    }
  };

  // Get organization ID by name
  const getOrganizationIdByName = async (orgName) => {
    try {
      const organizationsCollection = collection(db, "org");
      const q = query(organizationsCollection, where("name", "==", orgName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id; // Return the ID
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting organization ID by name:", error);
      return null;
    }
  };

  //
  // --- TICKETS ---
  //

  // Get all tickets for a specific organization
  const getTickets = async (orgName) => {
    try {
      const ticketsRef = collection(db, "org", orgName, "tickets");
      const querySnapshot = await getDocs(ticketsRef);
      const tickets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(tickets);
    } catch (error) {
      console.error("Error getting tickets:", error);
    }
  };

  // Add a ticket to a specific organization
  const addTicket = async (orgName, ticketData) => {
    try {
      const ticketTimestamp = firebase.firestore.Timestamp.now();
      ticketData.dateAdded = ticketTimestamp;

      const ticketsRef = collection(db, "org", orgName, "tickets");
      await addDoc(ticketsRef, ticketData);

      getTickets(); // Refresh list of tickets
    } catch (error) {
      console.error("Error adding ticket:", error);
      return null;
    }
  };

  // Update a ticket for a specific organization
  const updateTicket = async (orgName, ticketId, updatedTicketData) => {
    try {
      const ticketRef = doc(db, "org", orgName, "tickets", ticketId);
      await updateDoc(ticketRef, updatedTicketData);
      getTickets(); // Refresh list of tickets
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Delete a ticket for a specific organization
  const deleteTicket = async (orgName, ticketId) => {
    try {
      const ticketRef = doc(db, "org", orgName, "tickets", ticketId);
      await deleteDoc(ticketRef);
      getTickets(); // Refresh list of tickets
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // Get details of a ticket
  const getTicketInfo = async (orgName, ticketId) => {
    try {
      const ticketRef = doc(db, "org", orgName, "tickets", ticketId);
      const ticketDoc = await getDoc(ticketRef);
      if (ticketDoc.exists()) {
        return { id: ticketDoc.id, ...ticketDoc.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting ticket:", error);
      return null;
    }
  };

  //
  // --- STAFF ---
  //

  // Get all staff for a specific organization
  const getStaff = async (orgName) => {
    try {
      const staffRef = collection(db, "org", orgName, "staff");
      const querySnapshot = await getDocs(staffRef);
      const staffList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaff(staffList);
    } catch (error) {
      console.error("Error getting staff:", error);
      return [];
    }
  };

  // Add a staff member to a specific organization
  const addStaff = async (orgName, staffData) => {
    try {
      const staffTimestamp = firebase.firestore.Timestamp.now();
      staffData.dateAdded = staffTimestamp;

      const staffRef = collection(db, "org", orgName, "staff");
      await addDoc(staffRef, staffData);

      getStaff(); // Refresh list of staff
    } catch (error) {
      console.error("Error adding staff:", error);
      return null;
    }
  };

  // Update a staff member for a specific organization
  const updateStaff = async (orgName, staffId, updatedStaffData) => {
    try {
      const staffRef = doc(db, "org", orgName, "staff", staffId);
      await updateDoc(staffRef, updatedStaffData);
      getStaff(); // Refresh the staff list
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Delete a staff member for a specific organization
  const deleteStaff = async (orgName, staffId) => {
    try {
      const staffRef = doc(db, "org", orgName, "staff", staffId);
      await deleteDoc(staffRef); // remove from organization
      const userRef = doc(db, "users", staffId);
      await deleteDoc(userRef); // remove from users
      // Refresh staff list and users list
      getStaff();
      getUsers();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Get a specific staff member for a specific organization
  const getStaffInfo = async (orgName, staffId) => {
    try {
      const staffRef = doc(db, "org", orgName, "staff", staffId);
      const staffDoc = await getDoc(staffRef);
      if (staffDoc.exists()) {
        return { id: staffDoc.id, ...staffDoc.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting staff:", error);
      return null;
    }
  };

  //
  // --- CUSTOMERS ---
  //

  // Get all customers for a specific organization
  const getCustomers = async (orgName) => {
    try {
      const customersRef = collection(db, "org", orgName, "customers");
      const querySnapshot = await getDocs(customersRef);
      const customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customers);
    } catch (error) {
      console.error("Error getting customers:", error);
    }
  };

  // Add a customer to a specific organization
  const addCustomer = async (orgName, customerData) => {
    try {
      const customerTimestamp = firebase.firestore.Timestamp.now();
      customerData.dateAdded = customerTimestamp;

      const customersRef = collection(db, "org", orgName, "customers");
      await addDoc(customersRef, customerData);

      getCustomers(); // Refresh customers list
    } catch (error) {
      console.error("Error adding customer:", error);
      return null;
    }
  };

  // Update a customer for a specific organization
  const updateCustomer = async (orgName, customerId, updatedCustomerData) => {
    try {
      const customerRef = doc(db, "org", orgName, "customers", customerId);
      await updateDoc(customerRef, updatedCustomerData);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete a customer for a specific organization
  const deleteCustomer = async (orgName, customerId) => {
    try {
      const customerRef = doc(db, "org", orgName, "customers", customerId);
      await deleteDoc(customerRef); // remove from organization
      const userRef = doc(db, "users", customerId);
      await deleteDoc(userRef); // remove from users
      // Refresh customers list and users list
      getCustomers();
      getUsers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Get a specific customer for a specific organization
  const getCustomerInfo = async (orgName, customerId) => {
    try {
      const customerRef = doc(db, "org", orgName, "customers", customerId);
      const customerDoc = await getDoc(customerRef);
      if (customerDoc.exists()) {
        return { id: customerDoc.id, ...customerDoc.data() };
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

  // Get all reports
  const getReports = async () => {
    try {
      const reportRef = collection(db, "messages", "reports");
      const querySnapshot = await getDocs(reportRef);
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(messages);
    } catch (error) {
      console.error("Error getting reports:", error);
    }
  };

  // Add a report to the messages
  const addReport = async (reportData) => {
    try {
      const reportRef = collection(db, "messages", "reports");
      addDoc(reportRef, reportData);

      getReports(); // Refresh list of reports
    } catch (error) {
      console.error("Error adding report:", error);
      return null;
    }
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    try {
      const reportRef = doc(db, "messages", "reports", reportId);
      await deleteDoc(reportRef);

      getReports(); // Refresh list of reports
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  // Get report information
  const getReportInfo = async (reportId) => {
    try {
      const reportRef = doc(db, "messages", "reports", reportId);
      const docRef = await getDoc(reportRef);
      if (docRef.exists()) {
        return { id: docRef.id, ...docRef.data() };
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

  // Get all enquiries
  const getEnquiries = async () => {
    try {
      const enquiryRef = collection(db, "messages", "enquiries");
      const querySnapshot = await getDocs(enquiryRef);
      const enquiries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnquiries(enquiries);
    } catch (error) {
      console.error("Error getting enquiries:", error);
    }
  };

  // Add an enquiry to the messages
  const addEnquiry = async (enquiryData) => {
    try {
      const enquiryRef = collection(db, "messages", "enquiries");
      await addDoc(enquiryRef, enquiryData);

      getEnquiries(); // Refresh list of enquiries
    } catch (error) {
      console.error("Error adding an enquiry:", error);
      return null;
    }
  };

  // Delete a enquiry
  const deleteEnquiry = async (enquiryId) => {
    try {
      const enquiryRef = doc(db, "messages", "enquiries", enquiryId);
      await deleteDoc(enquiryRef);

      getEnquiries(); // Refresh list of enquiries
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  
  // Get enquiry information
  const getEnquiryInfo = async (enquiryId) => {
    try {
      const enquiryRef = doc(db, "messages", "enquiries", enquiryId);
      const docRef = await getDoc(enquiryRef);
      if (docRef.exists()) {
        return { id: docRef.id, ...docRef.data() };
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
    // Authenticating
    user,
    isLoading,
    signOutUser,
    getCurrentUser,
    signUpUser,
    signInUser,
    resetPassword,
    // Users
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

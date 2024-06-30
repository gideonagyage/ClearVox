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
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState } from "react";
import { config } from "dotenv";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//
// Custom Hook for Firebase Interactions
const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //
  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //
  // Get current user
  const getCurrentUser = () => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  };
  
//
// AUTHENTICATION
//
//
// Sign up a new user
const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // handle successful sign-up
    console.log("Account created successfully");
  } catch (error) {
    // handle errors
    console.error("Error signing up:", error);
  }
};

// Sign in an existing user
const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // handle successful sign-in
    console.log("Logged in successfully");
  } catch (error) {
    // handle errors
    console.error("Error signing in:", error);
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
// USERS
//
//
// Get all users
const getUsers = async () => {
  try {
    const usersRef = collection(db, "users");
const usersSnapshot = await getDocs(usersRef);
const usersList = usersSnapshot.docs.map((doc) => ({ 
  id: doc.id, ...doc
  .data() }));
return usersList;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Add a user
const addUser = async (userId, userData) => {
  try {
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, userId, userData);
    return docRef.id; // Return the ID of the newly added user
    } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

const getUserById = async (userId) => {
  try {
    const userIdRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(userIdRef);
    if (docSnapshot.exists()) {
      return {id: docSnapshot.id, ...docSnapshot.data()};
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

//
// ORGANIZATIONS
//
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
      return organizationsList;
  } catch (error) {
    console.error("Error getting organizations:", error);
    return [];
  }
};

// Add an organization to the database
const addOrganization = async (orgName, organizationData) => {
  try {
    const registrationTimestamp = firebase.firestore.Timestamp.now();
    organizationData.orgDateJoined = registrationTimestamp; 

    const organizationRef = collection(db, "org", orgName, "details");
    const docRef = await addDoc(organizationRef, organizationData);

    return docRef.id; // Return the ID of the newly added organization
  } catch (error) {
    console.error("Error adding organization:", error);
    return null;
  }
};


// Update the organization
const updateOrganization = async (orgName, organizationData) => {
  try {
    const organizationRef = doc(db, "org", orgName, "details");
    await updateDoc(organizationRef, organizationData);
  } catch (error) {
    console.error("Error updating organization:", error);
  }
};

// Delete an organization
const deleteOrganization = async (orgName) => {
  try {
    const organizationRef = doc(db, "org", orgName);
    await deleteDoc(organizationRef);
  } catch (error) {
    console.error("Error deleting organization:", error);
    }
};

// Get organization name by id
const getOrganizationNameById = async (user, orgName) => {
  try {
    const organizationRef = doc(db, "users", user, orgName);
    const docSnapshot = await getDoc(organizationRef);
    if (docSnapshot.exists()) {
      return {id: docSnapshot.id, ...docSnapshot.data()};
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting organization:", error);
    return null;
  }
};

  //
  // TICKETS
  //
  //
  // Get all tickets for a specific organization
  const getTicketsByOrg = async (orgName) => {
    try {
      const ticketsRef = collection(db, "org", orgName, "tickets");
      const querySnapshot = await getDocs(ticketsRef);
      const tickets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return tickets;
    } catch (error) {
      console.error("Error getting tickets:", error);
      return [];
    }
  };

  // Add a ticket to a specific organization
  const addTicketToOrg = async (orgName, ticketData) => {
    try {
      const ticketsRef = collection(db, "org", orgName, "tickets");
      const docRef = await addDoc(ticketsRef, ticketData);
      return docRef.id; // Return the ID of the newly added ticket
    } catch (error) {
      console.error("Error adding ticket:", error);
      return null;
    }
  };

  // Update a ticket for a specific organization
  const updateTicketInOrg = async (orgName, ticketId, updatedTicketData) => {
    try {
      const ticketRef = doc(db, "org", orgName, "tickets", ticketId);
      await updateDoc(ticketRef, updatedTicketData);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Delete a ticket for a specific organization
  const deleteTicketFromOrg = async (orgName, ticketId) => {
    try {
      const ticketRef = doc(db, "org", orgName, "tickets", ticketId);
      await deleteDoc(ticketRef);
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  // Get a specific ticket for a specific organization
  const getTicketByIdAndOrg = async (orgName, ticketId) => {
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
  // STAFF OF ORGANIZATIONS
  //
  //
  // Get all staff for a specific organization
  const getStaffByOrg = async (orgName) => {
    try {
      const staffRef = collection(db, "org", orgName, "staff");
      const querySnapshot = await getDocs(staffRef);
      const staff = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return staff;
    } catch (error) {
      console.error("Error getting staff:", error);
      return [];
    }
  };

  // Add a staff member to a specific organization
  const addStaffToOrg = async (orgName, staffData) => {
    try {
      const staffRef = collection(db, "org", orgName, "staff");
      const docRef = await addDoc(staffRef, staffData);
      return docRef.id; // Return the ID of the newly added staff member
    } catch (error) {
      console.error("Error adding staff:", error);
      return null;
    }
  };

  // Update a staff member for a specific organization
  const updateStaffInOrg = async (orgName, staffId, updatedStaffData) => {
    try {
      const staffRef = doc(db, "org", orgName, "staff", staffId);
      await updateDoc(staffRef, updatedStaffData);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Delete a staff member for a specific organization
  const deleteStaffFromOrg = async (orgName, staffId) => {
    try {
      const staffRef = doc(db, "org", orgName, "staff", staffId);
      await deleteDoc(staffRef); // remove from organization
      const userRef = doc(db, "users", staffId);
      await deleteDoc(userRef); // remove users
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Get a specific staff member for a specific organization
  const getStaffByIdAndOrg = async (orgName, staffId) => {
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
  // STAFF OF CLEARVOX
  //
  //
  // Get all staff members for clearvox
  const getClearvoxStaff = async () => {
    try {
      const staffRef = collection(db, "clearvox-staff");
      const querySnapshot = await getDocs(staffRef);
      const staff = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return staff;
    } catch (error) {
      console.error("Error getting staff:", error);
      return [];
    }
  };

  // Add a staff member to a specific organization
  const addClearvoxStaff = async (staffData) => {
    try {
      const staffRef = collection(db, "clearvox-staff");
      const docRef = await addDoc(staffRef, staffData);
      return docRef.id; // Return the ID of the newly added staff member
    } catch (error) {
      console.error("Error adding staff:", error);
      return null;
    }
  };

  // Update a staff member for a specific organization
  const updateClearvoxStaff = async (staffId, updatedStaffData) => {
    try {
      const staffRef = doc(db, "clearvox-staff", staffId);
      await updateDoc(staffRef, updatedStaffData);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  // Delete a staff member for a specific organization
  const deleteClearvoxStaff = async (staffId) => {
    try {
      const staffRef = doc(db, "clearvox-staff", staffId);
      await deleteDoc(staffRef); // remove from clearVox
      const userRef = doc(db, "users", staffId);
      await deleteDoc(userRef); // remove from users
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  // Get a specific staff member for a specific organization
  const getClearvoxStaffById = async (staffId) => {
    try {
      const staffRef = doc(db, "clearvox-staff", staffId);
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
  // CUSTOMERS
  //
  //
  // Get all customers for a specific organization
  const getCustomersByOrg = async (orgName) => {
    try {
      const customersRef = collection(db, "org", orgName, "customers");
      const querySnapshot = await getDocs(customersRef);
      const customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return customers;
    } catch (error) {
      console.error("Error getting customers:", error);
      return [];
    }
  };

  // Add a customer to a specific organization
  const addCustomerToOrg = async (orgName, customerData) => {
    try {
      const customersRef = collection(db, "org", orgName, "customers");
      const docRef = await addDoc(customersRef, customerData);
      return docRef.id; // Return the ID of the newly added customer
    } catch (error) {
      console.error("Error adding customer:", error);
      return null;
    }
  };

  // Update a customer for a specific organization
  const updateCustomerInOrg = async (
    orgName,
    customerId,
    updatedCustomerData
  ) => {
    try {
      const customerRef = doc(db, "org", orgName, "customers", customerId);
      await updateDoc(customerRef, updatedCustomerData);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete a customer for a specific organization
  const deleteCustomerFromOrg = async (orgName, customerId) => {
    try {
      const customerRef = doc(db, "org", orgName, "customers", customerId);
      await deleteDoc(customerRef); // remove from organization
      const userRef = doc(db, "users", customerId);
      await deleteDoc(userRef); // remove from users
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Get a specific customer for a specific organization
  const getCustomerByIdAndOrg = async (orgName, customerId) => {
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
  // REPORTS
  //
  //
  // Get all messages for a specific organization
  const getReport = async () => {
    try {
      const reportRef = collection(db, "messages", "reports");
      const querySnapshot = await getDocs(reportRef);
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return messages;
    } catch (error) {
      console.error("Error getting reports:", error);
      return [];
    }
  };

  // Add a message to a specific organization
  const addReport = async (reportData) => {
    try {
      const reportRef = collection(db, "messages", "reports");
      const docRef = await addDoc(reportRef, reportData);
      return docRef.id; // Return the ID of the newly added report
    } catch (error) {
      console.error("Error adding report:", error);
      return null;
    }
  };

  // Delete a message for a specific organization
  const deleteReport = async (reportId) => {
    try {
      const reportRef = doc(db, "messages", "reports", reportId);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  //
  // ENQUIRIES
  //
  //
  // Get all enquiries
  const getEnquiry = async () => {
    try {
      const enquiryRef = collection(db, "messages", "enquiries");
      const querySnapshot = await getDocs(enquiryRef);
      const enquiries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return enquiries;
    } catch (error) {
      console.error("Error getting enquiries:", error);
      return [];
    }
  };

  // Add an enquiry to the messages
  const addEnquiry = async (enquiryData) => {
    try {
      const enquiryRef = collection(db, "messages", "enquiries");
      const docRef = await addDoc(enquiryRef, enquiryData);
      return docRef.id; // Return the ID of the newly added enquiry
    } catch (error) {
      console.error("Error adding an enquiry:", error);
      return null;
    }
  };

  // Delete a message for a specific organization
  const deleteEnquiry = async (enquiryId) => {
    try {
      const enquiryRef = doc(db, "org", "enquiries", enquiryId);
      await deleteDoc(enquiryRef);
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

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
    getUsers,
    addUser,
    getUserById,
    // Organizations
    getOrganizations,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    getOrganizationNameById,
    // Tickets
    getTicketsByOrg,
    addTicketToOrg,
    updateTicketInOrg,
    deleteTicketFromOrg,
    getTicketByIdAndOrg,
    // Organization's Staff
    getStaffByOrg,
    addStaffToOrg,
    updateStaffInOrg,
    deleteStaffFromOrg,
    getStaffByIdAndOrg,
    // ClearVox Staff
    getClearvoxStaffById,
    addClearvoxStaff,
    updateClearvoxStaff,
    deleteClearvoxStaff,
    getClearvoxStaffById,
    // Organization's Customers
    getCustomersByOrg,
    addCustomerToOrg,
    updateCustomerInOrg,
    deleteCustomerFromOrg,
    getCustomerByIdAndOrg,
    // Reports
    getReport,
    addReport,
    deleteReport,
    // Enquiries
    getEnquiry,
    addEnquiry,
    deleteEnquiry,
  };
};

export { useFirebase };

import React, { createContext, useState, useEffect } from 'react';
import { useFirebase } from './UseFirebase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { signOut, getCurrentUser } = useFirebase();

  useEffect(() => {
    const unsubscribe = getCurrentUser((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

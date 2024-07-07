import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to the signing page if not logged in
    return <Navigate to="/signing" replace />; 
  }

  // Render the child component if logged in
  return <Outlet />; 
};

export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component to protect private routes
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;

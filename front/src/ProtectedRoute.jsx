// ProtectedRoute.jsx

import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ element, ...props }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Adjust based on your auth logic

  return isAuthenticated ? <Route {...props} element={element} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

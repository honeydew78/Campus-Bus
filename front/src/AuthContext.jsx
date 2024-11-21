import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log("Token being sent:", token); // Debugging token

    if (token) {
      fetch('https://campus-bus.onrender.com/api/v1/admins/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token in the Authorization header
        },
        body: JSON.stringify({ token }), // Optional redundancy
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 401) {
            logout(); // Token invalid or expired
            throw new Error("Unauthorized");
          }
        })
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
          }
        })
        .catch((error) => {
          console.error("Verification Error:", error);
          logout();
        });
    }
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

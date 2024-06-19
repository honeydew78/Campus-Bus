import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutAdmin = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/admins/logout',
          {},
          {
            withCredentials: true, // Ensures cookies are sent with the request
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          navigate('/'); // Navigate to home page after successful logout
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert(error.response?.data?.message || 'Logout failed');
      }
    };

    logoutAdmin();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <p>Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;

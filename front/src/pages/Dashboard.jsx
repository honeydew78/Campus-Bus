import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:4000/api/currentadmin', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true
        });
        setAdmin(response.data.data);
      } catch (error) {
        alert(error.response.data.message);
        navigate('/login');
      }
    };
    fetchAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {admin ? (
        <div>
          <h3>Welcome, {admin.fullName}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

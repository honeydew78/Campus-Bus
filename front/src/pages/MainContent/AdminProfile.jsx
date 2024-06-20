import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/admins/current-admin');
        setAdminData(response.data.data);
      } catch (error) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!adminData) {
    return null; // Handle case when adminData is still loading or not available
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-700">Admin Profile</h1>
        <div className="flex items-center justify-center mb-4">
          <img
            src={adminData.avatar}
            alt="Admin Avatar"
            className="rounded-full h-20 w-20 object-cover border-4 border-green-500"
          />
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username:</label>
            <p className="text-lg font-semibold text-green-700">{adminData.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <p className="text-lg font-semibold text-green-700">{adminData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name:</label>
            <p className="text-lg font-semibold text-green-700">{adminData.fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

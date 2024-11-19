import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import pro from '../../assets/images.png'

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null); // State to store new avatar file

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        };

        const response = await axios.get('http://localhost:4000/api/v1/admins/current-admin', config);
        setAdminData(response.data.data);
        setUsername(response.data.data.username);
        setEmail(response.data.data.email);
        setFullName(response.data.data.fullName);
      } catch (error) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateAvatar = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const formData = new FormData();
      formData.append('avatar', avatar);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.post('http://localhost:4000/api/v1/admins/avatar', formData, config);

      if (response.status === 200) {
        // Update adminData with new avatar URL
        setAdminData({ ...adminData, avatar: response.data.data.avatar });
      }
    } catch (error) {
      setError('Failed to update avatar');
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const data = { username, email, fullName };
      const response = await axios.patch('http://localhost:4000/api/v1/admins/update-account', data, config);

      if (response.status === 200) {
        // Update adminData with new account details
        setAdminData(response.data.data);
      }

    } catch (error) {
      setError('Failed to update account details');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const data = { currentPassword, newPassword };
      const response = await axios.patch('http://localhost:4000/api/v1/admins/update-password', data, config);

      if (response.status === 200) {
        alert('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

    } catch (error) {
      setError('Failed to update password: ' + error.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await handleUpdateAccount();
        if (currentPassword && newPassword && confirmPassword && newPassword === confirmPassword) {
          await handleUpdatePassword();
        }
      } else {
        await handleUpdateAvatar();
      }
      setIsEditing(false);
    } catch (error) {
      setError('Failed to save changes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(adminData.username);
    setEmail(adminData.email);
    setFullName(adminData.fullName);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-600">User Profile</h1>
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src = {`http://localhost:4000/${adminData.avatar}`}
            alt="Admin Avatar"
            className="rounded-full h-24 w-24 object-cover border-2 border-gray-300 mb-4"
          />
          {isEditing && (
            <div className="ml-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
                id="avatar"
              />
              <label htmlFor="avatar" className="cursor-pointer px-3 py-1 bg-green-700 text-white rounded-lg focus:outline-none">
                Choose Avatar
              </label>
              <button
                onClick={handleUpdateAvatar}
                className="ml-2 px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-blue-400 focus:outline-none"
              >
                Change Avatar
              </button>
            </div>
          )}
        </div>
        <div className="space-y-4 text-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username:</label>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{adminData.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{adminData.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-800">{adminData.fullName}</p>
            )}
          </div>
          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none text-center"
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 focus:outline-none"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 focus:outline-none mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

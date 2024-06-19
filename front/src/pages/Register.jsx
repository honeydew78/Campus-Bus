import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();
    for (let key in formData) {
      formDataWithFile.append(key, formData[key]);
    }
    try {
      const response = await axios.post('http://localhost:4000/api/v1/admins/register', formDataWithFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      avatar: null
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="file"
                name="avatar"
                onChange={handleFileChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-orange-800 focus:outline-none focus:bg-orange-800"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-orange-800 focus:outline-none focus:bg-orange-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

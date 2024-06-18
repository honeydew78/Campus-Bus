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

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="file" name="avatar" onChange={handleFileChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: null
  });

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    recaptcha: ''
  });

  const recaptchaRef = useRef(null);

  const emailRegex = /^[^\s@]+@iiita\.ac\.in$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    let error = '';
    if (name === 'email' && !emailRegex.test(value)) {
      error = 'Invalid email format';
    } else if (name === 'username' && !usernameRegex.test(value)) {
      error = 'Username must be 3-16 characters long and can only contain letters, numbers, and underscores';
    } else if (name === 'password' && !passwordRegex.test(value)) {
      error = 'Password must be at least 8 characters long and contain both letters and numbers';
    }
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleRecaptchaChange = (token) => {
    setErrors({
      ...errors,
      recaptcha: token ? '' : 'Please complete the reCAPTCHA'
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

    const token = await recaptchaRef.current.executeAsync();
    setErrors({
      ...errors,
      recaptcha: token ? '' : 'Please complete the reCAPTCHA'
    });

    if (errors.email || errors.username || errors.password || !token) {
      alert('Please fix the errors in the form and complete reCAPTCHA');
      return;
    }

    const formDataWithFile = new FormData();
    for (let key in formData) {
      formDataWithFile.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/admins/register', formDataWithFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: {
          recaptchaToken: token // Send the reCAPTCHA token as a query parameter
        }
      });
      alert(response.data.message);
      navigate('/login');
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
    setErrors({
      email: '',
      username: '',
      password: '',
      recaptcha: ''
    });
    recaptchaRef.current.reset();
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
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
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
              {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
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
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
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
            <div>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Le6zP4pAAAAAGRLXQczs0i35H7VBVfaU-jZ_jfN" // Replace with your reCAPTCHA v3 site key
                size="invisible"
                onChange={handleRecaptchaChange}
              />
              {errors.recaptcha && <span className="text-red-500 text-sm">{errors.recaptcha}</span>}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
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

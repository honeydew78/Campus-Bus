import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
// import useAuth from './AuthContext';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    recaptcha: ''
  });
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const emailRegex = /^[^\s@]+@iiita\.ac\.in$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate input
    let error = '';
    if (name === 'email' && !emailRegex.test(value)) {
      error = 'Invalid email format';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Execute reCAPTCHA
    const token = await recaptchaRef.current.executeAsync();
    setErrors({
      ...errors,
      recaptcha: token ? '' : 'Please complete the reCAPTCHA'
    });

    // Check if there are any errors
    if (errors.email || errors.password || !token) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/admins/login', {
        ...formData,
        recaptchaToken: token // Include the reCAPTCHA token in the payload
      }, {
        withCredentials: true, // Ensures that cookies are sent with the request
      });
      const { accessToken, refreshToken } = response.data.data;
      
      // Use the login function from AuthProvider
      login(accessToken, refreshToken);

      // Redirect to the admin home page
      navigate('/home-admin');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({
      email: '',
      password: '',
      recaptcha: ''
    });
    recaptchaRef.current.reset();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-400"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
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

export default Login;

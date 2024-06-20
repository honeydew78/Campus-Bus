import React, { useState } from 'react';
import axios from 'axios';

const RegisterNewTrainee = () => {
  const [formData, setFormData] = useState({
    applicationId: '',
    fullName: '',
    fatherName: '',
    dob: '',
    aadhar: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    institute: '',
    branch: '',
    establishment: '',
    timeOfJoin: ''
  });

  const [avatar, setAvatar] = useState(null);
  const [charCertificate, setCharCertificate] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    aadhar: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'aadhar') {
      const aadharRegex = /^\d{12}$/;
      setFieldErrors({
        ...fieldErrors,
        aadhar: aadharRegex.test(value) ? '' : 'Invalid Aadhar number. It must be a 12-digit number.'
      });
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFieldErrors({
        ...fieldErrors,
        email: emailRegex.test(value) ? '' : 'Invalid email format.'
      });
    } else if (name === 'phone') {
      const phoneRegex = /^\d{10}$/;
      setFieldErrors({
        ...fieldErrors,
        phone: phoneRegex.test(value) ? '' : 'Invalid phone number. It must be a 10-digit number.'
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'avatar') setAvatar(e.target.files[0]);
    if (e.target.name === 'charCertificate') setCharCertificate(e.target.files[0]);
    if (e.target.name === 'resume') setResume(e.target.files[0]);
  };

  const validateInputs = () => {
    if (fieldErrors.aadhar || fieldErrors.email || fieldErrors.phone) {
      setError('Please correct the errors before submitting.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInputs()) {
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (avatar) data.append('avatar', avatar);
    if (charCertificate) data.append('charCertificate', charCertificate);
    if (resume) data.append('resume', resume);

    try {
      const response = await axios.post('http://localhost:4000/api/v1/newTrainees/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(response.data.message || 'New Trainee registered successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-700">Register New Trainee</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-700 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="applicationId" placeholder="Application ID" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <label className="block">
            <span className="text-gray-700">Date of Birth</span>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </label>
          <input type="text" name="aadhar" placeholder="Aadhar" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          {fieldErrors.aadhar && <p className="text-red-500 text-sm">{fieldErrors.aadhar}</p>}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
          <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          {fieldErrors.phone && <p className="text-red-500 text-sm">{fieldErrors.phone}</p>}
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="institute" placeholder="Institute" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="branch" placeholder="Branch" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input type="text" name="establishment" placeholder="Establishment" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" />
          <select name="timeOfJoin" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700">
            <option value="">Select Time of Join</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
          <label className="block">
            <span className="text-gray-700">Avatar</span>
            <input type="file" name="avatar" onChange={handleFileChange}  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-800 hover:file:bg-green-100" required />
          </label>
          <label className="block">
            <span className="text-gray-700">Character Certificate</span>
            <input type="file" name="charCertificate" onChange={handleFileChange} required className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-800 hover:file:bg-green-100" />
          </label>
          <label className="block">
            <span className="text-gray-700">Resume</span>
            <input type="file" name="resume" onChange={handleFileChange} required className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700
            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-800 hover:file:bg-green-100" />
          </label>
          <button type="submit" className="w-full bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterNewTrainee;

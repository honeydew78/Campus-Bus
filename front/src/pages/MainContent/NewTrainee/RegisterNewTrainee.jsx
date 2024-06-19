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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'avatar') setAvatar(e.target.files[0]);
    if (e.target.name === 'charCertificate') setCharCertificate(e.target.files[0]);
    if (e.target.name === 'resume') setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        <h1 className="text-2xl font-bold text-center mb-4 text-orange-500">Register New Trainee</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="applicationId" placeholder="Application ID" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="dob" placeholder="Date of Birth" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="aadhar" placeholder="Aadhar" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="city" placeholder="City" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="institute" placeholder="Institute" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="branch" placeholder="Branch" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="establishment" placeholder="Establishment" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="text" name="timeOfJoin" placeholder="Time of Join" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input type="file" name="avatar" onChange={handleFileChange} required className="w-full px-4 py-2" />
          <input type="file" name="charCertificate" onChange={handleFileChange} required className="w-full px-4 py-2" />
          <input type="file" name="resume" onChange={handleFileChange} required className="w-full px-4 py-2" />
          <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterNewTrainee;

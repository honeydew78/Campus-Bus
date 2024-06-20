import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ConvertToCurrentTraineeForm = () => {
  const { id } = useParams(); // Get the id parameter from the route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cgpa: '',
    yearOfStudy: '',
    traineePeriod: '',
    mentor: '',
    department: '',
    topicOfPursue: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => { 
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/api/v1/newTrainees/${id}/convert-to-current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to convert to current trainee');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      navigate(`/home-admin/home-current-trainees/${data.data._id}`);
    } catch (error) {
      console.error('Error converting to current trainee:', error);
      // Handle error here (e.g., display error message)
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Convert to Current Trainee</h2>
        {successMessage && <p className="text-green-700 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block mb-2">CGPA:</label>
            <input
              type="text"
              name="cgpa"
              placeholder="Enter CGPA"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Year of Study:</label>
            <input
              type="number"
              name="yearOfStudy"
              placeholder="Enter Year of Study"
              value={formData.yearOfStudy}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Trainee Period:</label>
            <input
              type="text"
              name="traineePeriod"
              placeholder="Enter Trainee Period"
              value={formData.traineePeriod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Mentor:</label>
            <input
              type="text"
              name="mentor"
              placeholder="Enter Mentor"
              value={formData.mentor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Department:</label>
            <input
              type="text"
              name="department"
              placeholder="Enter Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Topic of Pursue:</label>
            <input
              type="text"
              name="topicOfPursue"
              placeholder="Enter Topic of Pursue"
              value={formData.topicOfPursue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700  transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded focus:outline-none focus:bg-green-900"
          >
            Convert to Current Trainee
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConvertToCurrentTraineeForm;

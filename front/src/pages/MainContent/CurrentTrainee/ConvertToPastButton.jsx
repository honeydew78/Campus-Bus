import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ConvertToPastTraineeForm = () => {
  const { id } = useParams(); // Get the id parameter from the route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    endDate: ''
  });
  const [workReport, setWorkReport] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setWorkReport(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('endDate', formData.endDate);
    if (workReport) {
      formDataToSend.append('workReport', workReport);
    } else {
      setErrorMessage('Work Report file is required');
      return; // Exit early if no work report file is selected
    }

    try {
      const response = await fetch(`http://localhost:4000/api/v1/currentTrainees/${id}/convert-to-past`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to convert to past trainee');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      navigate(`/home-admin/home-past-trainees/${data.data._id}`);
    } catch (error) {
      console.error('Error converting to past trainee:', error);
      setErrorMessage('Failed to convert to past trainee');
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
        <h2 className="text-2xl font-bold mb-4">Convert to Past Trainee</h2>
        {successMessage && <p className="text-green-700 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-700 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

          <div className="mb-4">
            <label className="block mb-2">End Date:</label>
            <input
              type="text"
              name="endDate"
              placeholder="Enter End Date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700  transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Work Report (PDF):</label>
            <input
              type="file"
              name="workReport"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-700 transition duration-300 hover:border-green-900"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded focus:outline-none focus:bg-green-900"
          >
            Convert to Past Trainee
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConvertToPastTraineeForm;

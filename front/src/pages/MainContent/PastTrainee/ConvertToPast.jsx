import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConvertToPastTraineeForm = () => {
  const [formData, setFormData] = useState({
    applicationId: '',
    email: '',
    endDate: '',
    workReport: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    // Email validation using regex
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Invalid email format.');
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('applicationId', formData.applicationId);
    data.append('email', formData.email);
    data.append('endDate', formData.endDate);
    data.append('workReport', formData.workReport);

    try {
      const response = await fetch('http://localhost:4000/api/v1/pastTrainees/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred');
      }

      navigate(`/home-admin/home-past-trainees/${result.data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Convert to Past Trainee</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700">Application ID</label>
            <input
              type="text"
              id="applicationId"
              name="applicationId"
              value={formData.applicationId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${error ? 'border-red-500' : ''}`}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workReport" className="block text-sm font-medium text-gray-700">Work Report</label>
            <input
              type="file"
              id="workReport"
              name="workReport"
              onChange={handleChange}
              className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-800 hover:file:bg-green-100"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConvertToPastTraineeForm;

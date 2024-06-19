import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
  const [email, setEmail] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/newTrainees/find-new-trainee', { email, applicationId });
      const traineeId = response.data.data._id;
      setError('');
      navigate(`/home-admin/home-new-trainees/${traineeId}`);
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-white p-6 max-w-md mx-auto rounded shadow-lg">
      <h1 className="text-2xl mb-4 text-center text-green-800">Find New Trainee</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Application ID:</label>
          <input
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-green-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default InputPage;

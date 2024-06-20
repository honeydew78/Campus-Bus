import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TraineesByBranch = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraineesByBranch = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/pastTrainees/stats/count-by-branch');
        setTrainees(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };

    fetchTraineesByBranch();
  }, []);

  if (loading) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-green-800 text-center mb-8">Trainees Count by Branch</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainees.map((branch) => (
          <div key={branch.branch} className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{branch.branch}</h2>
            <p className="text-gray-700 mb-4">Count: {branch.count}</p>
            <ul className="list-disc list-inside text-green-600">
              {branch.trainees.map((traineeDetail) => (
                <li key={traineeDetail.id}>
                  <a href={`/home-admin/home-past-trainees/${traineeDetail.id}`} className="text-green-600 hover:underline">
                    {traineeDetail.fullName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraineesByBranch;

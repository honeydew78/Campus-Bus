import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TraineesByCity = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraineesByCity = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/newTrainees/stats/count-by-city');
        setTrainees(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };

    fetchTraineesByCity();
  }, []);

  if (loading) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-8">Trainees Count by City</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainees.map((trainee) => (
          <div key={trainee.city} className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">{trainee.city}</h2>
            <p className="text-green-700 mb-4">Count: {trainee.count}</p>
            <ul className="list-disc list-inside text-green-600">
              {trainee.trainees.map((traineeDetail) => (
                <li key={traineeDetail.id}>
                  <a href={`/home-admin/home-new-trainees/${traineeDetail.id}`} className="text-blue-500 hover:underline">
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

export default TraineesByCity;

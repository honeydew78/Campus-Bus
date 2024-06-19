import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TraineesByInstitute = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraineesByInstitute = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/newTrainees/stats/count-by-institute');
        setTrainees(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };

    fetchTraineesByInstitute();
  }, []);

  if (loading) {
    return <p className="text-center text-orange-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">Trainees Count by Institute</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainees.map((trainee) => (
          <div key={trainee.institute} className="bg-orange-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">{trainee.institute}</h2>
            <p className="text-orange-700 mb-4">Count: {trainee.count}</p>
            <ul className="list-disc list-inside text-orange-600">
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

export default TraineesByInstitute;

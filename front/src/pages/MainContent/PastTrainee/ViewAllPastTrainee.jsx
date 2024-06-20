import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PastTraineesList = () => {
  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/pastTrainees');
        if (!response.ok) {
          throw new Error('Failed to fetch trainees');
        }
        const data = await response.json();
        setTrainees(data.data); // assuming the list is under `data.data`
        setFilteredTrainees(data.data); // initially set filtered trainees to all trainees
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, []);

  useEffect(() => {
    const results = trainees.filter(trainee =>
      trainee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainees(results);
  }, [searchTerm, trainees]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <div className="p-4 rounded shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">List of Past Trainees</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        {filteredTrainees.length === 0 ? (
          <p>No Past trainees found</p>
        ) : (
          <ul className="space-y-2">
            {filteredTrainees.map((trainee) => (
              <li key={trainee._id} className="p-2 border border-gray-300 rounded">
                <Link to={`/home-admin/home-past-trainees/${trainee._id}`} className="text-sm text-green-700 hover:underline">
                  {trainee.fullName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PastTraineesList;

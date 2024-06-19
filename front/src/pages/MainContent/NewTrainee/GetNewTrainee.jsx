import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GetNewTrainee = () => {
  const { id } = useParams();
  const [trainee, setTrainee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/newTrainees/${id}`);
        setTrainee(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchTrainee();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;

  if (!trainee) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white p-6 max-w-md mx-auto rounded shadow-lg">
      <div className="text-center mb-4">
        <img src={trainee.avatar} alt="avatar" className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
        <h1 className="text-2xl">{trainee.fullName}</h1>
        <p className="text-gray-600">{trainee.email}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Father's Name:</p>
          <p>{trainee.fatherName}</p>
          <p className="font-bold">Date of Birth:</p>
          <p>{trainee.dob}</p>
          <p className="font-bold">Phone:</p>
          <p>{trainee.phone}</p>
          <p className="font-bold">City:</p>
          <p>{trainee.city}</p>
          <p className="font-bold">Branch:</p>
          <p>{trainee.branch}</p>
          <p className="font-bold">Time of Join:</p>
          <p>{trainee.timeOfJoin}</p>
        </div>
        <div>
          <p className="font-bold">Address:</p>
          <p>{trainee.address}</p>
          <p className="font-bold">Institute:</p>
          <p>{trainee.institute}</p>
          <p className="font-bold">Establishment:</p>
          <p>{trainee.establishment}</p>
          <p className="font-bold">Resume:</p>
          <p><a href={trainee.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Resume</a></p>
          <p className="font-bold">Character Certificate:</p>
          <p><a href={trainee.charCertificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Certificate</a></p>
        </div>
      </div>
    </div>
  );
};

export default GetNewTrainee;

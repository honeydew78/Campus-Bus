import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonBar = () => {
  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate('/home-admin');
  };

  const handleButtonClick2 = () => {
    navigate('/home-admin/home-new-trainees/register');
  };

  const handleButtonClick3 = () => {
    navigate('/home-admin/home-new-trainees/find-new-trainee');
  };

  const handleButtonClick4 = () => {
    navigate('/home-admin/home-new-trainees/select-field');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex space-x-4 p-4">
        <button
          onClick={handleButtonClick1}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-6 rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          View All Current Trainees
        </button>
        <button
          onClick={handleButtonClick2}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-6 rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Register Current Trainee
        </button>
        <button
          onClick={handleButtonClick3}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-6 rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Find Current Trainee
        </button>
        <button
          onClick={handleButtonClick4}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-6 rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Select Current Trainees by Fields
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;

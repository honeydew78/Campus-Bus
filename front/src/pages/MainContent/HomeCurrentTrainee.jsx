import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonBar = () => {
  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate('/home-admin/home-current-trainees/view-all');
  };

  const handleButtonClick2 = () => {
    navigate('/home-admin/home-current-trainees/convert');
  };

  const handleButtonClick3 = () => {
    navigate('/home-admin/home-current-trainees/find-current-trainee');
  };

  const handleButtonClick4 = () => {
    navigate('/home-admin/home-current-trainees/select-field');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex flex-col items-center p-4 bg-gray-200 bg-opacity-50 rounded-lg shadow-lg">
        <button
          onClick={handleButtonClick1}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-6 rounded-md shadow-lg mb-3 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          View All Trainees
        </button>
        <button
          onClick={handleButtonClick2}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-6 rounded-md shadow-lg mb-3 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Convert New To Current Trainee
        </button>
        <button
          onClick={handleButtonClick3}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-6 rounded-md shadow-lg mb-3 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Find Current Trainee
        </button>
        <button
          onClick={handleButtonClick4}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-6 rounded-md shadow-lg mb-3 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Select Trainees by Fields
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;

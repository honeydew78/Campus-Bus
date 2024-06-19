import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonBar = () => {
  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate('/home-admin/home-new-trainees/select-field/by-institute');
  };

  const handleButtonClick2 = () => {
    navigate('/home-admin/home-new-trainees/select-field/by-branch');
  };

  const handleButtonClick3 = () => {
    navigate('/home-admin/home-new-trainees/select-field/by-season');
  };

  const handleButtonClick4 = () => {
    navigate('/home-admin/home-new-trainees/select-field/by-establishment');
  };

  const handleButtonClick5 = () => {
    navigate('/home-admin/home-new-trainees/select-field/by-city');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex flex-col items-center p-4 bg-gray-200 bg-opacity-50 rounded-lg shadow-lg">
        <button
          onClick={handleButtonClick1}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-md shadow-lg mb-2 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Search By Institute
        </button>
        <button
          onClick={handleButtonClick2}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-md shadow-lg mb-2 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Search By Branch
        </button>
        <button
          onClick={handleButtonClick3}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-md shadow-lg mb-2 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Search By Winter or Summer
        </button>
        <button
          onClick={handleButtonClick4}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-md shadow-lg mb-2 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Search By Establishment
        </button>
        <button
          onClick={handleButtonClick5}
          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-md shadow-lg mb-2 transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-600 font-bold"
        >
          Search By City
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;

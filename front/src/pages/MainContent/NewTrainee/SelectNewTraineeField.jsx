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
      <div className="flex space-x-4 p-4 rounded-full" style={{ backgroundColor: 'rgba(169, 169, 169, 0.5)' }}>
        <button
          onClick={handleButtonClick1}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
         Search By Institute
        </button>
        <button
          onClick={handleButtonClick2}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
         Search By Branch
        </button>
        <button
          onClick={handleButtonClick3}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          Search By Winter or Summer
        </button>
        <button
          onClick={handleButtonClick4}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
         Search By Establishment
        </button>
        <button
          onClick={handleButtonClick5}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
         Search By City
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;

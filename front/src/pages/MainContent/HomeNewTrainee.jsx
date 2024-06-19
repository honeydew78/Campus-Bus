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
    navigate('/home-admin');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex space-x-4 p-4 rounded-full" style={{ backgroundColor: 'rgba(169, 169, 169, 0.5)' }}>
        <button
          onClick={handleButtonClick1}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          View All New Trainees
        </button>
        <button
          onClick={handleButtonClick2}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          Register New Trainee
        </button>
        <button
          onClick={handleButtonClick3}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          Find New Trainee
        </button>
        <button
          onClick={handleButtonClick4}
          className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
        >
          Select New Trainees by Fields
        </button>
      </div>
    </div>
  );
};

export default ButtonBar;

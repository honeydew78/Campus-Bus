import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GetNewTrainee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [editedData, setEditedData] = useState({
    fullName: '',
    fatherName: '',
    dob: '',
    aadhar: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    institute: '',
    branch: '',
    establishment: '',
    timeOfJoin: '',
  });
  const [newAvatar, setNewAvatar] = useState(null); // State to store new avatar file
  const [newResume, setNewResume] = useState(null); // State to store new resume file
  const [newCharCertificate, setNewCharCertificate] = useState(null); // State to store new character certificate file

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/newTrainees/${id}`);
        setTrainee(response.data.data);
        setEditedData(response.data.data); // Initialize editedData with fetched data
        setError('');
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchTrainee();
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.patch(`http://localhost:4000/api/v1/newTrainees/${id}/update`, editedData);
      setTrainee(response.data.data);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      if (window.confirm(`Are you sure you want to delete ${trainee.fullName}?`)) {
        await axios.delete(`http://localhost:4000/api/v1/newTrainees/${id}/delete`);
        navigate('/home-admin/home-new-trainees'); // Navigate to the homepage or another appropriate page after deletion
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleAvatarChange = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('avatar', newAvatar);

      const response = await axios.post(`http://localhost:4000/api/v1/newTrainees/${id}/update-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTrainee(response.data.data); // Update trainee state with new avatar data
      setNewAvatar(null); // Clear newAvatar state after upload
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleResumeChange = (e) => {
    setNewResume(e.target.files[0]);
  };

  const handleResumeUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('resume', newResume);

      const response = await axios.post(`http://localhost:4000/api/v1/newTrainees/${id}/update-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTrainee(response.data.data); // Update trainee state with new resume data
      setNewResume(null); // Clear newResume state after upload
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleCharCertificateChange = (e) => {
    setNewCharCertificate(e.target.files[0]);
  };

  const handleCharCertificateUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('charCertificate', newCharCertificate);

      const response = await axios.post(`http://localhost:4000/api/v1/newTrainees/${id}/update-char-cert`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTrainee(response.data.data); // Update trainee state with new char certificate data
      setNewCharCertificate(null); // Clear newCharCertificate state after upload
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  if (error) return <p className="text-red-500">{error}</p>;

  if (!trainee) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white p-6 max-w-md mx-auto rounded shadow-lg">
      <div className="text-center mb-4">
        <img src={trainee.avatar} alt="avatar" className="w-24 h-24 object-cover rounded-full mx-auto mb-2 cursor-pointer" />
        {editMode && (
          <>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" />
            <button onClick={handleAvatarUpload} className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 ml-2">Upload Avatar</button>
          </>
        )}
        <h1 className="text-2xl">{trainee.fullName}</h1>
        <p className="text-gray-600">{trainee.email}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-bold">Father's Name:</p>
          {editMode ? (
            <input type="text" name="fatherName" value={editedData.fatherName} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.fatherName}</p>
          )}
          <p className="font-bold">Date of Birth:</p>
          {editMode ? (
            <input type="text" name="dob" value={editedData.dob} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.dob}</p>
          )}
          <p className="font-bold">Phone:</p>
          {editMode ? (
            <input type="text" name="phone" value={editedData.phone} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.phone}</p>
          )}
          <p className="font-bold">City:</p>
          {editMode ? (
            <input type="text" name="city" value={editedData.city} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.city}</p>
          )}
          <p className="font-bold">Branch:</p>
          {editMode ? (
            <input type="text" name="branch" value={editedData.branch} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.branch}</p>
          )}
          <p className="font-bold">Time of Join:</p>
          {editMode ? (
            <input type="text" name="timeOfJoin" value={editedData.timeOfJoin} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.timeOfJoin}</p>
          )}
        </div>
        <div>
          <p className="font-bold">Address:</p>
          {editMode ? (
            <textarea name="address" value={editedData.address} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.address}</p>
          )}
          <p className="font-bold">Institute:</p>
          {editMode ? (
            <input type="text" name="institute" value={editedData.institute} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.institute}</p>
          )}
          <p className="font-bold">Establishment:</p>
          {editMode ? (
            <input type="text" name="establishment" value={editedData.establishment} onChange={handleChange} className="border rounded p-1 mb-2 w-full" />
          ) : (
            <p>{trainee.establishment}</p>
          )}
          <p className="font-bold">Resume:</p>
          {editMode ? (
            <>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="mb-2" />
              <button onClick={handleResumeUpload} className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 ml-2">Upload Resume</button>
            </>
          ) : (
            <p><a href={trainee.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Resume</a></p>
          )}
          <p className="font-bold">Character Certificate:</p>
          {editMode ? (
            <>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCharCertificateChange} className="mb-2" />
              <button onClick={handleCharCertificateUpload} className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 ml-2">Upload Certificate</button>
            </>
          ) : (
            <p><a href={trainee.charCertificate} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Certificate</a></p>
          )}
        </div>
      </div>
      {editMode && (
        <div className="text-center mt-4">
          <button onClick={handleSaveClick} className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 mr-2">Save</button>
          <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Cancel</button>
        </div>
      )}
      {!editMode && (
        <div className="text-center mt-4">
          <button onClick={handleEditClick} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Edit</button>
          <button onClick={handleDeleteClick} className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 ml-2">Delete Trainee</button>
        </div>
      )}
    </div>
  );
};

export default GetNewTrainee;

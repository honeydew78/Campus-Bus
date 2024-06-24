import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const GetNewTrainee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newAvatar, setNewAvatar] = useState(null);
  const [newResume, setNewResume] = useState(null);
  const [newCharCertificate, setNewCharCertificate] = useState(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/newTrainees/${id}`);
        setTrainee(response.data.data);
        setEditedData(response.data.data); // Initialize editedData with fetched data
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
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
      setTrainee(response.data.data); // Update trainee state with the updated data
      setEditMode(false); // Exit edit mode
      setUploadSuccessMessage('Trainee details updated successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteClick = async () => {
    try {
      if (window.confirm(`Are you sure you want to delete ${trainee.fullName}?`)) {
        await axios.delete(`http://localhost:4000/api/v1/newTrainees/${id}/delete`);
        navigate('/home-admin/home-new-trainees');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleConvertClick = () => {
    navigate(`/home-admin/home-new-trainees/${id}/convert`);
  };

  const handleFileChange = (file, setState) => {
    setState(file);
  };

  const handleFileUpload = async (file, endpoint) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append(endpoint, file);

      const response = await axios.post(
        `http://localhost:4000/api/v1/newTrainees/${id}/update-${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setTrainee(response.data.data); // Update trainee state with the updated data
      if (endpoint === 'avatar') {
        setNewAvatar(null);
      } else if (endpoint === 'resume') {
        setNewResume(null);
      } else if (endpoint === 'charCertificate') {
        setNewCharCertificate(null);
      }
      setUploadSuccessMessage(`Successfully updated ${endpoint === 'charCertificate' ? 'Certificate' : endpoint}!`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!trainee) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white p-6 max-w-md mx-auto rounded shadow-lg">
      {uploadSuccessMessage && <p className="text-green-500">{uploadSuccessMessage}</p>}
      <div className="text-center mb-4">
        <img
          src={`http://localhost:4000/${trainee.avatar}`}
          alt="avatar"
          className="w-24 h-24 object-cover rounded-full mx-auto mb-2 cursor-pointer"
        />
        {editMode && (
          <>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0], setNewAvatar)} className="mb-2" />
            <button onClick={() => handleFileUpload(newAvatar, 'avatar')} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-800 ml-2">Upload Avatar</button>
          </>
        )}
        <h1 className="text-2xl">{trainee.fullName}</h1>
        <p className="text-gray-600">{trainee.email}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <RenderField label="Application ID" value={trainee.applicationId} name="applicationId" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Father's Name" value={trainee.fatherName} name="fatherName" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Date of Birth" value={trainee.dob} name="dob" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Phone" value={trainee.phone} name="phone" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="City" value={trainee.city} name="city" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Branch" value={trainee.branch} name="branch" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Time of Join" value={trainee.timeOfJoin} name="timeOfJoin" editMode={editMode} onChange={handleChange} editedData={editedData} />
        </div>
        <div>
          <RenderField label="Address" value={trainee.address} name="address" editMode={editMode} onChange={handleChange} textarea editedData={editedData} />
          <RenderField label="Institute" value={trainee.institute} name="institute" editMode={editMode} onChange={handleChange} editedData={editedData} />
          <RenderField label="Establishment" value={trainee.establishment} name="establishment" editMode={editMode} onChange={handleChange} editedData={editedData} />
          {editMode ? (
            <>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e.target.files[0], setNewResume)} className="mb-2" />
              <button onClick={() => handleFileUpload(newResume, 'resume')} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-800 ml-2">Upload Resume</button>
            </>
          ) : (
            <p>
              <a
                href={`http://localhost:4000/${trainee.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                View Resume
              </a>
            </p>
          )}
          {editMode ? (
            <>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e.target.files[0], setNewCharCertificate)} className="mb-2" />
              <button onClick={() => handleFileUpload(newCharCertificate, 'charCertificate')} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-800 ml-2">Upload Certificate</button>
            </>
          ) : (
            <p>
              <a
                href={`http://localhost:4000/${trainee.charCertificate}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                View Certificate
              </a>
            </p>
          )}
        </div>
      </div>
      {editMode ? (
        <div className="text-center mt-4">
          <button onClick={handleSaveClick} className="bg-green-700 text-white rounded px-3 py-1 hover:bg-green-800 mr-2">Save</button>
          <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Cancel</button>
        </div>
      ) : (
        <div className="text-center mt-4">
          <button onClick={handleEditClick} className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600">Edit</button>
          <button onClick={handleConvertClick} className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 mr-2">Convert</button>
          <button onClick={handleDeleteClick} className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600">Delete</button>
        </div>
      )}
    </div>
  );
};

const RenderField = ({ label, value, name, editMode, onChange, textarea, editedData }) => {
  return (
    <>
      <p className="font-bold">{label}:</p>
      {editMode ? (
        textarea ? (
          <textarea name={name} value={editedData[name] || ''} onChange={onChange} className="border rounded p-1 mb-2 w-full" />
        ) : (
          <input
            type="text"
            name={name}
            value={editedData[name] || ''}
            onChange={onChange}
            className="border rounded p-1 mb-2 w-full"
          />
        )
      ) : (
        <p>{value}</p>
      )}
    </>
  );
};

export default GetNewTrainee;

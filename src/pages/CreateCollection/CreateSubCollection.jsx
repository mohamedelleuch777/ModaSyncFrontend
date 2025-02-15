import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { put, post, useApi } from '../../hooks/apiHooks';
import { API_BASE_URL } from '../../constants';

const CreateSubCollection = () => {
  const navigate = useNavigate();
  const apiFetch = useApi();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  async function uploadPicture() {
    const token = localStorage.getItem('token');
    
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    if (!image) return null;
    formdata.append("picture", image, image.name);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    try {
      const response = await fetch(API_BASE_URL + "/api/pictures/upload", requestOptions);
      return await response.json();
    } catch (error) {
      console.error('error', error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = await uploadPicture();
    if (!data) {
      setError('Failed to upload image');
      return;
    }

    const imageUrl = data.fileUrl;
    const collectionId = localStorage.selectedCollectionId || -1;
    const data2 = await post(apiFetch, '/api/subCollections', {
      collectionId: parseInt(collectionId), // Ensure it's a number
      name,
      description,
      imageUrl
    });

    if (data2.error) {
      setError(data2.error);
    } else {
      alert("SubCollection created successfully!");
      navigate('/');
    }
  };

  return (
    <div className="create-collection-container">
      <div className="create-collection-card">
        <h2 className="create-collection-title">Create New SubCollection</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="create-collection-form">
          {/* <div className="form-group">
            <input
              type="number"
              className="form-input"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              placeholder='Collection ID'
              required
            />
          </div> */}
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='SubCollection Name'
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description'
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              className="form-input"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <button type="submit" className="create-collection-button">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubCollection;

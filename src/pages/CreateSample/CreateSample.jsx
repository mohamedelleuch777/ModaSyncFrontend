import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, useApi } from '../../hooks/apiHooks';
import { API_BASE_URL, messageBox } from '../../constants';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateSample = ({ selectedSubCollectionName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiFetch = useApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      const response = await fetch(API_BASE_URL + "/pictures/upload", requestOptions);
      return await response.json();
    } catch (error) {
      console.error('error', error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setIsLoading(true);
    const data = await uploadPicture();
    if (!data) {
      setError('Failed to upload image');
      setIsLoading(false);
      return;
    }
    
    const imageUrl = data.fileUrl;
    
    const data2 = await post(apiFetch, '/samples', {
      subcollectionId: selectedSubCollectionName,
      name,
      imageUrl
    });
    setIsLoading(false);

    if (data2.error) {
      setError(data2.error);
    } else {
      messageBox("Sample created successfully!");
      navigate(-1);
    }
  };

  return (
    <div className="create-sample-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="create-sample-card">
        <h2 className="create-sample-title">Create New Sample</h2>
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit} className="create-sample-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sample Name"
              required
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
          <button type="submit" className="create-sample-button">
            {isLoading ? <LoadingSpinner /> : 'Create Sample'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSample;

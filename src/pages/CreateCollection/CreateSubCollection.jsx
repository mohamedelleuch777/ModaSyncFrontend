import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, useApi } from '../../hooks/apiHooks';
import { API_BASE_URL, messageBox } from '../../constants';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateSubCollection = () => {
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
    const collectionId = localStorage.selectedCollectionId || -1;

    const data2 = await post(apiFetch, '/subCollections', {
      collectionId: parseInt(collectionId), // Ensure it's a number
      name,
      description,
      imageUrl
    });
    setIsLoading(false);

    if (data2.error) {
      setError(data2.error);
    } else {
      const data3 = await get(apiFetch, '/collections/' + collectionId, {});
      console.log(data3)
      messageBox("SubCollection created successfully!");
      navigate('/', { state: { selectedCollection: data3 } });
    }
  };

  return (
    <div className="create-collection-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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
          <button type="submit" className="create-collection-button">
            {isLoading ? <LoadingSpinner /> : 'Create SubCollection'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubCollection;

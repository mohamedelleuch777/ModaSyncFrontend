import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { post, useApi } from '../../hooks/apiHooks';
import { API_BASE_URL, messageBox } from '../../constants';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddImageToSample = () => {
  const { state: { selectedSample } } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiFetch = useApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [name, setName] = useState('');
  // const [description, setDescription] = useState('');
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
    
    setIsLoading(true);

    const data = await uploadPicture();
    if (!data) {
      setError('Failed to upload image');
      setIsLoading(false);
      return;
    }
    
    const title = "image-" + Math.random().toString(36).substring(3, 13);
    const imageUrl = data.fileUrl;
    const imagePath = data.filePath;
    
    
    const data2 = await post(apiFetch, `/api/pictures/${selectedSample.id}`, {
      title,
      imagePath,
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

  React.useEffect(() => {
    // console.log("selectedSample", selectedSample);
  },[])

  return (
    <div className="create-sample-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="create-sample-card">
        <h2 className="create-sample-title">Add Image To Sample</h2>
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit} className="create-sample-form">
          {/* <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sample Name"
              required
            />
          </div> */}
          <div className="form-group">
            <input
              type="file"
              className="form-input"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <button type="submit" className="create-sample-button">
            {isLoading ? <LoadingSpinner /> : 'Add Image To Sample'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddImageToSample;

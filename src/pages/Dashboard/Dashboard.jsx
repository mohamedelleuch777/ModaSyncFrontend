// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import CollectionsStory from '../../components/CollectionsStory';

const SERVER_URL = 'http://localhost:9613';

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [subcollections, setSubcollections] = useState([]);
  const [samples, setSamples] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedSubcollection, setSelectedSubcollection] = useState(null);

  const navigate = useNavigate();

  // Load collections when the component mounts.
  useEffect(() => {
    fetchCollections();
  }, []);

 // Fetch collections with token authentication.
const fetchCollections = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${SERVER_URL}/api/collections`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      throw new Error('Failed to fetch collections');
    }
    const data = await response.json();
    setCollections(data);
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
};

// Fetch subcollections for a specific collection with token authentication.
const fetchSubcollections = async (collectionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${SERVER_URL}/api/subCollections/${collectionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch subcollections');
    }
    const data = await response.json();
    setSubcollections(data);
  } catch (error) {
    console.error('Error fetching subcollections:', error);
  }
};

// Fetch samples for a specific subcollection with token authentication.
const fetchSamples = async (subcollectionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${SERVER_URL}/api/samples/${subcollectionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch samples');
    }
    const data = await response.json();
    setSamples(data);
  } catch (error) {
    console.error('Error fetching samples:', error);
  }
};

  // When a collection is clicked, load its subcollections.
  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setSelectedSubcollection(null);
    setSamples([]);
    fetchSubcollections(collection.id);
  };

  // When a subcollection is clicked, load its samples.
  const handleSubcollectionClick = (subcollection) => {
    setSelectedSubcollection(subcollection);
    fetchSamples(subcollection.id);
  };

  return (
    <div className="dashboard-container">
      <Topbar />
      <input className='dashboard-search' type="search" placeholder="Search" />
      <CollectionsStory />
      {
        false && (
          <>
            <div className="dashboard-panel">
              <ul>
                {collections.map((collection) => (
                  <li
                    key={collection.id}
                    className={`dashboard-item ${selectedCollection && selectedCollection.id === collection.id ? 'selected' : ''}`}
                    onClick={() => handleCollectionClick(collection)}
                  >
                    {collection.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-panel">
              <h2>Sub-Collections</h2>
              {selectedCollection ? (
                <ul>
                  {subcollections.map((subcollection) => (
                    <li
                      key={subcollection.id}
                      className={`dashboard-item ${selectedSubcollection && selectedSubcollection.id === subcollection.id ? 'selected' : ''}`}
                      onClick={() => handleSubcollectionClick(subcollection)}
                    >
                      {subcollection.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Please select a collection.</p>
              )}
            </div>
            <div className="dashboard-panel">
              <h2>Samples</h2>
              {selectedSubcollection ? (
                <ul>
                  {samples.map((sample) => (
                    <li key={sample.id} className="dashboard-item">
                      {sample.name || `Sample ${sample.id}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Please select a sub-collection.</p>
              )}
            </div>
          </>
        )
      }
    </div>
  );
};

export default Dashboard;

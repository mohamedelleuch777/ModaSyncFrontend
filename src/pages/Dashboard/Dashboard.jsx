// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import CollectionsStory from '../../components/CollectionsStory';
import Leftmenu from '../../components/Leftmenu';
import SubCollections from '../../components/SubCollections';

const Dashboard = ({ setSelectedSubCollectionId, setSelectedSubCollectionName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(-1);
  const [collectionName, setCollectionName] = useState('');
  const [updateCollectionView, setUpdateCollectionView] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log("location.selectedCollectionId", location);
    if (location.state) {
        setSelectedCollectionId(location.state.selectedCollection.id);
        setCollectionName(location.state.selectedCollection.name);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.selectedCollectionId = selectedCollectionId;
  }, [selectedCollectionId]);

  return (
    <div className="dashboard-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <input className='dashboard-search' type="search" placeholder="Search" />
      <CollectionsStory 
        setSelectedCollectionId={setSelectedCollectionId}
        setCollectionName={setCollectionName}
        setUpdateCollectionView={setUpdateCollectionView} 
      />
      <SubCollections 
        selectedCollectionId={selectedCollectionId} 
        collectionName={collectionName} 
        updateCollectionView={updateCollectionView} 
        setSelectedSubCollectionId={setSelectedSubCollectionId}
        setSelectedSubCollectionName={setSelectedSubCollectionName}
      />
    </div>
  );
};

export default Dashboard;

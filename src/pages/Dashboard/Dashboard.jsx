// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import CollectionsStory from '../../components/CollectionsStory';
import SubCollections from '../../components/SubCollections';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = ({ setSelectedSubCollectionId, setSelectedSubCollectionName }) => {
  const [isLoading, setIsLoading] = React.useState(true);
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
      { isLoading && <LoadingSpinner /> }
      {
        <section className="dashboard-sub-container" style={{ display: isLoading ? 'none' : 'flex' }}>
          <input className='dashboard-search' type="search" placeholder="Search" />
          <CollectionsStory 
            setSelectedCollectionId={setSelectedCollectionId}
            setCollectionName={setCollectionName}
            setUpdateCollectionView={setUpdateCollectionView}
            setLoading={setIsLoading} 
          />
          <SubCollections 
            selectedCollectionId={selectedCollectionId} 
            collectionName={collectionName} 
            updateCollectionView={updateCollectionView} 
            setSelectedSubCollectionId={setSelectedSubCollectionId}
            setSelectedSubCollectionName={setSelectedSubCollectionName}
          />
        </section>
      }
    </div>
  );
};

export default Dashboard;

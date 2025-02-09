// Dashboard.js
import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import CollectionsStory from '../../components/CollectionsStory';
import Leftmenu from '../../components/Leftmenu';
import SubCollections from '../../components/SubCollections';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(-1);

  return (
    <div className="dashboard-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <input className='dashboard-search' type="search" placeholder="Search" />
      <CollectionsStory setSelectedCollectionId={setSelectedCollectionId} />
      <SubCollections selectedCollectionId={selectedCollectionId} />
    </div>
  );
};

export default Dashboard;

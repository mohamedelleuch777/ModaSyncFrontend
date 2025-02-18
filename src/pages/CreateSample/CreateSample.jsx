// CreateSample.js
import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';

const CreateSample = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="create-sample-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

    </div>
  );
};

export default CreateSample;

import React from 'react';
import { List, PersonFill, BellFill } from 'react-bootstrap-icons'; // Import individual icons

function Leftmenu({ isMenuOpen, setIsMenuOpen }) {

  return (
    <>
      <div className={`leftmenu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`leftmenu leftmenu-containter ${isMenuOpen ? 'show' : ''}`}>
        
      </div>
    </>
  );
}

export default Leftmenu
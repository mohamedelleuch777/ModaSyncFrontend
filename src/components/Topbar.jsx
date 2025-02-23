import React from 'react';
import { List, PersonFill, BellFill } from 'react-bootstrap-icons'; // Import individual icons

function Topbar({ setIsMenuOpen }) {
  return (
    <div className="topbar topbar-containter">
      <div className="button menu" onClick={() => setIsMenuOpen(true)}>
        <List color="white" size={20} /> {/* Render a blue arrow-right icon */}
      </div>
      <div className="buttons-container">
        <div className="button menu">
            <BellFill color="white" size={20} /> {/* Render a blue arrow-right icon */}
        </div>
        <div className="button menu">
            <PersonFill color="white" size={20} /> {/* Render a blue arrow-right icon */}
        </div>
      </div>
    </div>
  );
}

export default Topbar
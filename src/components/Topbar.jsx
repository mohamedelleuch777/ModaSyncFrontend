import React from 'react';
import { List, PersonFill, BellFill } from 'react-bootstrap-icons'; // Import individual icons

function Topbar() {
  return (
    <div className="topbar topbar-containter">
      <div className="button menu">
        <List color="white" size={30} /> {/* Render a blue arrow-right icon */}
      </div>
      <div className="buttons-container">
        <div className="button menu">
            <BellFill color="white" size={30} /> {/* Render a blue arrow-right icon */}
        </div>
        <div className="button menu">
            <PersonFill color="white" size={30} /> {/* Render a blue arrow-right icon */}
        </div>
      </div>
    </div>
  );
}

export default Topbar
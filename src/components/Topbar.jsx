import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, PersonFill, ListTask } from 'react-bootstrap-icons'; // Import individual icons

function Topbar({ setIsMenuOpen, breadcrumb }) {
  const navigate = useNavigate();

  const renderBreadcrumb = () => {
    if (!breadcrumb || !breadcrumb.sample) return null;
    
    const { sample } = breadcrumb;
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        fontSize: '16px',
        color: 'white',
        fontWeight: '600'
      }}>
        <span>
          🏷️ {sample.name}
        </span>
      </div>
    );
  };

  return (
    <div className="topbar topbar-containter">
      <div className="button menu" onClick={() => setIsMenuOpen(true)}>
        <List color="white" size={20} /> {/* Render a blue arrow-right icon */}
      </div>
      
      {/* Breadcrumb in center */}
      {renderBreadcrumb()}
      
      <div className="buttons-container">
        {/* <div className="button menu">
            <ListTask color="white" size={20} />
        </div> */}
        <div className="button menu">
            <PersonFill color="white" size={20} onClick={() => navigate('/profile')}/> {/* Render a blue arrow-right icon */}
        </div>
      </div>
    </div>
  );
}

export default Topbar
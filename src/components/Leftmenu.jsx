import React, { useEffect } from 'react';
import { useApi, get } from '../hooks/apiHooks';
import { HouseFill, PersonFill, BellFill, ListTask, AirplaneFill, AlarmFill } from 'react-bootstrap-icons';
import logo from '../assets/img/logo.svg';

const menuItems = [
  { id: 1, name: 'Home', icon: <HouseFill color="white" size={20} /> },
  { id: 2, name: 'Profile', icon: <PersonFill color="white" size={20} /> },
  { id: 3, name: 'Notifications', icon: <BellFill color="white" size={20} /> },
  { id: 4, name: 'My Task', icon: <ListTask color="white" size={20} /> }
];

function Leftmenu({ isMenuOpen, setIsMenuOpen }) {
  // const apiFetch = useApi();

  // Load collections when the component mounts.
  useEffect(() => {
    // fetchSubCollections(collection_id);
  }, []);

  return (
    <>
      <div className={`leftmenu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`leftmenu leftmenu-containter ${isMenuOpen ? 'show' : ''}`}>
        <div className="title-container">
          <i className="app-name">ModaSync v1.0.0</i>
          <img className="logo" src={logo} alt="logo" />
        </div>
        {
          menuItems && menuItems.map((item) => (
            <div className="menu-item" key={item.id}>
              <div className="menu-item-icon">
                {item.icon}
              </div>
              <div className="menu-item-name">
                {item.name}
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default Leftmenu
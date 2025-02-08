import React from 'react';
import { HouseFill, PersonFill, BellFill, ListTask } from 'react-bootstrap-icons'; // Import individual icons
import logo from '../assets/img/logo.svg';

const menuItems = [
  { id: 1, name: 'Home', icon: <HouseFill color="white" size={20} /> },
  { id: 2, name: 'Profile', icon: <PersonFill color="white" size={20} /> },
  { id: 3, name: 'Notifications', icon: <BellFill color="white" size={20} /> },
  { id: 4, name: 'My Task', icon: <ListTask color="white" size={20} /> }
];

function Leftmenu({ isMenuOpen, setIsMenuOpen }) {

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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HouseFill, PersonFill, BellFill, ListTask, BoxArrowLeft } from 'react-bootstrap-icons';
import logo from '../assets/img/logo.svg';
import { APP_VERSION, APP_TITLE } from '../constants';

function Leftmenu({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: 'Home', icon: <HouseFill color="white" size={20}/>, action: () => navigate('/') },
    { id: 2, name: 'Profile', icon: <PersonFill color="white" size={20} />, action: () => navigate('/profile')  },
    // { id: 3, name: 'Notifications', icon: <BellFill color="white" size={20} />, action: () => console.log('Notifications')  },
    { id: 4, name: 'My Task', icon: <ListTask color="white" size={20} />, action: () => console.log('My Task')  },
    { id: 5, name: 'Logout', icon: <BoxArrowLeft color="white" size={20} />, action: () => { delete localStorage.token; navigate('/login') }  }
  ];

  return (
    <>
      <div className={`leftmenu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`leftmenu leftmenu-containter ${isMenuOpen ? 'show' : ''}`}>
        <div className="title-container">
          <i className="app-name">{APP_TITLE} v{APP_VERSION}</i>
          <img className="logo" src={logo} alt="logo" />
        </div>
        {
          menuItems && menuItems.map((item) => (
            <div className="menu-item" key={item.id} onClick={item.action}>
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HouseFill, PersonFill, BellFill, ListTask, BoxArrowLeft, GearFill, PeopleFill, BuildingGear } from 'react-bootstrap-icons';
import logo from '../assets/img/logo.svg';
import { APP_VERSION, APP_TITLE, USER_ROLES, inputBox } from '../constants';
import { jwtDecode } from "jwt-decode";

function Leftmenu({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  // Check if user is a manager
  const isManager = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const decodedToken = jwtDecode(token);
      return decodedToken.role === USER_ROLES.MANAGER;
    } catch (error) {
      return false;
    }
  };

  const baseMenuItems = [
    { id: 1, name: 'Home', icon: <HouseFill color="white" size={20}/>, action: () => navigate('/') },
    { id: 2, name: 'Profile', icon: <PersonFill color="white" size={20} />, action: () => navigate('/profile')  },
    // { id: 3, name: 'Notifications', icon: <BellFill color="white" size={20} />, action: () => console.log('Notifications')  },
    { id: 3, name: 'My Task', icon: <ListTask color="white" size={20} />, action: () => navigate('/tasks')   },
    // { id: 4, name: 'test', icon: <ListTask color="white" size={20} />, action: () => inputBox("Enter Rext",(text) => console.log(text)) },
  ];

  const managerMenuItems = [
    { id: 101, name: 'Manage Users', icon: <PeopleFill color="white" size={20} />, action: () => navigate('/manage-users') },
    { id: 102, name: 'External Tasks', icon: <BuildingGear color="white" size={20} />, action: () => navigate('/manage-external-tasks') },
  ];

  const logoutItem = { id: 999, name: 'Logout', icon: <BoxArrowLeft color="white" size={20} />, action: () => { delete localStorage.token; navigate('/login') } };

  const menuItems = [
    ...baseMenuItems,
    ...(isManager() ? managerMenuItems : []),
    logoutItem
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
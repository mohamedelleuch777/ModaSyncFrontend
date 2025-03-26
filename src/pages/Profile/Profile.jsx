import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { PersonFill, PersonCircle, EnvelopeFill, TelephoneFill, BriefcaseFill, BoxArrowLeft } from 'react-bootstrap-icons';



const Profile = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log(token);
    setUser(jwtDecode(token).user)
  }, []);

  return (
    <div className="profile-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="profile-card">
        <h1 style={{display: "flex", alignItems: "center", gap: "10px"}}><PersonCircle color="white" size={34} className="me-2" />Profile</h1>
        {
          user && (
            <div>
              <p className='page-items'><PersonFill color="white" size={20} className="me-2" />{user.name}</p>
              <p className='page-items'><EnvelopeFill color="white" size={20} className="me-2" />{user.email}</p>
              <p className='page-items'><TelephoneFill color="white" size={20} className="me-2" />{user.phone}</p>
              <p className='page-items'><BriefcaseFill color="white" size={20} className="me-2" />{user.role}</p>
            </div>
          )
        }
        <button className='logout-button' onClick={() => navigate('/login')}>
          <BoxArrowLeft color="white" size={20} className="me-2" />
           Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

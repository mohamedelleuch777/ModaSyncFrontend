import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { 
  KeyFill, 
  UnlockFill,
  LockFill,
  FileLockFill,
  HouseLockFill
} from 'react-bootstrap-icons';



const ResetPassword = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log(token);
    setUser(jwtDecode(token).user)
  }, []);

  return (
    <div className="reset-password-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="reset-password-card">
        <h1 style={{display: "flex", alignItems: "center", gap: "10px"}}>
          <HouseLockFill color="white" size={34} className="me-2" />
          Reset Password
        </h1>
        {
          user && (
            <div>
              <p className='page-items'><UnlockFill color="white" size={20} className="me-2" />
                <input type="password" placeholder="Old Password" />
              </p>
              <p className='page-items'><LockFill color="white" size={20} className="me-2" />
                <input type="password" placeholder="New Password" />
              </p>
              <p className='page-items'><FileLockFill color="white" size={20} className="me-2" />
                <input type="password" placeholder="Confirm Password" />
              </p>
            </div>
          )
        }
        <button className='reset-password-button' onClick={() => navigate('/reset-password')}>
          <KeyFill color="white" size={20} className="me-2" />
           Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

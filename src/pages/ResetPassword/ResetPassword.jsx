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
import LoadingSpinner from '../../components/LoadingSpinner';
import { useApi, post } from '../../hooks/apiHooks';



const ResetPassword = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  
  const apiFetch = useApi();


  const handleResetPassword = async () => {
    setError('');
    setIsLoading(true);
    console.log("reset password");
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await post(apiFetch, '/auth/reset-password', {
        oldPassword,
        newPassword,
        confirmation: confirmPassword
      });
      
      if (response.error) {
        setError(response.error || "Something went wrong");
        setIsLoading(false);
      } else {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigate('/profile');
      }
    } catch (err) {
      setError("Network error or server unavailable");
      setIsLoading(false);
    }
  };
  

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
                <input 
                  type="password" 
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </p>
              <p className='page-items'><LockFill color="white" size={20} className="me-2" />
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </p>
              <p className='page-items'><FileLockFill color="white" size={20} className="me-2" />
                <input 
                  type="password" 
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </p>
            </div>
          )
        }
        {error && <p className="error-message">{error}</p>}
        <button className='reset-password-button' onClick={() => handleResetPassword()}>
          <KeyFill color="white" size={20} className="me-2" />
          {isLoading ? <LoadingSpinner size={20} spinnerWidth={4}/> : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

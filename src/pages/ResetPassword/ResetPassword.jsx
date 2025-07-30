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
  HouseLockFill,
  ShieldFillCheck,
  EyeFill,
  EyeSlashFill,
  CheckCircleFill,
  XCircleFill,
  ArrowLeftCircleFill
} from 'react-bootstrap-icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useApi, post } from '../../hooks/apiHooks';
import { messageBox } from '../../constants';



const ResetPassword = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const apiFetch = useApi();


  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '#ccc' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strength = {
      0: { label: '', color: '#ccc' },
      1: { label: 'Very Weak', color: '#e74c3c' },
      2: { label: 'Weak', color: '#f39c12' },
      3: { label: 'Fair', color: '#f1c40f' },
      4: { label: 'Good', color: '#2ecc71' },
      5: { label: 'Strong', color: '#27ae60' }
    };
    
    return { score, ...strength[score] };
  };

  const validatePasswords = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return "All fields are required";
    }
    if (newPassword.length < 6) {
      return "New password must be at least 6 characters long";
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match";
    }
    return null;
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess(false);
    
    const validationError = validatePasswords();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
  
    try {
      const response = await post(apiFetch, '/auth/reset-password', {
        oldPassword,
        newPassword,
        confirmation: confirmPassword
      });
      
      if (response.error) {
        setError(response.error || "Something went wrong");
      } else {
        setSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        messageBox('Password changed successfully!', 'success');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      setError("Network error or server unavailable");
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded.user || decoded);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="task-container">
      <Topbar setIsMenuOpen={setIsMenuOpen}/>
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="task-card">
        
        {/* Modern Header */}
        <div className="page-header" style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '20px 20px 0 0',
          position: 'relative'
        }}>
          <button 
            style={{
              position: 'absolute',
              left: '24px',
              background: 'transparent',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => e.target.style.color = 'var(--secondary-color)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--primary-color)'}
          >
            <ArrowLeftCircleFill size={18} /> Back to Profile
          </button>
          
          <div style={{
            textAlign: 'center'
          }}>
            <h1 style={{
              color: 'var(--primary-color)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              <KeyFill size={28} /> Change Password
            </h1>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: '8px 0 0 0'
            }}>
              Update your account password for better security
            </p>
          </div>
        </div>

        {/* Password Change Content */}
        <div style={{
          padding: '32px',
          background: 'white',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {user && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              
              {/* Security Notice */}
              <div style={{
                background: 'linear-gradient(135deg, #e6f3f0 0%, #f0f8f7 100%)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(109, 164, 156, 0.2)',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldFillCheck size={24} color="var(--primary-color)" />
                <div>
                  <h3 style={{
                    color: 'var(--primary-color)',
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>Security Notice</h3>
                  <p style={{
                    color: '#666',
                    margin: 0,
                    fontSize: '14px'
                  }}>Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.</p>
                </div>
              </div>

              {/* Password Form */}
              <div style={{
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                
                {/* Current Password */}
                <div style={{marginBottom: '24px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--primary-color)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    🔓 Current Password
                  </label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '48px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <EyeSlashFill size={16} /> : <EyeFill size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div style={{marginBottom: '24px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--primary-color)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    🔒 New Password
                  </label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '48px',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeSlashFill size={16} /> : <EyeFill size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div style={{marginTop: '8px'}}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          flex: 1,
                          height: '4px',
                          background: '#e9ecef',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            height: '100%',
                            background: passwordStrength.color,
                            transition: 'all 0.3s ease'
                          }}></div>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          color: passwordStrength.color,
                          fontWeight: '500',
                          minWidth: '80px'
                        }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{marginBottom: '32px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--primary-color)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    🔐 Confirm New Password
                  </label>
                  <div style={{position: 'relative'}}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '48px',
                        border: `2px solid ${confirmPassword && newPassword !== confirmPassword ? '#e74c3c' : '#e9ecef'}`,
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = confirmPassword && newPassword !== confirmPassword ? '#e74c3c' : '#e9ecef'}
                    />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeSlashFill size={16} /> : <EyeFill size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: newPassword === confirmPassword ? 'var(--success-color)' : '#e74c3c'
                    }}>
                      {newPassword === confirmPassword ? 
                        <CheckCircleFill size={14} /> : 
                        <XCircleFill size={14} />
                      }
                      {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div style={{
                    background: 'linear-gradient(135deg, #ffeaea 0%, #ffcccc 100%)',
                    border: '1px solid #e74c3c',
                    color: '#e74c3c',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <XCircleFill size={16} />
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div style={{
                    background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
                    border: '1px solid var(--success-color)',
                    color: 'var(--success-color)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircleFill size={16} />
                    Password changed successfully! Redirecting to profile...
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: isLoading ? '#ccc' : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isLoading ? 'none' : '0 4px 12px rgba(109, 164, 156, 0.3)'
                  }}
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isLoading ? (
                    <LoadingSpinner size={20} spinnerWidth={3} />
                  ) : (
                    <>
                      <KeyFill size={18} /> Change Password
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {!user && (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '16px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{fontSize: '64px', marginBottom: '16px'}}>🔐</div>
              <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>Loading</h3>
              <p style={{color: '#666', margin: 0}}>Please wait while we load your account information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

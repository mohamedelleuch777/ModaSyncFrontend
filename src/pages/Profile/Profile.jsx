import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { 
  PersonFill, 
  PersonCircle, 
  EnvelopeFill, 
  TelephoneFill, 
  BriefcaseFill, 
  BoxArrowLeft, 
  KeyFill,
  ShieldFillCheck,
  GearFill,
  StarFill
} from 'react-bootstrap-icons';



const Profile = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);

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

  const getRoleColor = (role) => {
    const colors = {
      'MANAGER': '#e74c3c',
      'STYLIST': '#3498db',
      'MODELIST': '#2ecc71',
      'EXECUTIVE_WORKER': '#f39c12',
      'TESTER': '#9b59b6',
      'PRODUCTION_RESPONSIBLE': '#1abc9c',
      'JOKER': '#e67e22'
    };
    return colors[role] || '#95a5a6';
  };

  const getRoleIcon = (role) => {
    const icons = {
      'MANAGER': '👑',
      'STYLIST': '🎨',
      'MODELIST': '📐',
      'EXECUTIVE_WORKER': '⚡',
      'TESTER': '🔬',
      'PRODUCTION_RESPONSIBLE': '🏭',
      'JOKER': '🃏'
    };
    return icons[role] || '👤';
  };

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
              <PersonCircle size={28} /> My Profile
            </h1>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: '8px 0 0 0'
            }}>
              Manage your account information and preferences
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <div style={{
          padding: '32px',
          background: 'white',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {user && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              
              {/* Profile Avatar Section */}
              <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                padding: '32px',
                background: 'linear-gradient(135deg, #f0f8f7 0%, #e6f3f0 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(109, 164, 156, 0.2)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(109, 164, 156, 0.3)',
                  position: 'relative'
                }}>
                  <PersonFill size={48} color="white" />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: getRoleColor(user.role),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {getRoleIcon(user.role)}
                  </div>
                </div>
                <h2 style={{
                  color: 'var(--primary-color)',
                  margin: '0 0 8px 0',
                  fontSize: '28px',
                  fontWeight: '600'
                }}>
                  {user.name}
                </h2>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  background: getRoleColor(user.role),
                  color: 'white',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <BriefcaseFill size={16} />
                  {user.role}
                </div>
              </div>

              {/* Information Cards */}
              <div style={{
                display: 'grid',
                gap: '20px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                marginBottom: '40px'
              }}>
                
                {/* Contact Information */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  <h3 style={{
                    color: 'var(--primary-color)',
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📞 Contact Information
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(109, 164, 156, 0.1)'
                    }}>
                      <EnvelopeFill size={18} color="var(--primary-color)" />
                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginBottom: '2px',
                          fontWeight: '500'
                        }}>Email</div>
                        <div style={{
                          fontSize: '14px',
                          color: '#333',
                          fontWeight: '500'
                        }}>{user.email}</div>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(109, 164, 156, 0.1)'
                      }}>
                        <TelephoneFill size={18} color="var(--primary-color)" />
                        <div>
                          <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginBottom: '2px',
                            fontWeight: '500'
                          }}>Phone</div>
                          <div style={{
                            fontSize: '14px',
                            color: '#333',
                            fontWeight: '500'
                          }}>{user.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Security */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  <h3 style={{
                    color: 'var(--primary-color)',
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🔐 Account Security
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(46, 204, 113, 0.2)',
                    marginBottom: '16px'
                  }}>
                    <ShieldFillCheck size={20} color="var(--success-color)" />
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--success-color)',
                        fontWeight: '600',
                        marginBottom: '2px'
                      }}>Account Secured</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666'
                      }}>Your account is protected and active</div>
                    </div>
                  </div>
                  
                  <button 
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      border: '2px solid var(--primary-color)',
                      borderRadius: '12px',
                      background: 'white',
                      color: 'var(--primary-color)',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate('/reset-password')}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--primary-color)';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = 'var(--primary-color)';
                    }}
                  >
                    <KeyFill size={16} /> Change Password
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button 
                  style={{
                    padding: '16px 32px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    background: 'white',
                    color: '#666',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#ddd';
                    e.target.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.background = 'white';
                  }}
                >
                  <GearFill size={18} /> Settings
                </button>
                
                <button 
                  style={{
                    padding: '16px 32px',
                    border: '2px solid var(--danger-color)',
                    borderRadius: '12px',
                    background: 'white',
                    color: 'var(--danger-color)',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--danger-color)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = 'var(--danger-color)';
                  }}
                >
                  <BoxArrowLeft size={18} /> Sign Out
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
              <div style={{fontSize: '64px', marginBottom: '16px'}}>👤</div>
              <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>Loading Profile</h3>
              <p style={{color: '#666', margin: 0}}>Please wait while we load your profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { get, useApi } from '../hooks/apiHooks';

const ExternalTaskPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm
}) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiFetch = useApi();

  useEffect(() => {
    if (isOpen) {
      fetchProviders();
      setSelectedProvider(null);
      setError('');
    }
  }, [isOpen]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await get(apiFetch, '/external-providers', {});
      // Filter only active providers
      const activeProviders = response.filter(provider => provider.active);
      setProviders(activeProviders);
    } catch (err) {
      setError('Failed to load external providers');
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedProvider) {
      setError('Please select an external provider');
      return;
    }
    
    onConfirm(selectedProvider);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProvider(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '550px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.1)',
        maxHeight: '85vh',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)',
        transform: 'scale(1)',
        animation: 'modalSlideIn 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div>
            <h3 style={{
              color: 'var(--primary-color)', 
              margin: 0,
              fontSize: '20px',
              fontWeight: '600'
            }}>
              🏢 Select External Provider
            </h3>
            <p style={{
              color: '#666',
              fontSize: '14px',
              margin: '4px 0 0 0'
            }}>
              Choose a partner to handle this task
            </p>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'rgba(217, 0, 0, 0.1)',
              border: 'none',
              color: 'var(--danger-color)',
              fontSize: '20px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(217, 0, 0, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(217, 0, 0, 0.1)'}
          >
            <XCircleFill />
          </button>
        </div>
        
        <div>
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--primary-color)',
              padding: '40px 20px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid var(--primary-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              Loading providers...
            </div>
          ) : providers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--danger-color)',
              padding: '40px 20px',
              background: 'linear-gradient(135deg, #ffeaea 0%, #ffcccc 100%)',
              borderRadius: '12px',
              border: '1px solid #ffcccc'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
              <strong>No active providers available</strong>
              <br />
              <span style={{ fontSize: '14px' }}>
                Please contact your manager to add external providers.
              </span>
            </div>
          ) : (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #f0f8f7 0%, #e6f3f0 100%)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid rgba(109, 164, 156, 0.2)'
              }}>
                <p style={{
                  color: 'var(--primary-color)',
                  margin: '0',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  💼 Available External Partners ({providers.length})
                </p>
              </div>
              <div style={{
                maxHeight: "45vh", 
                overflow: "hidden", 
                overflowY: "auto",
                paddingRight: '8px'
              }}>
                {providers.map(provider => (
                  <div 
                    key={provider.id} 
                    onClick={() => setSelectedProvider(provider)}
                    style={{
                      border: selectedProvider?.id === provider.id 
                        ? '2px solid var(--primary-color)' 
                        : '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '18px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      backgroundColor: selectedProvider?.id === provider.id 
                        ? 'linear-gradient(135deg, #f0f8f7 0%, #e6f3f0 100%)' 
                        : 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: selectedProvider?.id === provider.id 
                        ? '0 4px 12px rgba(109, 164, 156, 0.2)' 
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      transform: selectedProvider?.id === provider.id ? 'translateY(-2px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedProvider?.id !== provider.id) {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedProvider?.id !== provider.id) {
                        e.target.style.transform = 'none';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    <div>
                      <div style={{
                        fontWeight: '600',
                        color: 'var(--primary-color)',
                        marginBottom: '6px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        🏢 {provider.name}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        📞 {provider.phone}
                      </div>
                    </div>
                    <div style={{
                      color: 'var(--primary-color)',
                      fontSize: '24px',
                      opacity: selectedProvider?.id === provider.id ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <CheckCircleFill />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div style={{
              color: 'var(--danger-color)',
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              padding: '12px 16px',
              backgroundColor: 'rgba(217, 0, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(217, 0, 0, 0.2)',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <button 
            onClick={handleClose}
            style={{
              background: 'white',
              border: '2px solid #e9ecef',
              color: '#666',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.backgroundColor = 'white';
            }}
          >
            ✕ Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedProvider || loading}
            style={{
              background: (!selectedProvider || loading) 
                ? '#ccc' 
                : 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '12px',
              cursor: (!selectedProvider || loading) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: (!selectedProvider || loading) 
                ? 'none' 
                : '0 4px 12px rgba(109, 164, 156, 0.3)'
            }}
          >
            ✓ Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalTaskPopup;
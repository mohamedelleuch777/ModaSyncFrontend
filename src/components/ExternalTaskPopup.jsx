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
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h3 style={{
            color: 'var(--primary-color)', 
            margin: 0,
            fontSize: '18px'
          }}>
            Select External Task Provider
          </h3>
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--danger-color)',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            <XCircleFill />
          </button>
        </div>
        
        <div>
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--primary-color)',
              padding: '20px'
            }}>
              Loading providers...
            </div>
          ) : providers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--danger-color)',
              padding: '20px'
            }}>
              No active external providers available. Please contact your manager to add providers.
            </div>
          ) : (
            <div>
              <p style={{
                color: 'var(--primary-color)',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                Choose an external provider for this task:
              </p>
              <div style={{maxHeight: "50vh", overflow: "hidden", overflowY: "scroll"}}>
                {providers.map(provider => (
                  <div 
                    key={provider.id} 
                    onClick={() => setSelectedProvider(provider)}
                    style={{
                      border: selectedProvider?.id === provider.id ? '2px solid var(--primary-color)' : '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                      backgroundColor: selectedProvider?.id === provider.id ? '#f0f8f7' : 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{
                        fontWeight: 'bold',
                        color: 'var(--primary-color)',
                        marginBottom: '5px'
                      }}>
                        {provider.name}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        {provider.phone}
                      </div>
                    </div>
                    <div style={{
                      color: 'var(--primary-color)',
                      fontSize: '20px'
                    }}>
                      {selectedProvider?.id === provider.id && <CheckCircleFill />}
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
              marginTop: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '25px'
        }}>
          <button 
            className="reset-password-button" 
            onClick={handleClose}
          >
            Cancel
          </button>
          <button 
            className="login-button" 
            onClick={handleConfirm}
            disabled={!selectedProvider || loading}
            style={{
              opacity: (!selectedProvider || loading) ? 0.5 : 1
            }}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalTaskPopup;
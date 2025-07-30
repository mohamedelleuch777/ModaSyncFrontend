import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, post, put, del } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { messageBox } from '../../constants';
import { PlusCircleFill, PencilSquare, TrashFill, BuildingFill, TelephoneFill, BuildingGear, ClockFill, PersonFill, EyeFill } from 'react-bootstrap-icons';
import { formatDateToTunisiaTime } from '../../utils/dateUtils';

const ExternalTaskManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [externalTasks, setExternalTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('providers'); // 'providers' or 'tasks'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    active: true
  });

  const apiFetch = useApi();

  useEffect(() => {
    fetchProviders();
    fetchExternalTasks();
  }, []);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const data = await get(apiFetch, '/external-providers');
      setProviders(data || []);
    } catch (error) {
      messageBox('Failed to fetch providers: ' + error.message, 'error');
      setProviders([]); // Ensure providers is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExternalTasks = async () => {
    try {
      const data = await get(apiFetch, '/samples/external-tasks');
      setExternalTasks(data || []);
    } catch (error) {
      messageBox('Failed to fetch external tasks: ' + error.message, 'error');
      setExternalTasks([]);
    }
  };

  const fetchTasksByProvider = async (providerId) => {
    try {
      const data = await get(apiFetch, `/samples/external-tasks/provider/${providerId}`);
      setExternalTasks(data || []);
      setSelectedProvider(providerId);
    } catch (error) {
      messageBox('Failed to fetch provider tasks: ' + error.message, 'error');
      setExternalTasks([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        await put(apiFetch, `/external-providers/${editingProvider.id}`, formData);
        messageBox('Provider updated successfully', 'success');
      } else {
        await post(apiFetch, '/external-providers', formData);
        messageBox('Provider created successfully', 'success');
      }
      
      setShowAddForm(false);
      setEditingProvider(null);
      setFormData({ name: '', phone: '', active: true });
      fetchProviders();
    } catch (error) {
      messageBox('Failed to save provider: ' + error.message, 'error');
    }
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name || '',
      phone: provider.phone || '',
      active: provider.active !== false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (providerId, providerName) => {
    if (window.confirm(`Are you sure you want to delete provider "${providerName}"?`)) {
      try {
        await del(apiFetch, `/external-providers/${providerId}`);
        messageBox('Provider deleted successfully', 'success');
        fetchProviders();
      } catch (error) {
        messageBox('Failed to delete provider: ' + error.message, 'error');
      }
    }
  };

  const toggleProviderStatus = async (providerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await put(apiFetch, `/external-providers/${providerId}/status`, { active: newStatus });
      messageBox(`Provider ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchProviders();
    } catch (error) {
      messageBox('Failed to update provider status: ' + error.message, 'error');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingProvider(null);
    setFormData({ name: '', phone: '', active: true });
  };

  return (
    <div className="task-container">
      <Topbar setIsMenuOpen={setIsMenuOpen} />
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="task-card">
        <div className="page-header" style={{
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          borderBottom: '1px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '20px 20px 0 0'
        }}>
          <div>
            <h1 style={{
              color: 'var(--primary-color)', 
              marginBottom: 20,
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              <BuildingGear size={22} /> External Task Management
            </h1>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
            <div style={{
              display: 'flex', 
              borderRadius: '10px', 
              border: '2px solid var(--primary-color)', 
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}>
              <button 
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: activeTab === 'providers' ? 'var(--primary-color)' : 'white',
                  color: activeTab === 'providers' ? 'white' : 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={() => setActiveTab('providers')}
              >
                🏢 Providers
              </button>
              <button 
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: activeTab === 'tasks' ? 'var(--primary-color)' : 'white',
                  color: activeTab === 'tasks' ? 'white' : 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={() => {setActiveTab('tasks'); fetchExternalTasks(); setSelectedProvider(null);}}
              >
                📋 Tasks
              </button>
            </div>
            {activeTab === 'providers' && (
              <button 
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 8px rgba(109, 164, 156, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setShowAddForm(true)}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <PlusCircleFill size={14} /> Add Provider
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {showAddForm && (
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
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  width: '90%',
                  maxWidth: '450px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  animation: 'modalSlideIn 0.3s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <h3 style={{
                      color: 'var(--primary-color)', 
                      margin: 0, 
                      fontSize: '20px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {editingProvider ? '✏️ Edit Provider' : '➕ Add New Provider'}
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--primary-color)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        🏢 Provider Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Enter provider name"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          fontSize: '14px',
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>
                    <div style={{marginBottom: '28px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--primary-color)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        📞 Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        placeholder="Enter phone number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          fontSize: '14px',
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>

                    <div style={{
                      display: 'flex', 
                      gap: '12px',
                      paddingTop: '16px',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <button 
                        type="button" 
                        onClick={cancelForm}
                        style={{
                          flex: 1,
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
                        type="submit" 
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                          border: 'none',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(109, 164, 156, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        {editingProvider ? '✓ Update Provider' : '✓ Create Provider'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div style={{
              padding: '24px 32px', 
              paddingTop: 24, 
              background: 'white',
              minHeight: 'calc(100vh - 200px)'
            }}>
              {activeTab === 'providers' ? (
                <>
                  <div style={{
                    display: 'grid',
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                  }}>
                    {providers.map(provider => (
                      <div key={provider.id} style={{
                        background: 'white',
                        border: '1px solid #e9ecef',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}>
                        
                        {/* Status indicator */}
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: provider.active !== false ? 'var(--success-color)' : '#ccc'
                        }}></div>
                        
                        {/* Provider header */}
                        <div style={{marginBottom: '16px'}}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}>
                            🏢 {provider.name}
                          </h3>
                          <p style={{
                            margin: 0,
                            fontSize: '14px',
                            color: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            📞 {provider.phone}
                          </p>
                        </div>
                        
                        {/* Status section */}
                        <div style={{
                          background: provider.active !== false 
                            ? 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)' 
                            : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          marginBottom: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: provider.active !== false ? 'var(--success-color)' : '#666'
                          }}>
                            {provider.active !== false ? '✅ Active' : '⏸️ Inactive'}
                          </span>
                          <button
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: provider.active !== false ? 'rgba(217, 0, 0, 0.1)' : 'var(--success-color)',
                              color: provider.active !== false ? 'var(--danger-color)' : 'white',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => toggleProviderStatus(provider.id, provider.active !== false)}
                            onMouseEnter={(e) => {
                              if (provider.active !== false) {
                                e.target.style.backgroundColor = 'rgba(217, 0, 0, 0.2)';
                              } else {
                                e.target.style.backgroundColor = 'var(--secondary-color)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (provider.active !== false) {
                                e.target.style.backgroundColor = 'rgba(217, 0, 0, 0.1)';
                              } else {
                                e.target.style.backgroundColor = 'var(--success-color)';
                              }
                            }}
                          >
                            {provider.active !== false ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                        
                        {/* Action buttons */}
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button 
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              borderRadius: '10px',
                              border: '2px solid var(--primary-color)',
                              backgroundColor: 'white',
                              color: 'var(--primary-color)',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleEdit(provider)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--primary-color)';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = 'var(--primary-color)';
                            }}
                          >
                            <PencilSquare size={14} /> Edit
                          </button>
                          <button 
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              borderRadius: '10px',
                              border: '2px solid var(--danger-color)',
                              backgroundColor: 'white',
                              color: 'var(--danger-color)',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleDelete(provider.id, provider.name)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--danger-color)';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = 'var(--danger-color)';
                            }}
                          >
                            <TrashFill size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {providers.length === 0 && (
                    <div style={{
                      textAlign: 'center', 
                      padding: '60px 40px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderRadius: '16px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{fontSize: '64px', marginBottom: '16px'}}>🏢</div>
                      <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>No Providers Found</h3>
                      <p style={{color: '#666', margin: 0}}>Add your first external provider to get started with task management.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{
                    marginBottom: '24px', 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f0f8f7 0%, #e6f3f0 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(109, 164, 156, 0.2)'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--primary-color)',
                      alignSelf: 'center',
                      marginRight: '8px'
                    }}>
                      🔍 Filter by Provider:
                    </span>
                    <button 
                      style={{
                        padding: '8px 16px',
                        border: '2px solid var(--primary-color)',
                        borderRadius: '20px',
                        backgroundColor: selectedProvider === null ? 'var(--primary-color)' : 'white',
                        color: selectedProvider === null ? 'white' : 'var(--primary-color)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedProvider === null ? '0 2px 8px rgba(109, 164, 156, 0.3)' : 'none'
                      }}
                      onClick={() => {fetchExternalTasks(); setSelectedProvider(null);}}
                      onMouseEnter={(e) => {
                        if (selectedProvider !== null) {
                          e.target.style.backgroundColor = 'var(--primary-color)';
                          e.target.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedProvider !== null) {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.color = 'var(--primary-color)';
                        }
                      }}
                    >
                      📋 All Tasks
                    </button>
                    {providers.map(provider => (
                      <button 
                        key={provider.id}
                        style={{
                          padding: '8px 16px',
                          border: '2px solid var(--primary-color)',
                          borderRadius: '20px',
                          backgroundColor: selectedProvider === provider.id ? 'var(--primary-color)' : 'white',
                          color: selectedProvider === provider.id ? 'white' : 'var(--primary-color)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          boxShadow: selectedProvider === provider.id ? '0 2px 8px rgba(109, 164, 156, 0.3)' : 'none'
                        }}
                        onClick={() => fetchTasksByProvider(provider.id)}
                        onMouseEnter={(e) => {
                          if (selectedProvider !== provider.id) {
                            e.target.style.backgroundColor = 'var(--primary-color)';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedProvider !== provider.id) {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = 'var(--primary-color)';
                          }
                        }}
                      >
                        🏢 {provider.name}
                      </button>
                    ))}
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    {externalTasks.map(task => (
                      <div key={task.id} style={{
                        background: 'white',
                        border: '1px solid #e9ecef',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                      }}>
                        
                        {/* Task header */}
                        <div style={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start', 
                          marginBottom: '16px'
                        }}>
                          <div style={{flex: 1}}>
                            <h3 style={{
                              margin: 0,
                              fontSize: '18px',
                              fontWeight: '600',
                              color: 'var(--primary-color)',
                              marginBottom: '6px'
                            }}>
                              🏷️ {task.sample_name}
                            </h3>
                            <p style={{
                              margin: 0,
                              fontSize: '14px',
                              color: '#666',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              📂 {task.collection_name} → {task.subcollection_name}
                            </p>
                          </div>
                          <div style={{
                            padding: '6px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: task.status === 'external_task' 
                              ? 'linear-gradient(135deg, var(--quaternary-color) 0%, #d6619a 100%)' 
                              : 'linear-gradient(135deg, var(--success-color) 0%, #2d7a2d 100%)',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {task.status === 'external_task' ? '🔄 In Progress' : '✅ Completed'}
                          </div>
                        </div>
                        
                        {/* Task details */}
                        <div style={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          padding: '16px',
                          borderRadius: '12px',
                          marginBottom: task.comment ? '16px' : '0'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '12px',
                            fontSize: '14px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid rgba(109, 164, 156, 0.2)'
                            }}>
                              <BuildingFill size={16} color="var(--primary-color)" />
                              <span style={{fontWeight: '500'}}>{task.provider_name}</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid rgba(109, 164, 156, 0.2)'
                            }}>
                              <PersonFill size={16} color="var(--primary-color)" />
                              <span style={{fontWeight: '500'}}>{task.assigned_by || 'System'}</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid rgba(109, 164, 156, 0.2)'
                            }}>
                              <ClockFill size={16} color="var(--primary-color)" />
                              <span style={{fontWeight: '500', fontSize: '13px'}}>{formatDateToTunisiaTime(task.timestamp)}</span>
                            </div>
                            {task.external_task_due_date && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: new Date(task.external_task_due_date) < new Date() 
                                  ? 'linear-gradient(135deg, #ffeaea 0%, #ffcccc 100%)' 
                                  : 'white',
                                borderRadius: '8px',
                                border: new Date(task.external_task_due_date) < new Date()
                                  ? '1px solid rgba(217, 0, 0, 0.3)'
                                  : '1px solid rgba(109, 164, 156, 0.2)'
                              }}>
                                <span style={{fontSize: '16px'}}>⏰</span>
                                <span style={{
                                  fontWeight: '500',
                                  fontSize: '13px',
                                  color: new Date(task.external_task_due_date) < new Date() ? 'var(--danger-color)' : 'inherit'
                                }}>
                                  Due: {formatDateToTunisiaTime(task.external_task_due_date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Comment section */}
                        {task.comment && (
                          <div style={{
                            background: 'linear-gradient(135deg, #e6f3f0 0%, #f0f8f7 100%)',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(109, 164, 156, 0.2)'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px'
                            }}>
                              <span style={{fontSize: '16px'}}>💬</span>
                              <div>
                                <strong style={{color: 'var(--primary-color)', fontSize: '14px'}}>Comment:</strong>
                                <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#666'}}>{task.comment}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {externalTasks.length === 0 && (
                    <div style={{
                      textAlign: 'center', 
                      padding: '60px 40px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderRadius: '16px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{fontSize: '64px', marginBottom: '16px'}}>📋</div>
                      <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>No External Tasks Found</h3>
                      <p style={{color: '#666', margin: 0}}>
                        {selectedProvider ? 'This provider has no assigned tasks yet.' : 'No external tasks have been assigned to any providers.'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExternalTaskManagement;
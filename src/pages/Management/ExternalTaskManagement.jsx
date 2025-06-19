import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, post, put, del } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { messageBox } from '../../constants';
import { PlusCircleFill, PencilSquare, TrashFill, BuildingFill, TelephoneFill, BuildingGear, ClockFill, PersonFill, EyeFill } from 'react-bootstrap-icons';

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
        <div className="page-header" style={{padding: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', borderBottom: '2px solid #f0f0f0'}}>
          <h1 style={{color: 'var(--primary-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <BuildingGear size={24} /> External Task Management
          </h1>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <div style={{display: 'flex', borderRadius: '8px', border: '1px solid var(--primary-color)', overflow: 'hidden'}}>
              <button 
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: activeTab === 'providers' ? 'var(--primary-color)' : 'white',
                  color: activeTab === 'providers' ? 'white' : 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => setActiveTab('providers')}
              >
                Providers
              </button>
              <button 
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: activeTab === 'tasks' ? 'var(--primary-color)' : 'white',
                  color: activeTab === 'tasks' ? 'white' : 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={() => {setActiveTab('tasks'); fetchExternalTasks(); setSelectedProvider(null);}}
              >
                Tasks
              </button>
            </div>
            {activeTab === 'providers' && (
              <button 
                className="login-button"
                style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircleFill size={16} /> Add Provider
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
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '15px',
                  width: '90%',
                  maxWidth: '400px'
                }}>
                  <h3 style={{color: 'var(--primary-color)', marginBottom: '20px', textAlign: 'center'}}>
                    {editingProvider ? 'Edit Provider' : 'Add New Provider'}
                  </h3>
                  <form onSubmit={handleSubmit} className="create-sample-form">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Provider Name"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="tel"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        placeholder="Phone Number"
                      />
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                      <button type="submit" className="login-button" style={{flex: 1}}>
                        {editingProvider ? 'Update Provider' : 'Create Provider'}
                      </button>
                      <button 
                        type="button" 
                        className="reset-password-button" 
                        style={{flex: 1, backgroundColor: '#666'}}
                        onClick={cancelForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div style={{padding: '0 20px', paddingTop: 20, backgroundColor: "var(--secondary-color)"}}>
              {activeTab === 'providers' ? (
                <>
                  {providers.map(provider => (
                <div key={provider.id} className="sample-item" style={{marginBottom: '15px', flexDirection: 'column', alignItems: 'stretch'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <div className="sample-info" style={{flex: 1}}>
                      <p className="sample-name" style={{margin: 0}}>
                        <BuildingFill size={16} color="var(--primary-color)" style={{marginRight: '8px'}} />
                        {provider.name}
                      </p>
                      <p style={{margin: '5px 0', fontSize: '14px', color: '#666'}}>
                        <TelephoneFill size={14} style={{marginRight: '5px'}} />
                        {provider.phone}
                      </p>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        style={{
                          padding: '5px 8px',
                          borderRadius: '5px',
                          border: 'none',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEdit(provider)}
                      >
                        <PencilSquare size={14} />
                      </button>
                      <button 
                        style={{
                          padding: '5px 8px',
                          borderRadius: '5px',
                          border: 'none',
                          backgroundColor: 'var(--danger-color)',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDelete(provider.id, provider.name)}
                      >
                        <TrashFill size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>
                      Status: {provider.active !== false ? 'Active' : 'Inactive'}
                    </span>
                    
                    <button
                      style={{
                        padding: '4px 12px',
                        borderRadius: '15px',
                        border: 'none',
                        backgroundColor: provider.active !== false ? 'var(--success-color)' : '#666',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onClick={() => toggleProviderStatus(provider.id, provider.active !== false)}
                    >
                      {provider.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                  ))}
                  
                  {providers.length === 0 && (
                    <div style={{textAlign: 'center', padding: '40px', color: 'var(--primary-color)'}}>
                      <p>No external providers found. Add your first provider to get started.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <button 
                      style={{
                        padding: '8px 16px',
                        border: '1px solid var(--primary-color)',
                        borderRadius: '20px',
                        backgroundColor: selectedProvider === null ? 'var(--primary-color)' : 'white',
                        color: selectedProvider === null ? 'white' : 'var(--primary-color)',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onClick={() => {fetchExternalTasks(); setSelectedProvider(null);}}
                    >
                      All Tasks
                    </button>
                    {providers.map(provider => (
                      <button 
                        key={provider.id}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid var(--primary-color)',
                          borderRadius: '20px',
                          backgroundColor: selectedProvider === provider.id ? 'var(--primary-color)' : 'white',
                          color: selectedProvider === provider.id ? 'white' : 'var(--primary-color)',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onClick={() => fetchTasksByProvider(provider.id)}
                      >
                        {provider.name}
                      </button>
                    ))}
                  </div>
                  
                  {externalTasks.map(task => (
                    <div key={task.id} className="sample-item" style={{marginBottom: '15px', flexDirection: 'column', alignItems: 'stretch'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                        <div className="sample-info" style={{flex: 1}}>
                          <p className="sample-name" style={{margin: 0, fontSize: '16px', fontWeight: 'bold'}}>
                            {task.sample_name}
                          </p>
                          <p style={{margin: '5px 0', fontSize: '14px', color: '#666'}}>
                            {task.collection_name} → {task.subcollection_name}
                          </p>
                        </div>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '15px',
                          border: 'none',
                          backgroundColor: task.status === 'external_task' ? 'var(--quaternary-color)' : 'var(--success-color)',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {task.status === 'external_task' ? 'In Progress' : 'Completed'}
                        </div>
                      </div>
                      
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px'}}>
                        <div style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <BuildingFill size={14} color="var(--primary-color)" />
                            {task.provider_name}
                          </span>
                          <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <PersonFill size={14} color="var(--primary-color)" />
                            {task.assigned_by || 'System'}
                          </span>
                          <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                            <ClockFill size={14} color="var(--primary-color)" />
                            {new Date(task.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {task.external_task_due_date && (
                          <span style={{
                            fontSize: '12px',
                            color: new Date(task.external_task_due_date) < new Date() ? 'var(--danger-color)' : 'var(--primary-color)',
                            fontWeight: 'bold'
                          }}>
                            Due: {new Date(task.external_task_due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {task.comment && (
                        <div style={{marginTop: '10px', padding: '8px', backgroundColor: '#e9ecef', borderRadius: '5px', fontSize: '14px'}}>
                          <strong>Comment:</strong> {task.comment}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {externalTasks.length === 0 && (
                    <div style={{textAlign: 'center', padding: '40px', color: 'var(--primary-color)'}}>
                      <p>No external tasks found.</p>
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
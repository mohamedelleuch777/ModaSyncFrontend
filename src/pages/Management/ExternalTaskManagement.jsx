import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, post, put, del } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { messageBox } from '../../constants';
import { PlusCircleFill, PencilSquare, TrashFill, BuildingFill, TelephoneFill, BuildingGear } from 'react-bootstrap-icons';

const ExternalTaskManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    active: true
  });

  const apiFetch = useApi();

  useEffect(() => {
    fetchProviders();
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
        <div className="page-header" style={{padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0'}}>
          <h1 style={{color: 'var(--primary-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <BuildingGear size={24} /> External Providers
          </h1>
          <button 
            className="login-button"
            style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}
            onClick={() => setShowAddForm(true)}
          >
            <PlusCircleFill size={16} /> Add Provider
          </button>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExternalTaskManagement;
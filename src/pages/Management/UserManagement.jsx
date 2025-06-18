import React, { useState, useEffect } from 'react';
import Topbar from '../../components/Topbar';
import Leftmenu from '../../components/Leftmenu';
import { useApi, get, post, put, del } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { USER_ROLES, messageBox } from '../../constants';
import { PlusCircleFill, PencilSquare, TrashFill, PersonFillCheck, PersonFillX, PersonFill, PeopleFill } from 'react-bootstrap-icons';

const UserManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  });

  const apiFetch = useApi();
  const availableRoles = Object.values(USER_ROLES);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await get(apiFetch, '/users');
      setUsers(data || []);
    } catch (error) {
      messageBox('Failed to fetch users: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // Don't send password if editing and password is empty
      if (editingUser && !submitData.password) {
        delete submitData.password;
      }

      if (editingUser) {
        await put(apiFetch, `/users/${editingUser.id}`, submitData);
        messageBox('User updated successfully', 'success');
      } else {
        await post(apiFetch, '/users', submitData);
        messageBox('User created successfully', 'success');
      }
      
      setShowAddForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', role: '', password: '' });
      fetchUsers();
    } catch (error) {
      messageBox('Failed to save user: ' + error.message, 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      password: '' // Don't prefill password for editing
    });
    setShowAddForm(true);
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await del(apiFetch, `/users/${userId}`);
        messageBox('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        messageBox('Failed to delete user: ' + error.message, 'error');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await put(apiFetch, `/users/${userId}/role`, { role: newRole });
      messageBox('User role updated successfully', 'success');
      fetchUsers();
    } catch (error) {
      messageBox('Failed to update user role: ' + error.message, 'error');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await put(apiFetch, `/users/${userId}/status`, { active: newStatus });
      messageBox(`User ${newStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchUsers();
    } catch (error) {
      messageBox('Failed to update user status: ' + error.message, 'error');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', role: '', password: '' });
  };

  const getRoleColor = (role) => {
    const colors = {
      [USER_ROLES.MANAGER]: '#e74c3c',
      [USER_ROLES.STYLIST]: '#3498db',
      [USER_ROLES.MODELIST]: '#2ecc71',
      [USER_ROLES.EXECUTIVE_WORKER]: '#f39c12',
      [USER_ROLES.TESTER]: '#9b59b6',
      [USER_ROLES.PRODUCTION_RESPONSIBLE]: '#1abc9c'
    };
    return colors[role] || '#95a5a6';
  };

  return (
    <div className="task-container">
      <Topbar setIsMenuOpen={setIsMenuOpen} />
      <Leftmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="task-card">
        <div className="page-header" style={{padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0'}}>
          <h1 style={{color: 'var(--primary-color)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
            <PeopleFill size={24} /> User Management
          </h1>
          <button 
            className="login-button"
            style={{width: 'auto', padding: '8px 16px', fontSize: '14px'}}
            onClick={() => setShowAddForm(true)}
          >
            <PlusCircleFill size={16} /> Add User
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
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}>
                  <h3 style={{color: 'var(--primary-color)', marginBottom: '20px', textAlign: 'center'}}>
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <form onSubmit={handleSubmit} className="create-sample-form">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        placeholder="Email Address"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="tel"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-input"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                        style={{color: formData.role ? '#fff' : 'var(--primary-color)'}}
                      >
                        <option value="">Select Role</option>
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-input"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required={!editingUser}
                        placeholder={editingUser ? "New Password (optional)" : "Password"}
                        minLength="6"
                      />
                    </div>

                    <div style={{display: 'flex', gap: '10px'}}>
                      <button type="submit" className="login-button" style={{flex: 1}}>
                        {editingUser ? 'Update User' : 'Create User'}
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
              {users.map(user => (
                <div key={user.id} className="sample-item" style={{marginBottom: '15px', flexDirection: 'column', alignItems: 'stretch'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <div className="sample-info" style={{flex: 1}}>
                      <p className="sample-name" style={{margin: 0}}>
                        <PersonFill size={16} color="var(--primary-color)" style={{marginRight: '8px'}} />
                        {user.name}
                      </p>
                      <p style={{margin: '5px 0', fontSize: '14px', color: '#666', display: "flex", flexDirection: "column"}}>
                        <span style={{marginLeft: '15px'}}>📧 {user.email}</span>
                        {user.phone && <span style={{marginLeft: '15px'}}>📞 {user.phone}</span>}
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
                        onClick={() => handleEdit(user)}
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
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        <TrashFill size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                      <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>Role:</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: '1px solid #ddd',
                          backgroundColor: getRoleColor(user.role),
                          color: 'white',
                          fontSize: '12px'
                        }}
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      style={{
                        padding: '4px 12px',
                        borderRadius: '15px',
                        border: 'none',
                        backgroundColor: user.active !== false ? 'var(--success-color)' : '#666',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={() => toggleUserStatus(user.id, user.active !== false)}
                    >
                      {user.active !== false ? (
                        <>
                          <PersonFillCheck size={14} /> Active
                        </>
                      ) : (
                        <>
                          <PersonFillX size={14} /> Inactive
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px', color: 'var(--primary-color)'}}>
                  <p>No users found. Add your first user to get started.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
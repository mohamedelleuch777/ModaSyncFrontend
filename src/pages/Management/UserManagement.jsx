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
              <PeopleFill size={22} /> User Management
            </h1>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
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
              <PlusCircleFill size={14} /> Add User
            </button>
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
                  maxWidth: '500px',
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
                      {editingUser ? '✏️ Edit User' : '➕ Add New User'}
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
                        👤 Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Enter full name"
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
                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--primary-color)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        📧 Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        placeholder="Enter email address"
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
                    <div style={{marginBottom: '20px'}}>
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
                    <div style={{marginBottom: '20px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--primary-color)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        🎭 User Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef',
                          borderRadius: '12px',
                          fontSize: '14px',
                          transition: 'border-color 0.2s ease',
                          boxSizing: 'border-box',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      >
                        <option value="">Select Role</option>
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{marginBottom: '28px'}}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: 'var(--primary-color)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        🔒 Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required={!editingUser}
                        placeholder={editingUser ? "New Password (optional)" : "Enter password"}
                        minLength="6"
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
                        {editingUser ? '✓ Update User' : '✓ Create User'}
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
              <div style={{
                display: 'grid',
                gap: '20px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
              }}>
                {users.map(user => (
                  <div key={user.id} style={{
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
                      backgroundColor: user.active !== false ? 'var(--success-color)' : '#ccc'
                    }}></div>
                    
                    {/* User header */}
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
                        👤 {user.name}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px'
                      }}>
                        📧 {user.email}
                      </p>
                      {user.phone && (
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          📞 {user.phone}
                        </p>
                      )}
                    </div>
                    
                    {/* Role section */}
                    <div style={{
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
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
                        color: 'var(--primary-color)'
                      }}>
                        🎭 Role:
                      </span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: getRoleColor(user.role),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Status section */}
                    <div style={{
                      background: user.active !== false 
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
                        color: user.active !== false ? 'var(--success-color)' : '#666'
                      }}>
                        {user.active !== false ? '✅ Active' : '⏸️ Inactive'}
                      </span>
                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: user.active !== false ? 'rgba(217, 0, 0, 0.1)' : 'var(--success-color)',
                          color: user.active !== false ? 'var(--danger-color)' : 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => toggleUserStatus(user.id, user.active !== false)}
                        onMouseEnter={(e) => {
                          if (user.active !== false) {
                            e.target.style.backgroundColor = 'rgba(217, 0, 0, 0.2)';
                          } else {
                            e.target.style.backgroundColor = 'var(--secondary-color)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (user.active !== false) {
                            e.target.style.backgroundColor = 'rgba(217, 0, 0, 0.1)';
                          } else {
                            e.target.style.backgroundColor = 'var(--success-color)';
                          }
                        }}
                      >
                        {user.active !== false ? 'Deactivate' : 'Activate'}
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
                        onClick={() => handleEdit(user)}
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
                        onClick={() => handleDelete(user.id, user.name)}
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
              
              {users.length === 0 && (
                <div style={{
                  textAlign: 'center', 
                  padding: '60px 40px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: '16px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{fontSize: '64px', marginBottom: '16px'}}>👥</div>
                  <h3 style={{color: 'var(--primary-color)', marginBottom: '8px'}}>No Users Found</h3>
                  <p style={{color: '#666', margin: 0}}>Add your first user to get started with user management.</p>
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
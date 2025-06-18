import React, { useState, useEffect } from 'react';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

const DimensionsPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialDimensions = { width: '', height: '', id: '' },
  isEditing = false 
}) => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDimensions(initialDimensions);
      setErrors({});
    }
  }, [isOpen, initialDimensions]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!dimensions.width || dimensions.width <= 0) {
      newErrors.width = 'Width must be a positive number';
    }
    
    if (!dimensions.height || dimensions.height <= 0) {
      newErrors.height = 'Height must be a positive number';
    }
    
    if (!dimensions.id || dimensions.id.trim() === '') {
      newErrors.id = 'ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setDimensions(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(dimensions);
    }
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
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{
          color: 'var(--primary-color)', 
          marginBottom: '25px', 
          textAlign: 'center',
          fontSize: '18px'
        }}>
          {isEditing ? 'Edit Sample Dimensions' : 'Enter Sample Dimensions'}
        </h3>

        <div style={{marginBottom: '20px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Width (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={dimensions.width}
            onChange={(e) => handleInputChange('width', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.width ? '2px solid var(--danger-color)' : '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter width in centimeters"
          />
          {errors.width && (
            <p style={{color: 'var(--danger-color)', fontSize: '12px', margin: '5px 0 0 0'}}>
              {errors.width}
            </p>
          )}
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Height (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={dimensions.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.height ? '2px solid var(--danger-color)' : '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter height in centimeters"
          />
          {errors.height && (
            <p style={{color: 'var(--danger-color)', fontSize: '12px', margin: '5px 0 0 0'}}>
              {errors.height}
            </p>
          )}
        </div>

        <div style={{marginBottom: '25px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            ID / Identifier
          </label>
          <input
            type="text"
            value={dimensions.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.id ? '2px solid var(--danger-color)' : '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter sample identifier"
          />
          {errors.id && (
            <p style={{color: 'var(--danger-color)', fontSize: '12px', margin: '5px 0 0 0'}}>
              {errors.id}
            </p>
          )}
        </div>

        <div style={{display: 'flex', gap: '12px'}}>
          <button 
            className="login-button"
            onClick={handleConfirm}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            <CheckCircleFill size={16} />
            Confirm Dimensions
          </button>
          
          <button 
            className="reset-password-button"
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            <XCircleFill size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DimensionsPopup;
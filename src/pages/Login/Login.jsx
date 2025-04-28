import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi, post } from '../../hooks/apiHooks';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');  
  const [isLoading, setIsLoading] = useState(false);  
  const apiFetch = useApi();
  
  // ✅ Get all collections
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault(); // 🚀 Prevents the form from reloading the page
    setError('');
    const data = await post(apiFetch, '/api/auth/login', {
      emailOrPhone: email,
      password
    });
    console.log(data);
    if (!data.token) {
      setError(data.error || 'Login failed.');
    }
    else {
      localStorage.setItem('token', data.token);
      navigate('/');
    }
    setIsLoading(false);
  };  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Hello there, <br></br>Welcome Back</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email or Phone Number'
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </div>
          <button type="submit" className="login-button">
            {isLoading ? <LoadingSpinner size={20} spinnerWidth={4}/> : 'Sign In'}
          </button>
        </form>
        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register" className="login-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

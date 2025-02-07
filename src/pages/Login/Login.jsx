import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SERVER_URL = 'http://localhost:9613';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
  
  try {
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone: email, password }),
      });
  
      const data = await response.json();
      console.log(data)
  
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }
  
      // Store the token (for example, in localStorage)
      localStorage.setItem('token', data.token);
  
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
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
          <button type="submit" className="login-button">Sign in</button>
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

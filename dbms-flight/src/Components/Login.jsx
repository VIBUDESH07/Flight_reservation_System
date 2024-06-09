import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../Styles/Login.css';

const clientId = '449899539300-fijo74rftd3ih5v8tpi98pd2jcjvurfq';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('email', response.data.email);
        document.dispatchEvent(new Event('loginStatusChanged'));
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/passenger');
        }
      } else {
        setError('Invalid credentials');
        localStorage.setItem('isLoggedIn', 'false');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      localStorage.setItem('isLoggedIn', 'false');
      console.error(error);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const result = await axios.post('http://localhost:5000/api/google-login', {
        token: response.credential
      });
      if (result.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', result.data.role);
        localStorage.setItem('email', result.data.email);
        document.dispatchEvent(new Event('loginStatusChanged'));
        if (result.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/passenger');
        }
      } else {
        setError('Google login failed');
        localStorage.setItem('isLoggedIn', 'false');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      localStorage.setItem('isLoggedIn', 'false');
      console.error(error);
    }
  };

  const handleGoogleFailure = (response) => {
    setError('Google login failed');
    localStorage.setItem('isLoggedIn', 'false');
    console.error(response);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-box">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
          <button type="button" className="signup" onClick={handleSignUp}>Sign Up</button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

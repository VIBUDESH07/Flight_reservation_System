import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../Styles/Login.css';

const clientId = '449899539300-fijo74rftd3ih5v8tpi98pd2jcjvurfq.apps.googleusercontent.com'; 

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
        navigate('/add');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const result = await axios.post('http://localhost:5000/api/google-login', {
        token: response.credential
      });
      if (result.data.success) {
        navigate('/add');
      } else {
        setError('Google login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleFailure = (response) => {
    setError('Google login failed');
    console.error(response);
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
          <div >
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
          <br></br>
        </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

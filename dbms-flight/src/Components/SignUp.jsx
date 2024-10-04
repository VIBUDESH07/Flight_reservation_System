import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'passenger',
    otp: '',
  });
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Regex patterns for email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    // Password strength validation
 
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post('http://localhost:5000/api/signup', dataToSend);
      if (response.data.success) {
        setMessage('Signup successful!');
      } else {
        setMessage('OTP verification failed.');
      }
    } catch (error) {
      setMessage('Error verifying OTP.');
    }
  };

  const handleSendOTP = async () => {
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address to send OTP.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email: formData.email });
      if (response.data.success) {
        setMessage('OTP sent to your email.');
        setOtpSent(true);
      } else {
        setMessage('Failed to send OTP.');
      }
    } catch (error) {
      setMessage('Error sending OTP.');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {/* Render OTP input field and Sign Up button only when OTP is sent */}
        {otpSent ? (
          <>
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
          </>
        ) : (
          <button type="button" onClick={handleSendOTP}>Send OTP</button>
        )}
        <p>{message}</p>
      </form>
    </div>
  );
};

export default SignUp;

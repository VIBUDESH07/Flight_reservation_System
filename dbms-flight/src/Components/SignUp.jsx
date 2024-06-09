import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    otp: '',
  });
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false); // State to track whether OTP is sent

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
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
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email: formData.email });
      if (response.data.success) {
        setMessage('OTP sent to your email.');
        setOtpSent(true); // Set otpSent to true when OTP is successfully sent
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
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <label>Role:</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        {/* Render OTP input field and Sign Up button only when OTP is sent */}
        {otpSent ? (
          <>
            <label>OTP:</label>
            <input type="text" name="otp" value={formData.otp} onChange={handleChange} required />
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

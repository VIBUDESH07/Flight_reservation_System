import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../Styles/pics/malediven[1].webp'; // Import your image
import '../Styles/Homepage.css';
// import Sidebar from './Sidebar'; // Import Sidebar component

const HomePage = () => {
  const [fromFocused, setFromFocused] = useState(false);
  const [fromValue, setFromValue] = useState(localStorage.getItem('fromValue') || '');
  const [toFocused, setToFocused] = useState(false);
  const [toValue, setToValue] = useState(localStorage.getItem('toValue') || '');
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState('one-way');

  useEffect(() => {
    localStorage.setItem('fromValue', fromValue);
    console.log(fromValue);
  }, [fromValue]);

  useEffect(() => {
    localStorage.setItem('toValue', toValue);
    console.log(toValue);
  }, [toValue]);

  const handleSearch = () => {
    navigate('/fetch');
  };

  return (
    <div className='cont'>
      
      <div className='image1'>
       {/* Add Sidebar component here */}
      <div className='image'>
        <h1>Travel for enough, you meet yourself...</h1>
        <img src={logoImage} alt='main' />
      </div>
     
      <div className='home-container'>
        <div className='trip-container'>
          <button
            className={`trip ${selectedTrip === 'one-way' ? 'selected' : ''}`}
            onClick={() => setSelectedTrip(selectedTrip === 'one-way' ? '' : 'one-way')}
          >
            One-way
          </button>
          <button
            className={`trip ${selectedTrip === 'round-trip' ? 'selected' : ''}`}
            onClick={() => setSelectedTrip(selectedTrip === 'round-trip' ? '' : 'round-trip')}
          >
            Round-trip
          </button>
        </div>
        <div className='inputs-container'>
          <div className='from-container'>
            <label className={`from-label ${fromFocused || fromValue ? 'active' : ''}`}>FROM</label>
            <input
              type='text'
              className='from'
              placeholder=''
              value={fromValue}
              onFocus={() => setFromFocused(true)}
              onBlur={() => setFromFocused(false)}
              onChange={(e) => setFromValue(e.target.value)}
            />
          </div>
          <div className='arrow-icon'>  
            <FontAwesomeIcon icon={faArrowRight} />
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className='to-container'>
            <label className={`to-label ${toFocused || toValue ? 'active' : ''}`}>TO</label>
            <input
              type='text'
              className='to'
              placeholder=''
              value={toValue}
              onFocus={() => setToFocused(true)}
              onBlur={() => setToFocused(false)}
              onChange={(e) => setToValue(e.target.value)}
            />
          </div>

          <div className='button-container'>
          <button className='search-button' onClick={handleSearch}>
            Search
          </button>
          
        </div>
          
          </div>        
        
        
        </div>
        <div className="to-direct-container">
          <div className="to-direct">
            <input type="checkbox" className="direct" />
            <label>Direct Flight Only</label>
          </div>
          <select className="adults-dropdown">
            <option value="1">Economy</option>
            <option value="2">Business Class</option>
            <option value="3">First Class</option>
          </select>
          <select className="card-dropdown">
            <option value="1">Debit Card</option>
            <option value="2">UPI</option>
            <option value="3">Credit Card</option>
          </select>
        </div>
       
      </div>
    </div>
  );
}

export default HomePage;

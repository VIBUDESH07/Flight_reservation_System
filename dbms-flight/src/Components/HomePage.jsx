import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../Styles/pics/malediven[1].webp'; // Import your image
import '../Styles/Homepage.css';

const HomePage = () => {
  const [fromFocused, setFromFocused] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [toFocused, setToFocused] = useState(false);
  const [toValue, setToValue] = useState('');

  return (
    <div>
      <div className='image'>
        <h1>Travel for enough, you meet yourself...</h1>
        <img src={logoImage} alt='main' />
      </div>
      <div className={`button-container`}>
        <button className='flight-button'>
          <FontAwesomeIcon icon={faPlane} className='flight-icon' />
          Flights
        </button>
      </div>
      <div className='container'>
        <div className='trip-container'>
          <button className='trip'>One-way</button>
          <button className='trip'>Round-trip</button>
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
         <FontAwesomeIcon icon={faArrowRight}  />
          <FontAwesomeIcon icon={faArrowLeft}  />
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
        </div>
      </div>
    </div>
  );
}

export default HomePage;

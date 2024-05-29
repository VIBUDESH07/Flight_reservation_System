import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../Styles/pics/malediven[1].webp'; // Import your image
import '../Styles/Homepage.css';

const HomePage = () => {
  const [fromFocused, setFromFocused] = useState(false);
  const [fromValue, setFromValue] = useState('');

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
        <button className='trip'>One-way</button>
        <button className='trip'>Round-trip</button>
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
      </div>
    </div>
  );
}

export default HomePage;

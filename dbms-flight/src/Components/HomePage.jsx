import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../Styles/pics/malediven[1].webp'; // Import your image
import '../Styles/Homepage.css';

const HomePage = () => {
 
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
        <button className='trip'>Multi-city</button>
      </div>
    </div>
  );
}

export default HomePage;

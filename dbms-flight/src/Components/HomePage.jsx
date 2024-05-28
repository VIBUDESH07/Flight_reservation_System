import React from 'react';
import logoImage from '../Styles/pics/malediven[1].webp'; // Import your image
import '../Styles/Homepage.css';

const HomePage = () => {
  return (
    <div>
      <div className='image'>
        <h1>Travel for enough, you meet yourself...</h1>
        <img src={logoImage} alt='main' />
      </div>
      <div className='container'>

      </div>
    </div>
  );
}

export default HomePage;

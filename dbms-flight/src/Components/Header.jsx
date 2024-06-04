import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState) {
      setIsLoggedIn(JSON.parse(storedAuthState));
    }
  }, []);

  const simulateLogin = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const simulateLogout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      const success = await simulateLogout();
      if (success) {
        localStorage.setItem('isLoggedIn', false);
        setIsLoggedIn(false);
      }
    } else {
      const success = await simulateLogin();
      if (success) {
        localStorage.setItem('isLoggedIn', true);
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <div className='navbar'>
      <Link to='/home' className='logo-container'>
        <h5 className='logo'>Let's</h5>
        <FontAwesomeIcon icon={faPlane} className='home-icon' />
        <h5 className='logo'>Travel</h5>
      </Link>
      <div className='search-container'>
        <input type='text' className='search' placeholder='   Search...' />
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
      </div>
      <div className='btn'>
        {isLoggedIn ? (
          <button id="logout" onClick={handleAuthClick}>Log out</button>
        ) : (
          <Link to='/login'>
            <button id="login" onClick={handleAuthClick}>Log in</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

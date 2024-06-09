import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/header.css';
 // Import the Sidebar component

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState) {
      setIsLoggedIn(JSON.parse(storedAuthState));
    }

    const handleLoginStatusChange = () => {
      const storedAuthState = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(storedAuthState === 'true');
    };

    document.addEventListener('loginStatusChanged', handleLoginStatusChange);

    return () => {
      document.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    document.dispatchEvent(new Event('loginStatusChanged')); // Dispatch custom event
    navigate('/login'); // Redirect to login page after logout
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  return (

    <div className='navbar'>
      <Link to='/' className='logo-container'>
        <h5 className='logo'>Let's</h5>
        <FontAwesomeIcon icon={faPlane} className='home-icon' />
        <h5 className='logo'>Travel</h5>
      </Link>

      <Link to='/home' className='logo-container'>
        <h5 className='logo1'>Let's</h5>
        <FontAwesomeIcon icon={faPlane} className='home-icon' />  
        <h5 className='logo2'>Travel</h5>

      </Link>
      <div className='search-container'>
        <input type='text' className='search' placeholder='Search...' />
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
      </div>
      <div className='btn'>
        {isLoggedIn ? (
          <button id="logout" onClick={handleLogout}>Log out</button>
        ) : (
          <button id="login" onClick={handleLoginRedirect}>Log in</button>
        )}
      </div>
    </div>
  );
};

export default Header;

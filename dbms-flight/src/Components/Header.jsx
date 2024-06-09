import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../Styles/header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to toggle Sidebar
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

  const toggleSidebar = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setSidebarOpen(open);
  };

  return (
    <div>
      <div className='navbar'>
        <div className='logo-container' onClick={toggleSidebar(true)}>
          <h5 className='logo1'>Let's</h5>
          <FontAwesomeIcon icon={faPlane} className='home-icon' />
          <h5 className='logo2'>Travel</h5>
        </div>
        <div className='search-container'>
          <input type='text' className='search' placeholder='Search For Flights..' />
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
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass props to Sidebar */}
    </div>
  );
};

export default Header;

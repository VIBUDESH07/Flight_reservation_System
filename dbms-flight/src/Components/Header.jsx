import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
  return (
    <div className='navbar'>
      <Link to='/home' className='logo-container'>
        <h5 className='logo'>Let's</h5>
        <FontAwesomeIcon icon={faPlane} className='home-icon' />
        <h5 className='logo'>Travel</h5>
      </Link>
      <div className='search-container'>
        <input type='text' className='search' placeholder='   Search...'/>
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
      </div>
      <div class='btn'>
      <Link to='/login'>
        <button id="login">Log in</button>
      </Link>
      </div>
    </div>
  );
}

export default Header;

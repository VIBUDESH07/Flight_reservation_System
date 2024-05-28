import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../Styles/header.css';

const Header = () => {
  return (
    <div className='navbar'>
      <Link to='/home'>
        <FontAwesomeIcon icon={faHome} className='home-icon' />
      </Link>
      <div className='search-container'>
        <input type='text' className='search' placeholder='        Search...'/>
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
      </div>
      <Link to='/login'>
        <button id="login">Log in</button>
      </Link>
    </div>
  );
}

export default Header;

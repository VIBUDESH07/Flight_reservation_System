// Components/Layout.js
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      
        <Outlet /> {/* This is where the nested routes will be rendered */}

    </div>
  );
}

export default Layout;

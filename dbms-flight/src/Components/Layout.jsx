// src/Components/Layout.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar'; // Import Sidebar component
import { Outlet } from 'react-router-dom';
import '../Styles/Layout.css'; // Make sure to style the layout as needed

const Layout = () => {
  return (
    <div className="layout">
      <Header />
    
        <main className="main-content">
          <Outlet /> {/* This is where the nested routes will be rendered */}
        </main>
      
    </div>
  );
}

export default Layout;

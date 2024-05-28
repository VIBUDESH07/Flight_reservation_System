import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import HomePage from './HomePage'

const Layout = () => {
  return (
    <div>
        <Header/>
        <HomePage/>
    </div>
  )
}

export default Layout
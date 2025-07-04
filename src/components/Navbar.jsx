import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">
            Complain Box
          </NavLink>
        </div>
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                🏠 Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/progress" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                📊 Progress
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/admin" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                🗺️ Admin Map
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                📋 Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

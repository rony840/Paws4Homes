// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/img/pawIcon.png';

const Header = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <header>
      <div className="header-container">
        <div className="gradient-background"></div>
        <div className="nav-links">
          <div className="nav-item">Explore dogs</div>
          <div className="nav-item">Match me with a dog</div>

          {isLoggedIn ? (
            <button onClick={onLogout}>My Account</button>
          ) : (
            <Link to="/login" className="nav-item login-link">Login</Link>
          )}
        </div>

        <Link to="/" className="brand-link">
          <div className="brand-name">Paws4Homes</div>
          <img className="brand-logo" src={logo} alt="Brand Logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;

// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/img/pawIcon.png';

const Header = ({ isLoggedIn, onLogin, onLogout, isBusinessAccount , handleLogout  }) => {

  const navigate = useNavigate();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    console.log("Mouse entered 'My Account'");
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    console.log("Mouse left 'My Account'");
    setShowDropdown(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch('http://localhost:8000/get_unread_message_count/', {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUnreadCount(data.unread_count);
        } catch (error) {
          console.error('Error fetching unread message count:', error);
        }
      }
    };
  
    fetchUnreadCount();
  }, [isLoggedIn, location]);
  

  return (
    <header>
      <div className="header-container">
        <div className="gradient-background"></div>
        <div className="nav-links">
        <Link to="/explore" className="nav-item login-link">Explore dogs</Link>
        <Link to="/match-with-a-dog" className="nav-item login-link">Match me with a dog</Link>
          
          

          {isLoggedIn ? (
        <div 
          className="nav-item login-link"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          My Account{unreadCount > 0 && <span className="unread-count">({unreadCount})</span>}
          {showDropdown && (
            <div className="dropdown-menu">
              {isBusinessAccount ? (
                <>
                  {/* Items for business account */}
                  <div className="dropdown-item" onClick={() => handleNavClick('/my-account')}>My Account</div>
                  <div className="dropdown-item" onClick={() => handleNavClick('/manage-listings')}>Manage Listings</div>
                  <div className="dropdown-item" onClick={() => handleNavClick('/inbox')}>Inbox{unreadCount > 0 && <span className="unread-count-dropdown">({unreadCount})</span>} </div>
                  <div className="dropdown-item" onClick={handleLogout}>Log out</div>
                </>
              ) : (
                <>
                  {/* Items for customer account */}
                  <div className="dropdown-item" onClick={() => handleNavClick('/my-account')}>My Account</div>
                  <div className="dropdown-item" onClick={() => handleNavClick('/inbox')}>  Inbox{unreadCount > 0 && <span className="unread-count-dropdown">({unreadCount})</span>}</div>
                  <div className="dropdown-item" onClick={handleLogout}>Log out</div>
                </>
              )}
            </div>
          )}
        </div>
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

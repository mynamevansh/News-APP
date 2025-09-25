import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowDropdown(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="profile-trigger" onClick={toggleDropdown}>
        <img 
          src={user.picture || '/default-avatar.png'} 
          alt={user.name}
          className="profile-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff&size=40`;
          }}
        />
        <span className="profile-name">{user.name.split(' ')[0]}</span>
        <svg 
          className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      {showDropdown && (
        <>
          <div className="dropdown-overlay" onClick={closeDropdown}></div>
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <img 
                src={user.picture || '/default-avatar.png'} 
                alt={user.name}
                className="dropdown-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=667eea&color=fff&size=60`;
                }}
              />
              <div className="dropdown-user-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="dropdown-content">
              <div className="dropdown-section">
                <h5>Account</h5>
                <button className="dropdown-item" disabled>
                  <span>⚙️</span>
                  Preferences (Coming Soon)
                </button>
                <button className="dropdown-item" disabled>
                  <span>📊</span>
                  My Voting History
                </button>
              </div>

              <div className="dropdown-section">
                <button 
                  className="dropdown-item logout-item" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <span>🚪</span>
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
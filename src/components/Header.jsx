import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import '../index.css';

const Header = ({ onNavigate }) => {
  const { state, dispatch } = useContext(AppContext);
  
  // Set the "boss" username
  const bossUsername = 'yash';

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleClearAllData = () => {
    // A confirmation step is a good practice to prevent accidental deletion
    if (window.confirm('Are you sure you want to clear all user data? This cannot be undone.')) {
      localStorage.clear();
      dispatch({ type: 'LOGOUT' }); // Log out after clearing
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Habit Tracker</h1>
        {state.user && (
          <nav>
            <button className="nav-btn" onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button className="nav-btn" onClick={() => onNavigate('habits')}>My Habits</button>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
            {/* Conditional Rendering: Only show the button if the user is the boss */}
            {state.user.username === bossUsername && (
              <button className="nav-btn" onClick={handleClearAllData}>
                Clear All Data
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
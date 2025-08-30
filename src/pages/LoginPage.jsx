import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import '../index.css';

const LoginPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      dispatch({ type: 'LOGIN', payload: { username } });
    }
  };

  useEffect(() => {
    // Check if the user has data in local storage
    if (username.trim()) {
      const userKey = `habitTrackerState_${username}`;
      const userData = localStorage.getItem(userKey);
      setIsNewUser(!userData);
    }
  }, [username]);

  return (
    <div className="login-container">
      <h2>Welcome to Habit Tracker</h2>
      <p>Please enter a username to continue.</p>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">
          {isNewUser ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
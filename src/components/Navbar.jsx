import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, loading } = useAuth();

    return (
        <header className="navbar">
            <Link to="/" className="logo">Habit<span style={{color: '#90EE90'}}>Tracker</span></Link>
            {user && (
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Today</NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
                    <NavLink to="/habits" className={({ isActive }) => isActive ? 'active' : ''}>Habits</NavLink>
                    <button onClick={logout} disabled={loading}>Logout</button>
                </nav>
            )}
        </header>
    );
};

export default Navbar;

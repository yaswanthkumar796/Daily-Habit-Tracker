import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';
import { useHabits } from './context/HabitContext.jsx'; // This is not strictly needed here but is good for debugging

import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import HabitsPage from './pages/Habits.jsx';
import CalendarPage from './pages/Calendar.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth(); // Using authLoading for initial check
    
    if (authLoading) {
        return <div className="loading-state">Loading user session...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
        
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

       
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/calendar" element={
                <ProtectedRoute>
                    <CalendarPage />
                </ProtectedRoute>
            } />
            <Route path="/habits" element={
                <ProtectedRoute>
                    <HabitsPage />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { HabitProvider } from './context/HabitContext.jsx';


import AppRoutes from './routes.jsx';
import Navbar from './components/Navbar.jsx';
import Alert from './components/Alert.jsx';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <HabitProvider>
                    <div className="app-container">
                        <Alert />
                        <Navbar />
                        <main className="main-content">
                            <AppRoutes />
                        </main>
                    </div>
                </HabitProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
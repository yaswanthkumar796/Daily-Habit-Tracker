import React, { useContext, useState, useEffect } from 'react';
import { AppProvider, AppContext } from './AppContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/HabitsPage';
import LoginPage from './pages/LoginPage';
import './index.css';

const AppContent = () => {
  const { state } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (!state.user) {
      setCurrentPage('login');
    } else {
      setCurrentPage('dashboard');
    }
  }, [state.user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitsPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {state.user && <Header onNavigate={setCurrentPage} />}
      <main className="main-content">
        {renderPage()}
      </main>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="container">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;
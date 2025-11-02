import React, { useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext.jsx';

const Alert = () => {
    const { alert, setAlert } = useAuth();


    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert, setAlert]);

    if (!alert) return null;
    const color = alert.type === 'error' ? '#dc3545' : '#4CAF50';
    
    return (
        <div className="alert" style={{ backgroundColor: color }}>
            {alert.message}
        </div>
    );
};

export default Alert;
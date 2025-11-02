import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 

// ---  FIREBASE CONFIGURATION  ---
const firebaseConfig = {
    apiKey: "AIzaSyCLxlz-vBufQqhS03L8bp18h-AfEnr49cE",
    authDomain: "daily-habit-tracker-e9980.firebaseapp.com",
    projectId: "daily-habit-tracker-e9980",
    storageBucket: "daily-habit-tracker-e9980.firebasestorage.app",
    messagingSenderId: "719096213879",
    appId: "1:719096213879:web:07343e927e2cb45a3af172",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); // Export db here
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); 
    const [alert, setAlert] = useState(null);
    const [authReady, setAuthReady] = useState(false); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            setAuthReady(true);
        });

        // Set authReady true  means user is not signed , so show him login ,signup pages ,,
        if (!user && !authReady) {
            setAuthReady(true);
        }

        return unsubscribe;
    }, [user, authReady]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    const login = async (email, password) => {
        setAuthLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAlert({ message: "Login successful! Welcome back.", type: 'success' });
            return true;
        } catch (error) {
            setAlert({ message: "Login failed: " + error.message, type: 'error' }); 
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (email, password) => {
        setAuthLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setAlert({ message: "Account created successfully! Welcome!", type: 'success' });
            return true;
        } catch (error) {
            setAlert({ message: "Registration failed: " + error.message, type: 'error' });
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setAuthLoading(true);
        try {
            await signOut(auth);
            setAlert({ message: "Logged out successfully.", type: 'success' });
        } catch (error) {
            setAlert({ message: "Logout failed.", type: 'error' });
        } finally {
            setAuthLoading(false);
        }
    };

    const value = {
        user,
        authLoading,
        authReady,
        alert,
        setAlert,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { auth };
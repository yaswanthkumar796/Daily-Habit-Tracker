import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getFirestore, 
    collection, 
    query, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    serverTimestamp 
} from 'firebase/firestore';

import { auth, useAuth } from './AuthContext.jsx'; 
import { calculateStreaks, formatDate } from '../utils/streakCalculator.js'; 

const appId = typeof __app_id !== 'undefined' ? __app_id : 'habit-tracker-default';
const db = getFirestore();

const HabitContext = createContext();

export const useHabits = () => {
    return useContext(HabitContext);
};

export const HabitProvider = ({ children }) => {
 
    const { user, setAlert } = useAuth(); 
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const getHabitsCollectionRef = useCallback(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'habits');
    }, [user]);

    useEffect(() => {
        const habitsRef = getHabitsCollectionRef();
        
        if (!habitsRef || !user || !user.uid) {
            setHabits([]);
            return () => {};
        }

        const q = query(habitsRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedHabits = snapshot.docs.map(doc => {  //snapshot.docs.map(...) produce a array which contains all habits data in {} form
                const data = doc.data();
                const habitData = {
                    id: doc.id,
                    name: data.name,
                    time: data.time || 'morning', //if left becomes false doesnt exist right mornin will be stored
                    completion: data.completion || {},
                    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                };
                
                const streakData = calculateStreaks(habitData.completion);
                
                return { ...habitData, streakData };
            });
            setHabits(loadedHabits);
        }, (error) => {
            console.error("Error fetching habits:", error);
            setAlert({ message: "Failed to load habits.", type: 'error' });
        });

        return () => unsubscribe();
    }, [user, getHabitsCollectionRef, setAlert]); 

    const addHabit = async (habitData) => {
        setLoading(true);
        const habitsRef = getHabitsCollectionRef();
        if (!habitsRef) {
            setAlert({ message: "User not authenticated or context error.", type: 'error' });
            setLoading(false);
            return false;
        }
        
        try {
            await addDoc(habitsRef, {
                name: habitData.name,
                time: habitData.time,
                completion: {}, 
                createdAt: serverTimestamp(),
            });
            setAlert({ message: `Habit "${habitData.name}" added successfully.`, type: 'success' });
            return true;
        } catch (error) {
            console.error("Error adding habit:", error);
            setAlert({ message: "Failed to add habit.", type: 'error' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteHabit = async (habitId, habitName) => {
        setLoading(true);
        const habitsRef = getHabitsCollectionRef();
        if (!habitsRef) return setAlert({ message: "User not authenticated.", type: 'error' });

        try {
            const docRef = doc(habitsRef, habitId);
            await deleteDoc(docRef);
            setAlert({ message: `Habit "${habitName}" deleted successfully.`, type: 'success' });
        } catch (error) {
            console.error("Error deleting habit:", error);
            setAlert({ message: "Failed to delete habit.", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const toggleCompletion = async (habitId, date) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const habitsRef = getHabitsCollectionRef();
        if (!habitsRef) return setAlert({ message: "User not authenticated.", type: 'error' });

        const docRef = doc(habitsRef, habitId);
        const isCompleted = habit.completion[date] || false;
        
        const newCompletion = { ...habit.completion };
        if (isCompleted) {
            delete newCompletion[date];
        } else {
            newCompletion[date] = true;
        }

        try {
            await updateDoc(docRef, { completion: newCompletion });
            setAlert({ 
                message: isCompleted 
                    ? `Completion undone for ${habit.name} on ${date}.` 
                    : `Habit ${habit.name} marked as done on ${date}!`, 
                type: 'success' 
            });
        } catch (error) {
            console.error("Error toggling completion:", error);
            setAlert({ message: "Failed to update habit completion.", type: 'error' });
        }
    };


    const value = {
        habits,
        habitLoading: loading,
        addHabit,
        deleteHabit,
        toggleCompletion,
        formatDate,
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};

// React requires immutability — meaning:

// You should not directly change the original state object.
// Instead, make a copy, update the copy, and then set the updated copy as new state.

// This ensures React can detect the change and re-render properly.
import React from 'react';
import { useHabits } from '../context/HabitContext.jsx';
import HabitForm from '../components/HabitForm.jsx';
import HabitCard from '../components/HabitCard.jsx';

const HabitsPage = () => {
    const { habits, habitLoading } = useHabits();

    return (
        <div className="page-content habits-page">
            <div className="habit-management-section">
                <h2>Manage Existing Habits</h2>
                <div className="habit-list">
                    {habits.length === 0 ? (
                        <p className="empty-state-text">No habits added yet. Use the form below!</p>
                    ) : (
                        habits.map(habit => (
                            <HabitCard key={habit.id} habit={habit} />
                        ))
                    )}
                </div>
                <hr className="divider" />
            </div>
            
            <HabitForm />
            
            {habitLoading && <div className="loading-overlay">Updating...</div>}
        </div>
    );
};

export default HabitsPage;
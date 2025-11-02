import React from 'react';
import { useHabits } from '../context/HabitContext';
import StreakBadge from './StreakBadge';


const HabitCard = ({ habit }) => {
    const { deleteHabit, habitLoading } = useHabits();

    const handleDelete = () => {
        deleteHabit(habit.id, habit.name);
    };

    return (
        <div className="habit-card">
            <div>
                <span className="habit-card-name">{habit.name}</span>
                <br />
                <span className="habit-card-time">{habit.time}</span>
            </div>
            <div className="habit-card-actions">
                <StreakBadge habit={habit} />
                <button 
                    className="delete-button" 
                    onClick={handleDelete}
                    disabled={habitLoading}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default HabitCard;

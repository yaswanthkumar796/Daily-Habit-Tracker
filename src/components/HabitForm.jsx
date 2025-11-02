import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { useNavigate } from 'react-router-dom';

const HabitForm = () => {
    const { addHabit, habitLoading } = useHabits();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [time, setTime] = useState('morning');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === '') {
            return;
        }
        
        const success = await addHabit({ name: name.trim(), time });
        if (success) {
            navigate('/'); 
        }

    };

    return (
        <div className="form-container">
            <h2>Add a New Habit</h2>
            <form onSubmit={handleSubmit} className="habit-form">
                <div className="form-group">
                    <label htmlFor="habit-name">Habit Name</label>
                    <input
                        id="habit-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Drink 8 Glasses of Water"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Time Slot</label>
                    
                    <div className="radio-group">
                        {['morning', 'afternoon', 'night'].map(t => (
                            <label key={t} className="radio-label">
                                <input
                                    type="radio"
                                    name="time"
                                    value={t}
                                    checked={time === t}
                                    onChange={() => setTime(t)}
                                />
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" disabled={habitLoading}>
                    {habitLoading ? 'Adding...' : 'Add Habit'}
                </button>
                <button type="button" onClick={() => navigate('/')} className="secondary-button">
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default HabitForm;

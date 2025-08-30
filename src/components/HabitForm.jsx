import React, { useState } from 'react';
import '../index.css';

const HabitForm = ({ habit, onClose, onSave }) => {
  const [name, setName] = useState(habit ? habit.name : '');
  const [time, setTime] = useState(habit ? habit.time : 'morning');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        id: habit ? habit.id : Date.now(),
        name,
        time,
        history: habit ? habit.history : {},
      });
      onClose();
    }
  };

  return (
    <div className="habit-form-container">
      <h3>{habit ? 'Edit Habit' : 'Add New Habit'}</h3>
      <form onSubmit={handleSubmit} className="habit-form">
        <label>
          Habit Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Time of Day
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="save-btn">Save Habit</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
import React from 'react';
import '../index.css';

const HabitItem = ({ habit, onEdit, onDelete }) => {
  return (
    <div className="habit-item">
      <span>{habit.name} ({habit.time})</span>
      <div className="habit-actions">
        <button className="edit-btn" onClick={() => onEdit(habit)}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(habit.id)}>Delete</button>
      </div>
    </div>
  );
};

export default HabitItem;
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import HabitForm from '../components/HabitForm';
import HabitItem from '../components/HabitItem';
import '../index.css';

const HabitsPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleSave = (habit) => {
    if (habit.id === editingHabit?.id) {
      dispatch({ type: 'UPDATE_HABIT', payload: habit });
    } else {
      dispatch({ type: 'ADD_HABIT', payload: habit });
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      dispatch({ type: 'DELETE_HABIT', payload: id });
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  return (
    <div className="habits-container">
      <h2>Your Habits</h2>
      {!showForm && (
        <button className="add-habit-btn" onClick={() => setShowForm(true)}>Add New Habit</button>
      )}

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      )}

      <div className="habit-list">
        {state.habits.length === 0 ? (
          <p>No habits added yet. Click "Add New Habit" to get started!</p>
        ) : (
          state.habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
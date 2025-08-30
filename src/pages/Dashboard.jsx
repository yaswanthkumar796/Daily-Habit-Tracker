import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import StreakBadge from '../components/StreakBadge';
import { getWeek, formatDate, calculateStreaks } from '../utils';
import '../index.css';

const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const user = state.user || { username: 'Guest' };
  const habits = state.habits;

  const today = formatDate(new Date());
  const selectedDay = formatDate(selectedDate);
  const currentWeek = getWeek(selectedDate);

  const handleHabitComplete = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const history = { ...habit.history };
        if (history[selectedDay]) {
          delete history[selectedDay];
        } else {
          history[selectedDay] = true;
        }
        return { ...habit, history };
      }
      return habit;
    });
    dispatch({ type: 'SET_HABITS', payload: updatedHabits });
  };

  return (
    <div className="dashboard-container">
      <h2>Hello, {user.username}!</h2>
      <p>Today is a great day to build good habits!</p>

      <div className="calendar-nav">
        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}>&lt; Prev Week</button>
        <h3 className="week-label">
          {currentWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          -
          {currentWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </h3>
        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}>Next Week &gt;</button>
      </div>

      <div className="calendar">
        {currentWeek.map((day) => {
          const formattedDay = formatDate(day);
          const isSelected = formattedDay === selectedDay;
          const isToday = formattedDay === today;
          
          return (
            <div
              key={formattedDay}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <strong>{day.getDate()}</strong>
            </div>
          );
        })}
      </div>

      <div className="daily-habits">
        <h3>Habits for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
        {habits.length === 0 ? (
          <p>You have no habits yet. Go to the "My Habits" page to add one!</p>
        ) : (
          <ul className="habit-list-daily">
            {habits.map((habit) => {
              const isComplete = habit.history[selectedDay];
              const streaks = calculateStreaks(habit);
              return (
                <li key={habit.id} className={`daily-habit-item ${isComplete ? 'complete' : ''}`}>
                  <div className="habit-info">
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-time">({habit.time})</span>
                  </div>
                  <div className="habit-action">
                    <StreakBadge streak={streaks} />
                    <button
                      className={`complete-btn ${isComplete ? 'undo' : ''}`}
                      onClick={() => handleHabitComplete(habit.id)}
                    >
                      {isComplete ? 'Undo' : 'Done'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
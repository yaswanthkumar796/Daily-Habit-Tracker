import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext.jsx';

const CalendarPage = () => {
    const { habits, toggleCompletion, habitLoading, formatDate } = useHabits();
    const today = formatDate(new Date());

    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const start = new Date();
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
        start.setDate(diff);
        return start;
    });

    const startOfWeek = new Date(currentWeekStart);

    const daysOfWeek = useMemo(() => {
        const days = [];
        const currentDate = new Date(startOfWeek);
        for (let i = 0; i < 7; i++) {
            days.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    }, [startOfWeek]); 

    const changeWeek = (direction) => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newDate);
    };

    const getWeekRange = () => {
        const start = new Date(currentWeekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        return `${start} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    return (
        <div className="page-content calendar-page">
            <div className="calendar-header">
                <button onClick={() => changeWeek('prev')} disabled={habitLoading}>&lt; Prev Week</button>
                <h2>{getWeekRange()}</h2>
                <button onClick={() => changeWeek('next')} disabled={habitLoading}>Next Week &gt;</button>
            </div>

            <div className="calendar-grid">
                <div className="calendar-row header-row">
                    <div className="habit-name-col">Habit</div>
                    {daysOfWeek.map((dateStr) => {
                        const dateObj = new Date(dateStr);
                        const isToday = dateStr === today;
                        return (
                            <div key={dateStr} className={`day-col ${isToday ? 'today-col' : ''}`}>
                                <span className="day-name">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                <span className="day-date">{dateObj.getDate()}</span>
                            </div>
                        );
                    })}
                </div>
                {habits.length === 0 ? (
                    <div className="empty-calendar">No habits to display.</div>
                ) : (
                    habits.map(habit => (
                        <div key={habit.id} className="calendar-row habit-row">
                            <div className="habit-name-col">{habit.name}</div>
                            {daysOfWeek.map(dateStr => {
                                const isCompleted = habit.completion[dateStr];
                                return (
                                    <div 
                                        key={dateStr} 
                                        className={`day-col completion-cell ${isCompleted ? 'completed' : ''}`}
                                        onClick={() => toggleCompletion(habit.id, dateStr)}
                                    >
                                        {isCompleted ? '✓' : ''}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
            {habitLoading && <div className="loading-overlay">Updating...</div>}
        </div>
    );
};

export default CalendarPage;
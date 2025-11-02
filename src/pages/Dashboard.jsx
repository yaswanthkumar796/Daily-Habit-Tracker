import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext.jsx';
import StreakBadge from '../components/StreakBadge.jsx';

const DashboardPage = () => {
    const { habits, toggleCompletion, habitLoading, formatDate } = useHabits();
    const navigate = useNavigate();
    const today = formatDate(new Date());

    const todayHabits = useMemo(() => {
        return habits
            .filter(h => h.time === 'morning' || h.time === 'afternoon' || h.time === 'night')
            .sort((a, b) => {
                const order = { morning: 1, afternoon: 2, night: 3 };
                return order[a.time] - order[b.time];
            });
    }, [habits]);

    const getHabitsByTime = (time) => todayHabits.filter(h => h.time === time);

    const renderHabitList = (time, list) => {
        if (list.length === 0) return null;
        return (
            <div key={time} className="time-slot-card">
                <h3>{time.charAt(0).toUpperCase() + time.slice(1)}</h3>
                {list.map(habit => {
                    const isCompleted = habit.completion[today];
                    return (
                        <div key={habit.id} className="habit-item">
                            <span className="habit-name">{habit.name}</span>
                            <button
                                className={`completion-toggle ${isCompleted ? 'completed' : ''}`}
                                onClick={() => toggleCompletion(habit.id, today)}
                                disabled={habitLoading}
                            >
                                {isCompleted ? 'DONE' : 'Mark Done'}
                            </button>
                            <StreakBadge habit={habit} />
                        </div>
                    );
                })}
            </div>
        );
    };

    const morningHabits = getHabitsByTime('morning');
    const afternoonHabits = getHabitsByTime('afternoon');
    const nightHabits = getHabitsByTime('night');
    
    return (
        <div className="page-content dashboard-page">
            <h2>Today's Habits: {today}</h2>
            {habits.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't added any habits yet.</p>
                    <button onClick={() => navigate('/habits')}>Add Your First Habit</button>
                </div>
            ) : (
                <>
                    {renderHabitList('Morning', morningHabits)}
                    {renderHabitList('Afternoon', afternoonHabits)}
                    {renderHabitList('Night', nightHabits)}

                    <div className="add-habit-link">
                        <button className="secondary-button" onClick={() => navigate('/habits')}>+ Manage Habits</button>
                    </div>
                </>
            )}
       
            {habitLoading && <div className="loading-overlay">Updating...</div>}
        </div>
    );
};

export default DashboardPage;
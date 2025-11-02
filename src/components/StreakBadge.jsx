import React from 'react';


const StreakBadge = ({ habit }) => {

    const streak = habit.streakData?.current || 0;
    const longest = habit.streakData?.longest || 0;

    return (
        <div className="streak-badge">
            <div className="current-streak">
                🔥 {streak} {streak === 1 ? 'Day' : 'Days'}
                <span className="badge-label">Current</span>
            </div>
            <div className="longest-streak">
                🏆 {longest} {longest === 1 ? 'Day' : 'Days'}
                <span className="badge-label">Longest</span>
            </div>
        </div>
    );
};

export default StreakBadge;

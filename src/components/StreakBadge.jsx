import React from 'react';
import '../index.css';

const StreakBadge = ({ streak }) => {
  return (
    <div className="streak-badge">
      <span className="current-streak">{streak.current}🔥 Current</span>
      <span className="longest-streak">{streak.longest}🏆 Longest</span>
    </div>
  );
};

export default StreakBadge;
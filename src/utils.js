export const getWeek = (date = new Date()) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }
  return week;
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const calculateStreaks = (habit) => {
  const history = habit.history;
  const today = formatDate(new Date());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedDates = Object.keys(history).sort();

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    if (history[date]) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = formatDate(yesterday);
  
  // If today is complete, start counting from today
  if (history[today]) {
    currentStreak = 1;
    let daysAgo = 1;
    while(true) {
        let prevDay = new Date();
        prevDay.setDate(prevDay.getDate() - daysAgo);
        const formattedPrevDay = formatDate(prevDay);
        
        if (history[formattedPrevDay]) {
            currentStreak++;
            daysAgo++;
        } else {
            break;
        }
    }
  } else if (history[formattedYesterday]) {
    // If today is not complete, but yesterday was, current streak is yesterday's streak
    currentStreak = 1;
    let daysAgo = 2;
    while(true) {
      let prevDay = new Date();
      prevDay.setDate(prevDay.getDate() - daysAgo);
      const formattedPrevDay = formatDate(prevDay);
      if (history[formattedPrevDay]) {
          currentStreak++;
          daysAgo++;
      } else {
          break;
      }
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak,
  };
};
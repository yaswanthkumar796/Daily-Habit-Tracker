// function for date formatting (YYYY-MM-DD)
export const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

const today = formatDate(new Date());



export const calculateStreaks = (completion) => {
    //  sort all completed dates
    const completionDates = Object.keys(completion)
        .filter(date => completion[date]) 
        .sort(); 

    let longestStreak = 0;
    let maxStreak = 0;
    
    if (completionDates.length === 0) {
        return { current: 0, longest: 0, lastCompletedDate: null };
    }
    
    // 2.  longest streak 
    let streak = 0;
    for (let i = 0; i < completionDates.length; i++) {
        const dateStr = completionDates[i];
        
        if (i === 0) {
            streak = 1;
        } else {
            const prevDate = new Date(completionDates[i - 1]);
            const currentDate = new Date(dateStr);
            // Calculate difference in days ,it gives  in milli secs (currentDate - prevDate)
            const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                streak++;
            } else if (diffDays > 1) {
                streak = 1; // Streak broken because of gap, restart
            }
        }
        maxStreak = Math.max(maxStreak, streak);
    }
    longestStreak = maxStreak;

    // 3. Calculate the current streak (must be consecutive up to today or yesterday)
    let currentStreak = 0;
    let tempDate = new Date(); 

    // Check if todays habit is completed
    if (completion[today]) {
        currentStreak = 1;
        tempDate.setDate(tempDate.getDate() - 1);
    } else {
        // If not completed today, check yesterday
        tempDate.setDate(tempDate.getDate() - 1);
        if (completion[formatDate(tempDate)]) {
            currentStreak = 1; // Streak is active but not yet marked today
            tempDate.setDate(tempDate.getDate() - 1); // Move pointer back one more day
        } else {
            // Streak broken or never started
            return { 
                current: 0, 
                longest: longestStreak, 
                lastCompletedDate: completionDates[completionDates.length - 1] 
            };
        }
    }
    
    // Check backwards consecutively
    while(true) {
        const checkDateStr = formatDate(tempDate);
        if (completion[checkDateStr]) {
            currentStreak++;
            tempDate.setDate(tempDate.getDate() - 1);
        } else {
            break;
        }
    }


    return {
        current: currentStreak, 
        longest: longestStreak, 
        lastCompletedDate: completionDates[completionDates.length - 1]
    };
};

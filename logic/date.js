//jshint esversion:6

function getCurrentTime(){
  const result = new Date();
  return result;
}

function getTime(date){ //example return output = 11:19pm
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}${period}`;
}

function getDay(date){ //example return output = 10
    const day = date.getDate();
    return day;
}

function getMonth(date){ //example return output = December
    const monthIndex = date.getMonth();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

function convertDate(date){ //example return output = 11:19pm Wednesday 10th Decemebr 2023
    const time = getTime(date);
    const day = getDay(date);
    const month = getMonth(date);
    const year = date.getFullYear();
    const suffix = getDaySuffix(day);
    const dayOfWeek = getDayOfWeek(date.getDay());
    return `${dayOfWeek} | ${time} | ${day}${suffix} ${month} ${year}`;
}

function getFullDate_DB(date){
  const time = getTime(date);
  const day = getDay(date);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const suffix = getDaySuffix(day);
  const dayOfWeek = getDayOfWeek(date.getDay());
  return `${year}-${month}-${day}`;
}

// Helper function to get the suffix for the day (e.g., 1st, 2nd, 3rd)
function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  
// Helper function to get the day of the week
function getDayOfWeek(dayIndex) {
    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    return daysOfWeek[dayIndex];
}
  
module.exports = {
    getCurrentTime,
    convertDate,
    getFullDate_DB
};

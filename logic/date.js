//jshint esversion:6

function getTime(){ //example return output = 11:19pm
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}${period}`;
}

function getDay(){ //example return output = 10
    const currentDate = new Date();
    const day = currentDate.getDate();
    return day;
}

function getMonth(){ //example return output = December
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
}

function getFullDate(){ //example return output = 11:19pm Wednesday 10th Decemebr 2023
    const currentDate = new Date();
    const time = getTime();
    const day = getDay();
    const month = getMonth();
    const year = currentDate.getFullYear();
    const suffix = getDaySuffix(day);
    const dayOfWeek = getDayOfWeek(currentDate.getDay());
    return `${dayOfWeek} | ${time} | ${day}${suffix} ${month} ${year}`;
}

function getFullDate_Stock(){
  const currentDate = new Date();
  const time = getTime();
  const day = getDay();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const suffix = getDaySuffix(day);
  const dayOfWeek = getDayOfWeek(currentDate.getDay());
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
    getTime,
    getDay,
    getMonth,
    getFullDate,
    getFullDate_Stock
};

  //console.log(getTime()); // Example output: 11:19pm
  //console.log(getDay()); // Example output: 10
  //console.log(getMonth()); // Example output: December
  //console.log(getFullDate()); // Example output: 11:19pm Wednesday 10th December 2023
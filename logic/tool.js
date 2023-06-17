function convertLargeNumber(number) {
    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + 'b';
    } else if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'm';
    } else {
      return number.toString();
    }
}


module.exports = {
    convertLargeNumber
};

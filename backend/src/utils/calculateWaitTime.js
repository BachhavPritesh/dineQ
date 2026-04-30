const calculateWaitTime = (position, avgSeatingTimeMinutes = 15) => {
  if (position <= 0 || !avgSeatingTimeMinutes) {
    return 0;
  }
  return Math.round(position * avgSeatingTimeMinutes);
};

export default calculateWaitTime;

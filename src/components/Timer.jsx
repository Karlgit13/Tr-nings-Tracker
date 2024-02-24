import { useEffect, useState } from "react";

const Timer = ({ restPeriod, muscleName }) => {
  // State setup using localStorage or defaulting to restPeriod
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    const endTime = localStorage.getItem(`timerEnd-${muscleName}`);
    if (endTime) {
      const remainingTime = parseInt(endTime, 10) - now;
      // Return remaining time in seconds if any, else default to restPeriod in hours
      return remainingTime > 0
        ? Math.floor(remainingTime / 1000)
        : restPeriod * 3600;
    } else {
      // Default to restPeriod in hours if no end time is stored
      return restPeriod * 3600;
    }
  });

  useEffect(() => {
    // Calculate and store the end time in localStorage on timer start
    const endTime = Date.now() + timeLeft * 1000;
    localStorage.setItem(`timerEnd-${muscleName}`, endTime.toString());

    // Countdown timer logic
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          // Clear timer end time from localStorage when timer expires
          localStorage.removeItem(`timerEnd-${muscleName}`);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    // Cleanup on component unmount or timeLeft changes
    return () => {
      clearInterval(timer);
      // Update remaining time in localStorage if component unmounts before timer expires
      if (timeLeft > 0) {
        const remainingTime = Date.now() + timeLeft * 1000;
        localStorage.setItem(
          `timerEnd-${muscleName}`,
          remainingTime.toString()
        );
      }
    };
  }, [muscleName, timeLeft]);

  // Time formatting function
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days} dagar, ${hours} timmar, ${minutes} minuter, ${secs} sekunder`;
  };

  // Component render
  return (
    <div className="Timer">
      <p className="p-timer">
        Återhämtning: {formatTime(Math.max(timeLeft, 0))}
      </p>
    </div>
  );
};

export default Timer;

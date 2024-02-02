import { useEffect, useState } from "react";

const Timer = ({ restPeriod, muscleName }) => {
  // Initial state setup using localStorage data or default to restPeriod
  const [timeLeft, setTimeLeft] = useState(() => {
    const endTime = localStorage.getItem(`timerEnd-${muscleName}`);
    const now = Date.now();

    if (endTime) {
      const remainingTime = parseInt(endTime, 10) - now;
      // Return remaining time in seconds if any, else default to restPeriod
      return remainingTime > 0
        ? Math.floor(remainingTime / 1000)
        : restPeriod * 3600;
    } else {
      // Default to restPeriod if no end time is stored
      return restPeriod * 3600;
    }
  });

  useEffect(() => {
    // Calculate and store the end time in localStorage when timer starts
    const endTime = Date.now() + timeLeft * 1000;
    localStorage.setItem(`timerEnd-${muscleName}`, endTime.toString());

    // Start a countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        // Clear the end time from localStorage when timer runs out
        if (newTime <= 0) {
          localStorage.removeItem(`timerEnd-${muscleName}`);
        }
        return newTime;
      });
    }, 1000);

    // Clean up on component unmount
    return () => {
      clearInterval(timer);
      // Update localStorage with remaining time if component unmounts before time runs out
      const remainingTime = Date.now() + timeLeft * 1000;
      localStorage.setItem(`timerEnd-${muscleName}`, remainingTime.toString());
    };
  }, [muscleName, timeLeft]);

  // Function to convert seconds into a more readable format
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days} dagar, ${hours} timmar, ${minutes} minuter, ${secs} sekunder`;
  };

  return (
    <div>
      <p className="p-timer">
        Återhämtning: {formatTime(Math.max(timeLeft, 0))}
      </p>
    </div>
  );
};

export default Timer;

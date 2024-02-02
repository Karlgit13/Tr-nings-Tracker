import { useEffect, useState } from "react";

const Timer = ({ restPeriod, muscleName }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Försök att hämta slutdatumet från localStorage
    const endTime = localStorage.getItem(`timerEnd-${muscleName}`);
    const now = Date.now();

    if (endTime) {
      const remainingTime = parseInt(endTime, 10) - now;
      // Returnera återstående tid i sekunder om det finns tid kvar, annars sätt till restPeriod
      return remainingTime > 0
        ? Math.floor(remainingTime / 1000)
        : restPeriod * 3600;
    } else {
      // Om inget slutdatum finns, sätt till restPeriod
      return restPeriod * 3600;
    }
  });

  useEffect(() => {
    // Beräkna och spara slutdatumet i localStorage när timern startar
    const endTime = Date.now() + timeLeft * 1000;
    localStorage.setItem(`timerEnd-${muscleName}`, endTime.toString());

    // Starta en timer som räknar ner varje sekund
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        // Om tiden är ute, rensa slutdatumet från localStorage
        if (newTime <= 0) {
          localStorage.removeItem(`timerEnd-${muscleName}`);
        }
        return newTime;
      });
    }, 1000);

    // Rensa timer när komponenten unmounts
    return () => {
      clearInterval(timer);
      // Uppdatera också localStorage med kvarvarande tid om komponenten avlägsnas före tiden är ute
      const remainingTime = Date.now() + timeLeft * 1000;
      localStorage.setItem(`timerEnd-${muscleName}`, remainingTime.toString());
    };
  }, [muscleName, timeLeft]);

  // Funktion för att omvandla sekunder till dagar, timmar och minuter
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

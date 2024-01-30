import { useEffect, useState } from "react";

const Timer = ({ restPeriod }) => {
  const [timeLeft, setTimeLeft] = useState(restPeriod * 3600); // Konverterar timmar till sekunder

  useEffect(() => {
    // Starta en timer som räknar ner varje sekund
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Rensa timer när komponenten unmounts
    return () => clearInterval(timer);
  }, []);

  // Funktion för att omvandla sekunder till dagar, timmar och minuter
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);

    return `${days} dagar, ${hours} timmar, ${minutes} minuter`;
  };

  return (
    <div>
      <p>Nästa träningspass om: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;

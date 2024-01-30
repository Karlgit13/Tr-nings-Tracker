import { useState, useEffect } from "react";
import React from "react";

const WeeklyTracker = ({ muscleGroups }) => {
  // Skapa en state för att hålla koll på tränade muskelgrupper
  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const initialStatus = {};
    muscleGroups.forEach((group) => {
      initialStatus[group.name] = false;
    });
    return initialStatus;
  });

  // Funktion för att uppdatera status för en tränad muskelgrupp
  const markAsTrained = (muscleName) => {
    setTrainedMuscles((prevState) => ({
      ...prevState,
      [muscleName]: true,
    }));
  };

  // Kolla om alla muskelgrupper har tränats
  const allMusclesTrained = Object.values(trainedMuscles).every(
    (status) => status
  );

  // Återställ tracker vid början av en ny vecka
  useEffect(() => {
    const resetTracker = () => {
      const resetState = {};
      for (let muscle in trainedMuscles) {
        resetState[muscle] = false;
      }
      setTrainedMuscles(resetState);
    };

    const now = new Date();
    const nextReset = new Date(now);
    const daysUntilNextMonday = (7 - now.getDay() + 1) % 7;
    nextReset.setDate(now.getDate() + daysUntilNextMonday);
    nextReset.setHours(0, 0, 0, 0);

    const timeUntilReset = nextReset.getTime() - now.getTime();
    const timer = setTimeout(resetTracker, timeUntilReset);

    return () => clearTimeout(timer);
  }, [trainedMuscles]);

  return (
    <div>
      <h2>Veckans Träning</h2>
      {muscleGroups.map((group) => (
        <div key={group.name}>
          <button onClick={() => markAsTrained(group.name)}>
            {group.name} {trainedMuscles[group.name] ? "(Tränad)" : ""}
          </button>
        </div>
      ))}
      {allMusclesTrained && <p>Alla muskler har tränats denna vecka!</p>}
    </div>
  );
};

export default WeeklyTracker;

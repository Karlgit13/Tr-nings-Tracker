import { useState, useEffect } from "react";
import React from "react";
import "../styles/weeklyTracker.css";

const WeeklyTracker = ({ muscleGroups }) => {
  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const initialStatus = {};
    muscleGroups.forEach((group) => {
      initialStatus[group.name] = false;
    });
    return initialStatus;
  });

  const markAsTrained = (muscleName) => {
    setTrainedMuscles((prevState) => ({
      ...prevState,
      [muscleName]: true,
    }));
  };

  const allMusclesTrained = Object.values(trainedMuscles).every(
    (status) => status
  );

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
      <div className="weekly-title-container">
        <h2 className="weekly-title">Veckans träning</h2>
      </div>
      <div className="button-container">
        {muscleGroups.map((group) => (
          <button
            key={group.name}
            className={`weekly-button ${
              trainedMuscles[group.name] ? "trained" : ""
            }`}
            onClick={() => markAsTrained(group.name)}
          >
            {group.name} {trainedMuscles[group.name] ? "(Tränad)" : ""}
          </button>
        ))}
      </div>
      {allMusclesTrained && (
        <p className="uhmP">
          Bra jobbat! <br /> Alla muskler har tränats denna vecka!
        </p>
      )}
    </div>
  );
};

export default WeeklyTracker;

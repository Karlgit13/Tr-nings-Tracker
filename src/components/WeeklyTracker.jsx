import React from "react";
import "../styles/weeklyTracker.css";
import { useMuscle } from "./MuscleContext";

const WeeklyTracker = () => {
  const {
    muscleGroups,
    trainedMuscles,
    findMuscleImage,
    markAsTrained,
    allMusclesTrained,
  } = useMuscle();
  return (
    <div>
      <div className="weekly-title-container"></div>
      <div className="button-container">
        {muscleGroups.map((group) => (
          <button
            key={group.name}
            className={`weekly-button ${
              trainedMuscles[group.name] ? "trained" : ""
            }`}
            onClick={() => markAsTrained(group.name)}
          >
            <img
              className="muscle-image"
              src={findMuscleImage(group.name)}
              alt={group.name}
            />
            {trainedMuscles[group.name] && (
              <span className="checkmark">&#10004;</span>
            )}
            {group.name}
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

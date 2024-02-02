import { useState, useEffect } from "react";
import React from "react";
import "../styles/weeklyTracker.css";

const WeeklyTracker = ({ muscleGroups }) => {
  // State for tracking the training status of each muscle group
  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const savedTrainedMuscles = localStorage.getItem("trainedMuscles");
    return savedTrainedMuscles
      ? JSON.parse(savedTrainedMuscles)
      : muscleGroups.reduce((acc, group) => {
          acc[group.name] = false;
          return acc;
        }, {});
  });

  // Muscle image references
  const muscleImages = [
    { name: "Mage", src: require("../assets/abs1.png") },
    { name: "Mage1", src: require("../assets/abs2.png") },
    { name: "Armar", src: require("../assets/arms.png") },
    { name: "Rygg1", src: require("../assets/back1.png") },
    { name: "Rygg", src: require("../assets/back2.png") },
    { name: "Ben", src: require("../assets/legs1.png") },
    { name: "Axlar", src: require("../assets/shoulder2.png") },
    { name: "Bröst", src: require("../assets/chest1.png") },
  ];

  // Function to find a muscle image by name
  const findMuscleImage = (muscleName) => {
    const muscleImage = muscleImages.find((image) => image.name === muscleName);
    return muscleImage ? muscleImage.src : undefined;
  };

  // Function to mark a muscle group as trained
  const markAsTrained = (muscleName) => {
    setTrainedMuscles((prevState) => {
      const updatedState = { ...prevState, [muscleName]: true };
      localStorage.setItem("trainedMuscles", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  // Check if all muscles have been trained
  const allMusclesTrained = Object.values(trainedMuscles).every(
    (status) => status
  );

  // Load training data from localStorage on component mount
  useEffect(() => {
    const savedTrainedMuscles = localStorage.getItem("trainedMuscles");
    if (savedTrainedMuscles) {
      setTrainedMuscles(JSON.parse(savedTrainedMuscles));
    }
  }, []);

  // Save the trainedMuscles state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("trainedMuscles", JSON.stringify(trainedMuscles));
  }, [trainedMuscles]);

  // Setup a timer to reset the tracker at the beginning of a new week
  useEffect(() => {
    const resetTracker = () => {
      const resetState = Object.keys(trainedMuscles).reduce((acc, muscle) => {
        acc[muscle] = false;
        return acc;
      }, {});
      setTrainedMuscles(resetState);
      localStorage.setItem("trainedMuscles", JSON.stringify(resetState));
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

import React, { useState } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import "../styles/MainComponent.css";

const MainComponent = () => {
  // Initial setup of muscle groups with their respective rest periods
  const muscleGroups = [
    { name: "Bröst", restPeriod: 48 },
    { name: "Rygg", restPeriod: 48 },
    { name: "Ben", restPeriod: 72 },
    { name: "Axlar", restPeriod: 48 },
    { name: "Armar", restPeriod: 48 },
    { name: "Mage", restPeriod: 24 },
  ];

  // State for tracking trained muscles and their active status
  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const savedTrainedMuscles = localStorage.getItem("trainedMuscles");
    return savedTrainedMuscles ? JSON.parse(savedTrainedMuscles) : {};
  });
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem("isActive");
    return savedIsActive ? JSON.parse(savedIsActive) : {};
  });

  // Handler for marking a muscle group as trained
  const handleTraining = (groupName) => {
    const newIsActive = { ...isActive, [groupName]: true };
    setIsActive(newIsActive);
    localStorage.setItem("isActive", JSON.stringify(newIsActive)); // Save updated state to localStorage
  };

  // Reset all training statuses to false
  const resetTraining = () => {
    const resetState = muscleGroups.reduce((state, group) => {
      state[group.name] = false;
      return state;
    }, {});

    // Clear related localStorage items
    muscleGroups.forEach((group) => {
      localStorage.removeItem(`timerEnd-${group.name}`);
      localStorage.removeItem(`timer-${group.name}`);
    });

    // Update state and localStorage with the reset state
    setTrainedMuscles(resetState);
    setIsActive(resetState);
    localStorage.setItem("trainedMuscles", JSON.stringify(resetState));
    localStorage.setItem("isActive", JSON.stringify(resetState));
  };

  return (
    <div>
      <Header resetTraining={resetTraining} />
      <WeeklyTracker
        muscleGroups={muscleGroups}
        trainedMuscles={trainedMuscles}
        setTrainedMuscles={setTrainedMuscles}
      />
      {muscleGroups.map((group) => (
        <div className="muscle-container" key={group.name}>
          <h3 className="muscle-title">{group.name}</h3>
          <button
            className="muscle-buttons"
            onClick={() => handleTraining(group.name)}
          >
            Tränad
          </button>
          {isActive[group.name] && (
            <Timer
              key={Date.now()} // Forces re-mount to reset timer
              restPeriod={group.restPeriod}
              muscleName={group.name}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MainComponent;

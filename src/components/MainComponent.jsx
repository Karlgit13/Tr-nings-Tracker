import React from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import "../styles/MainComponent.css";
import { useMuscle } from "./MuscleContext";

const MainComponent = () => {
  const { isActive, muscleGroups, handleTraining } = useMuscle();

  return (
    <div>
      <Header />
      <WeeklyTracker />
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

import React, { useState } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import "../styles/MainComponent.css";
import Header from "./Header";

const MainComponent = () => {
  const muscleGroups = [
    { name: "Bröst", restPeriod: 48 },
    { name: "Rygg", restPeriod: 48 },
    { name: "Ben", restPeriod: 72 },
    { name: "Axlar", restPeriod: 48 },
    { name: "Armar", restPeriod: 48 },
    { name: "Mage", restPeriod: 24 },
  ];

  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const savedTrainedMuscles = localStorage.getItem("trainedMuscles");
    return savedTrainedMuscles ? JSON.parse(savedTrainedMuscles) : {};
  });
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem("isActive");
    return savedIsActive ? JSON.parse(savedIsActive) : {};
  });

  const handleTraining = (groupName) => {
    const newIsActive = {
      ...isActive,
      [groupName]: true,
    };
    setIsActive(newIsActive);

    // Spara det uppdaterade tillståndet i localStorage
    localStorage.setItem("isActive", JSON.stringify(newIsActive));
  };

  const resetTraining = () => {
    // Skapa ett nytt state-objekt för att återställa alla muskelgrupper till false
    const resetState = muscleGroups.reduce((state, group) => {
      state[group.name] = false;
      return state;
    }, {});

    // Rensa localStorage först
    muscleGroups.forEach((group) => {
      localStorage.removeItem(`timerEnd-${group.name}`);
      localStorage.removeItem(`timer-${group.name}`);
    });

    // Uppdatera state med det nya resetState-objektet
    setTrainedMuscles(resetState);
    setIsActive(resetState);

    // Uppdatera localStorage med det nya resetState-objektet
    localStorage.setItem("trainedMuscles", JSON.stringify(resetState));
    localStorage.setItem("isActive", JSON.stringify(resetState));

    // Trigger en re-render av Timer-komponenterna genom att ändra en state-variabel
    // som används som nyckel för Timer-komponenterna
  };

  return (
    <div>
      <div>
        <Header resetTraining={resetTraining} />
      </div>
      <div>
        <WeeklyTracker
          muscleGroups={muscleGroups}
          trainedMuscles={trainedMuscles}
          setTrainedMuscles={setTrainedMuscles}
        />
      </div>
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
              key={Date.now()} // En unik nyckel som tvingar återmontering
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

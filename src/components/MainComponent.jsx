import React from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import { useMuscle } from "./MuscleContext";

const MainComponent = () => {
  const { isActive, muscleGroups, handleTraining } = useMuscle();

  return (
    <div className="MainComponent">
      <Header />
      <WeeklyTracker />
      {muscleGroups.map((group) => (
        <div
          className="flex flex-col items-center justify-center text-center text-[#edefee] my-4"
          key={group.name}
        >
          <h3 className="font-poppins text-sm font-bold mb-2 shadow-lg">
            {group.name}
          </h3>
          <button
            className="bg-red-500 text-white p-2 rounded-lg border border-black shadow-md cursor-pointer hover:bg-red-700 transition-colors mx-2 font-poppins font-semibold"
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

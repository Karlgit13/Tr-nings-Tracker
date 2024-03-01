import React from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import { useMuscle } from "./MuscleContext";

const MainComponent = () => {
  const { muscleGroups, userId, isLoggedIn, lastTrained } = useMuscle();

  return (
    <div className="MainComponent">
      <Header />
      <WeeklyTracker />
      <h1 className="mt-8 text-center text-white mb-3">Återhämtnings Tider:</h1>
      <div className="MainComponent flex flex-col place-items-center  justify-center w-full text-white gap-y-5">
        {muscleGroups.map((group) => (
          <div
            className="MuskelGrupperDiv bg-blue-500 p-4 rounded w-4/5 max-w-sm text-center text-black"
            key={group.name}
          >
            <h3 className="text-red-600 font-bold">{group.name}</h3>
            <div>
              <Timer
                key={Date.now()} // Forces re-mount to reset timer
                restPeriod={group.restPeriod}
                muscleName={group.name}
                userId={userId}
                isLoggedIn={isLoggedIn}
                lastTrained={lastTrained}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainComponent;

import React, { useState } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import { useMuscle } from "./MuscleContext";
import { markMuscleAsTrained } from "./api";

const MainComponent = () => {
  const [lastTrained, setLastTrained] = useState({});
  const { muscleGroups, userId, isLoggedIn } = useMuscle();

  const handleMarkAsTrained = async (muscleName) => {
    if (isLoggedIn) {
      try {
        const response = await markMuscleAsTrained(userId, muscleName);
        // Uppdatera tillståndet eller UI baserat på svaret om det behövs
        setLastTrained({ muscleName, timestamp: Date.now() });
        console.log(response.message);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Du måste logga in");
    }
  };

  return (
    <div className="MainComponent">
      <Header />
      <WeeklyTracker />
      <h1 className="mt-8 text-center text-white mb-3">
        Återhämtnings Tider:
      </h1>
      <div className="MainComponent grid grid-cols-3 place-items-center text-white gap-y-5">
        {muscleGroups.map((group) => (
          <div className="MuskelGrupperDiv w-4/5" key={group.name}>
            <h3 className="text-center">{group.name}</h3>
            <button
              className="red-button w-full"
              onClick={() => handleMarkAsTrained(group.name)}
            >
              Tränad
            </button>
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

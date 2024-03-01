import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import { useMuscle } from "./MuscleContext";
import { getUserTrainingEndTimes } from "./api"; // Assuming this can fetch all relevant times

const MainComponent = () => {
  const { muscleGroups, userId, isLoggedIn } = useMuscle();
  const [recoveryTimes, setRecoveryTimes] = useState({});

  useEffect(() => {
    const fetchRecoveryTimes = async () => {
      if (userId && isLoggedIn) {
        try {
          const data = await getUserTrainingEndTimes(userId);
          if (data && data.trainedMuscles) {
            setRecoveryTimes(data.trainedMuscles);
          }
        } catch (error) {
          console.error("error: ", error);
        }
      }
    };

    fetchRecoveryTimes();
  }, [userId, isLoggedIn, recoveryTimes]);

  return (
    <div className="MainComponent">
      <Header />
      <WeeklyTracker />
      <h1 className="mt-8 text-center text-white mb-3">Återhämtnings Tider:</h1>
      <div className="MainComponent flex flex-col place-items-center  justify-center w-full text-white gap-y-5">
        {muscleGroups
          .filter(
            (group) =>
              recoveryTimes[group.name] &&
              recoveryTimes[group.name].trainedUntil
          )
          .map((group) => (
            <div
              className="MuskelGrupperDiv bg-blue-500 p-4 rounded w-4/5 max-w-sm text-center text-black"
              key={group.name}
            >
              <h3 className="text-red-600 font-bold">{group.name}</h3>
              <Timer
                muscleName={group.name}
                userId={userId}
                isLoggedIn={isLoggedIn}
                trainingEnd={recoveryTimes[group.name]?.trainedUntil} // Pass the specific training end time
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainComponent;

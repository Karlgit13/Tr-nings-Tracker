import React, { useEffect } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";
import Header from "./Header";
import { useMuscle } from "./MuscleContext";
import { getUserTrainingEndTimes } from "./api";

const MainComponent = () => {
  const { muscleGroups, userId, isLoggedIn, recoveryTimes, setRecoveryTimes } =
    useMuscle();

  const handleRecoveryComplete = (muscleName) => {
    setRecoveryTimes((prevRecoveryTimes) => {
      const newRecoveryTimes = { ...prevRecoveryTimes };
      delete newRecoveryTimes[muscleName];
      return newRecoveryTimes;
    });
  };

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
  }, [userId, isLoggedIn, setRecoveryTimes]);

  return (
    <div className="MainComponent">
      <Header />
      <WeeklyTracker />
      <h1 className="mt-8 text-center">
        Återhämtnings Tider:
      </h1>
      <div className="MainComponent flex flex-col place-items-center  justify-center w-full  gap-y-2">
        {muscleGroups
          .filter(
            (group) =>
              recoveryTimes[group.name] &&
              recoveryTimes[group.name].trainedUntil
          )
          .sort(
            (a, b) =>
              new Date(recoveryTimes[a.name].trainedUntil).getTime() -
              new Date(recoveryTimes[b.name].trainedUntil).getTime()
          )
          .map((group) => (
            <div
              className="MuskelGrupperDiv bg-[#01112b] p-2 rounded w-[90vw] max-w-sm text-left"
              key={group.name}
            >
              <h3 className="text-white font-bold text-lg md:text-xl textShadow mb-1">
                {group.name}
              </h3>
              <Timer
                muscleName={group.name}
                userId={userId}
                isLoggedIn={isLoggedIn}
                trainingEnd={recoveryTimes[group.name]?.trainedUntil}
                onRecoveryComplete={() => handleRecoveryComplete(group.name)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainComponent;

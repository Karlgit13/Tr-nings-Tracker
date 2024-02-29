import { useEffect, useState } from "react";
import { getUserTrainingEndTimes } from "./api";

const Timer = ({ userId, muscleName, isLoggedIn }) => {
  const [trainingEnd, setTrainingEnd] = useState("");

  const formatedTrainingEnd = trainingEnd
    ? new Date(trainingEnd).toLocaleString("sv-SE", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserTrainingEndTimes(userId);
        if (
          userData &&
          userData.trainedMuscles &&
          userData.trainedMuscles[muscleName]
        ) {
          const trainedUntil = new Date(
            userData.trainedMuscles[muscleName].trainedUntil
          );
          const now = new Date();
          const nowUTC = new Date(now.toISOString());
          if (trainedUntil < nowUTC) {
            setTrainingEnd("");
          } else {
            setTrainingEnd(userData.trainedMuscles[muscleName].trainedUntil);
          }
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };
    if (userId && isLoggedIn) {
      fetchData();
    }
  }, [userId, muscleName, isLoggedIn]);

  return (
    <div className="Timer">
      {trainingEnd.length > 0 && (
        <p className="p-timer">Återhämtning till - {formatedTrainingEnd}</p>
      )}
    </div>
  );
};

export default Timer;

import { useEffect, useState } from "react";
import { getUserTrainingEndTimes } from "./api";

const Timer = ({ userId, muscleName }) => {
  const [trainingEnd, setTrainingEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserTrainingEndTimes(userId);
        if (
          userData &&
          userData.trainedMuscles &&
          userData.trainedMuscles[muscleName]
        ) {
          setTrainingEnd(userData.trainedMuscles[muscleName].trainedUntil);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };
    if (userId !== (null || "")) {
      fetchData();
    }
  }, [userId, muscleName]);

  return (
    <div className="Timer">
      <p className="p-timer">Återhämtning: {trainingEnd}</p>
    </div>
  );
};

export default Timer;

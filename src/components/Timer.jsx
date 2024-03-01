import { useEffect, useState } from "react";

const Timer = ({ trainingEnd }) => {
  const [formattedTrainingEnd, setFormattedTrainingEnd] = useState("");
  const [isRecoveryPast, setIsRecoveryPast] = useState(false);

  useEffect(() => {
    const checkRecoveryTime = () => {
      if (trainingEnd) {
        const trainedUntil = new Date(trainingEnd);
        const now = new Date();

        if (trainedUntil < now) {
          setIsRecoveryPast(true);
          setFormattedTrainingEnd("");
        } else {
          setIsRecoveryPast(false);
          const endFormatted = trainedUntil.toLocaleString("sv-SE", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          setFormattedTrainingEnd(endFormatted);
        }
      } else {
        setIsRecoveryPast(false);
        setFormattedTrainingEnd("");
      }
    };

    checkRecoveryTime();
  }, [trainingEnd]);

  return (
    <div className="Timer">
      {!isRecoveryPast && formattedTrainingEnd.length > 0 && (
        <p className="p-timer">
          Återhämtning till -{" "}
          <span className="text-red-600 font-bold text-lg md:text-xl">
            {formattedTrainingEnd}
          </span>
        </p>
      )}
    </div>
  );
};

export default Timer;

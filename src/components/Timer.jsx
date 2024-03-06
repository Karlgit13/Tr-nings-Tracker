import { useEffect, useState } from "react";

const Timer = ({ trainingEnd, onRecoveryComplete }) => {
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
          onRecoveryComplete && onRecoveryComplete();
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
  }, [trainingEnd, onRecoveryComplete]);

  return (
    <div className="Timer">
      {!isRecoveryPast && formattedTrainingEnd.length > 0 && (
        <p className="p-timer flex justify-between text-white">
          <span className=" ">Återhämtning till</span>
          <span className="">
            {" "}
            <img src={require("../assets/arrow.png")} alt="" />{" "}
          </span>
          <span className="text-red-500 font-bold text-lg md:text-xl textShadow">
            {formattedTrainingEnd}
          </span>
        </p>
      )}
    </div>
  );
};

export default Timer;

import { useEffect, useState } from "react";

const Timer = ({ trainingEnd }) => {
  const [formattedTrainingEnd, setFormattedTrainingEnd] = useState("");

  useEffect(() => {
    if (trainingEnd) {
      const end = new Date(trainingEnd).toLocaleString("sv-SE", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setFormattedTrainingEnd(end);
    } else {
      setFormattedTrainingEnd("");
    }
  }, [trainingEnd]);

  return (
    <div className="Timer">
      {formattedTrainingEnd.length > 0 && (
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

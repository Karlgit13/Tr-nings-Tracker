import React from "react";
import { useMuscle } from "./MuscleContext";

const WeeklyTracker = () => {
  const {
    muscleGroups,
    trainedMuscles,
    findMuscleImage,
    markAsTrained,
    allMusclesTrained,
    currentWeek,
  } = useMuscle();

  return (
    <div className="WeeklyTracker">
      <h2 className="text-lg text-center mt-5 text-white textShadow">
        Vecka <span className="text-red-500">{currentWeek}</span> träning
      </h2>
      <div className="WeeklyTracker flex flex-row justify-center flex-wrap p-4">
        {muscleGroups.map((group, index) => (
          <div key={index}>
            <button
              className={`font-poppins text-[#edefee]  m-[1vw] flex-1 text-center bg-transparent border-none cursor-pointer relative text-shadow  ${
                trainedMuscles.includes(group.name) ? "opacity-50" : ""
              }`}
              onClick={() => markAsTrained(group.name)}
              style={{ minWidth: "100px" }}
            >
              <img
                className="w-[100px] h-[90px] rounded-full"
                src={findMuscleImage(group.name)}
                alt={group.name}
              />
              {trainedMuscles.includes(group.name) && (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-red-500">
                  &#10004;
                </span>
              )}
              {group.name}
            </button>
          </div>
        ))}
      </div>
      {allMusclesTrained && (
        <p className="font-poppins mt-[-10px] text-center p-4 font-bold text-shadow text-white textShadow">
          Bra jobbat! <br /> Alla muskler har tränats denna vecka!
        </p>
      )}
    </div>
  );
};

export default WeeklyTracker;

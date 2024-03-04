import React, { useEffect, useState } from "react";
import { fetchUserWeeklyReport } from "./api";
import { useMuscle } from "./MuscleContext";
import Header from "./Header";

const SavedData = () => {
  const {
    userId,
    isLoggedIn,
    muscleGroups,
    recoveryTimes,
    trainedMuscles,
    getWeekNumber,
  } = useMuscle();
  const [weeklyReports, setWeeklyReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const reports = await fetchUserWeeklyReport(userId);
          if (Array.isArray(reports)) {
            setWeeklyReports(reports);
          } else {
            setWeeklyReports([]);
          }
        } catch (error) {
          setWeeklyReports([]);
        }
      }
    };

    fetchData();
  }, [userId, isLoggedIn, recoveryTimes]);

  const isMuscleTrained = (muscleName, trainedMuscles) => {
    return trainedMuscles.includes(muscleName);
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center p-4 text-white textShadow">
        <h1>Här lagras dina veckor</h1>
      </div>
      <div className="WeekNow flex flex-col w-full place-items-center textShadow p-4">
        <div className="text-white bg-blue-500 w-[90vw] p-2 rounded">
          <h3 className="text-center">
            Nuvarande Vecka{" "}
            <span className="text-red-500">
              ( {getWeekNumber(new Date())} )
            </span>
          </h3>
          <ul className="flex flex-row justify-evenly">
            {muscleGroups.map((muscle, index) => (
              <li key={index} className="grid place-items-center">
                {muscle.name}
                <img
                  className="w-6"
                  src={
                    isMuscleTrained(muscle.name, trainedMuscles)
                      ? require("../assets/check.png")
                      : require("../assets/close.png")
                  }
                  alt=""
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col w-full place-items-center textShadow p-4">
        {weeklyReports.length > 0 ? (
          <div className="text-white bg-blue-500 w-[90vw] p-2 rounded">
            {weeklyReports.map((report, index) => (
              <div key={index}>
                <h3 className="text-center">
                  Vecka: <span className="text-red-500">{report.weekOf}</span>
                </h3>
                <ul className="flex flex-row justify-evenly p-2">
                  {muscleGroups.map((muscle, muscleIndex) => (
                    <li key={muscleIndex} className="grid place-items-center">
                      {muscle.name}
                      <img
                        className="w-6"
                        src={
                          isMuscleTrained(muscle.name, report.trainedMuscles)
                            ? require("../assets/check.png")
                            : require("../assets/close.png")
                        }
                        alt=""
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-2 text-white">Ingen data.</p>
        )}
      </div>
    </div>
  );
};

export default SavedData;

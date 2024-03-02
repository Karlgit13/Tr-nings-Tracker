import React, { useEffect, useState } from "react";
import { fetchUserWeeklyReport } from "./api";
import { useMuscle } from "./MuscleContext";
import Header from "./Header";

const SavedData = () => {
  const { userId, isLoggedIn } = useMuscle();
  const [weeklyReports, setWeeklyReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const reports = await fetchUserWeeklyReport(userId);
        setWeeklyReports(reports);
      }
    };

    fetchData();
  }, [userId, isLoggedIn]);

  return (
    <div>
      <Header />

      <div className="flex flex-col w-full place-items-center textShadow p-4">
        {weeklyReports.length > 0 ? (
          <div className="text-white bg-blue-500 w-[90vw] p-2 rounded">
            {weeklyReports.map((report, index) => (
              <div key={index}>
                <h3 className="text-center">
                  Vecka: <span className="text-red-500">{report.weekOf}</span>
                </h3>
                <ul className="flex flex-row justify-evenly p-2">
                  {report.trainedMuscles.map((muscle, index) => (
                    <li className="relative" key={index}>
                      {muscle}{" "}
                      <img
                        className="w-5 absolute -right-7 top-1"
                        src={require("../assets/check.png")}
                        alt=""
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>Ingen data.</p>
        )}
      </div>
    </div>
  );
};

export default SavedData;

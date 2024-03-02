import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchUserWeeklyReport } from "./api";
import { useMuscle } from "./MuscleContext";

const SavedData = () => {
  const { userId, isLoggedIn } = useMuscle();
  useEffect(() => {
    fetchUserWeeklyReport(userId);
  }, [userId, isLoggedIn]);

  return (
    <div>
      <div></div>
      <Link to={"/"}>
        <button className="red-button">Tillbaka</button>
      </Link>
    </div>
  );
};

export default SavedData;

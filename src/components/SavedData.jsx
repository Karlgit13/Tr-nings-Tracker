import React from "react";
import { Link } from "react-router-dom";
import { fetchUserWeeklyReport } from "./api";

const SavedData = () => {
  return (
    <div>
      <Link to={"/"}>
        <button className="red-button">Tillbaka</button>
      </Link>
    </div>
  );
};

export default SavedData;

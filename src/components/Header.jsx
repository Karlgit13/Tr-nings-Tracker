import "../styles/header.css";
import Logo from "../assets/nylogo.webp";
import { useEffect, useState } from "react";

const Header = ({ resetTraining }) => {
  function refreshPage() {
    window.location.reload(false);
  }

  // State for tracking the current week number
  const [currentWeek, setCurrentWeek] = useState();

  // Function to calculate the current week number
  const getWeekNumber = (date) => {
    const newDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((newDate - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  // Initialize the current week number on component mount
  useEffect(() => {
    const today = new Date();
    const weekNumber = getWeekNumber(today);
    setCurrentWeek(weekNumber);
  }, []);

  return (
    <header className="header-container">
      <img
        onClick={refreshPage}
        className="header-logo"
        src={Logo}
        alt="logo"
      />
      <h2 className="weekly-title">
        Vecka <span className="week-number">{currentWeek}</span> träning
      </h2>
      <button
        className="reset-button"
        onClick={() => {
          resetTraining();
          refreshPage();
        }}
      >
        Återställ
      </button>
    </header>
  );
};

export default Header;

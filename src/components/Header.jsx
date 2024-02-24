import "../styles/header.css";
import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";

const Header = () => {
  const { currentWeek, refreshPage, resetTraining } = useMuscle();

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

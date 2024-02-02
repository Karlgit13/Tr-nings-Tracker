import "../styles/header.css";
import Logo from "../assets/nylogo.webp";

const Header = ({ resetTraining }) => {
  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <header className="header-container">
      <img
        onClick={refreshPage}
        className="header-logo"
        src={Logo}
        alt="logo"
      />
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

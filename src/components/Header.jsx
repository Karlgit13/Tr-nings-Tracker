import "../styles/header.css";

const Header = ({ resetTraining }) => {
  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <header className="header-container">
      <h1>Träningsaktivitetsapp</h1>
      <button
        className="reset-button"
        onClick={() => {
          resetTraining();
          refreshPage();
        }}
      >
        Reset
      </button>
    </header>
  );
};

export default Header;

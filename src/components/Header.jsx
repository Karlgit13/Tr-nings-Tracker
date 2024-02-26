import React from "react";

import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { refreshPage, resetTraining, isLoggedIn, setIsloggedIn } = useMuscle();

  return (
    <header className="Header flex justify-between items-center bg-[#01112b] font-poppins text-sm p-2 text-[#edefee] shadow-md">
      <img
        onClick={refreshPage}
        className="w-12 h-15 rounded-full cursor-pointer"
        src={Logo}
        alt="logo"
      />

      {!isLoggedIn && (
        <Link to={"/login"}>
          <button className="bg-red-500 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer">
            Logga in
          </button>
        </Link>
      )}

      {isLoggedIn && (
        <div>
          {" "}
          <button
            onClick={() => setIsloggedIn(false)}
            className="bg-red-500 mr-1 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Logga ut
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer"
            onClick={() => {
              resetTraining();
              refreshPage();
            }}
          >
            Återställ
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

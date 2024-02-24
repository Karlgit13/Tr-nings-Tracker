import React from "react";

import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";

const Header = () => {
  const { refreshPage, resetTraining } = useMuscle();

  return (
    <header className="Header flex justify-between items-center bg-[#01112b] font-poppins text-sm p-2 text-[#edefee] shadow-md">
      <img
        onClick={refreshPage}
        className="w-12 h-15 rounded-full cursor-pointer"
        src={Logo}
        alt="logo"
      />

      <button
        className="bg-red-500 text-white p-2 rounded text-lg hover:bg-red-700 transition-colors cursor-pointer"
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

import React, { useState } from "react";
import Burgare from "../assets/icons8-menu-50.png";
import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { refreshPage, resetTraining, isLoggedIn, setIsloggedIn } = useMuscle();
  const [isClicked, setIsClicked] = useState();

  const toggleBurgare = () => {
    setIsClicked(!isClicked);
  };

  return (
    <header className="Header flex justify-between items-center bg-[#01112b] font-poppins text-sm p-2 text-[#edefee] shadow-md">
      <Link to={"/"}>
        <img
          onClick={refreshPage}
          className="w-12 h-15 rounded-full cursor-pointer"
          src={Logo}
          alt="logo"
        />
      </Link>
      <div className="relative">
        {isLoggedIn ? (
          <div>
            <img
              onClick={toggleBurgare}
              src={Burgare}
              alt={Burgare}
              className=" w-12 cursor-pointer"
            />
            {isClicked && (
              <div className="flex flex-col absolute p-8 bg-[#01112b] z-10 right-0 gap-1 -mr-5 rounded w-[200px] md:w-[350px]">
                <>
                  <button
                    onClick={() => setIsloggedIn(false)}
                    className="red-button w-full"
                  >
                    Logga ut
                  </button>
                  <button
                    onClick={() => {
                      resetTraining();
                      refreshPage();
                    }}
                    className="red-button"
                  >
                    Återställ
                  </button>
                  <Link to={"/data"}>
                    <button className="red-button w-full">Min Data</button>
                  </Link>
                </>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="red-button mr-1">Logga in</button>
            </Link>
            <Link to={"/register"}>
              <button className="red-button">Skapa konto</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

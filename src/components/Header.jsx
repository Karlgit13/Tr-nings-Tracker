import React, { useState } from "react";
import Burgare from "../assets/icons8-menu-50.png";
import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";
import { Link } from "react-router-dom";
import { resetUserMuscles, resetUserMuscleTimer } from "./api";
import LiveClock from "react-live-clock";

const Header = () => {
  const { isLoggedIn, setIsloggedIn, userId, setUserId, muscleGroups } =
    useMuscle();
  const [isClicked, setIsClicked] = useState();

  const toggleBurgare = () => {
    setIsClicked(!isClicked);
  };

  const handleRecoveryResetClick = async (userId, muscleName) => {
    try {
      const response = await resetUserMuscleTimer(userId, muscleName);
      console.log(response.message);
      // Uppdatera UI här om nödvändigt
    } catch (error) {
      console.error(error);
    }
  };

  const handleWeekResetClick = async (userId) => {
    try {
      await resetUserMuscles(userId); // Use userId directly here
      console.log("muscles reset success");
    } catch (error) {
      console.error("fail", error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <header className="Header flex justify-between items-center bg-[#01112b] font-poppins text-sm p-2 text-[#edefee] shadow-md">
      <Link to={"/"}>
        <img
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
                  <Link to={"/data"}>
                    <button className="red-button w-full">Min Data</button>
                  </Link>

                  <button
                    onClick={async () => {
                      await handleWeekResetClick(userId);
                      refreshPage();
                    }}
                    className="red-button"
                  >
                    Återställ Vecka
                  </button>
                  <button
                    onClick={async () => {
                      await handleRecoveryResetClick(userId);
                      refreshPage();
                    }}
                    className="red-button"
                  >
                    Återställ Återhämtning
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      localStorage.removeItem("userId");
                      setIsloggedIn(false);
                      setUserId(null);
                      refreshPage();
                    }}
                    className="red-button w-full"
                  >
                    Logga ut
                  </button>
                  <LiveClock
                    format={"HH:mm:ss"}
                    ticking={true}
                    timezone={"Europe/Stockholm"}
                  />
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

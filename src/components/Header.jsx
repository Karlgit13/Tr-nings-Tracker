import React, { useState } from "react";
import Burgare from "../assets/icons8-menu-50.png";
import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";
import { Link } from "react-router-dom";
import { resetUserMuscles, resetUserMuscleTimer } from "./api";
import LiveClock from "react-live-clock";

const Header = () => {
  const { isLoggedIn, setIsloggedIn, userId, setUserId } = useMuscle();
  const [isClicked, setIsClicked] = useState();

  const toggleBurgare = () => {
    setIsClicked(!isClicked);
  };

  const handleReset = async (userId, muscleName) => {
    try {
      const response = await resetUserMuscleTimer(userId, muscleName);
      console.log(response.message);
    } catch (error) {
      console.error(error);
    }
    try {
      await resetUserMuscles(userId);
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
      <div>
        <Link to={"/"}>
          <img
            className="w-12 h-15 rounded-full cursor-pointer"
            src={Logo}
            alt="logo"
          />
        </Link>
        <LiveClock
          className="text-md textShadow"
          format={"HH:mm:ss"}
          ticking={true}
          timezone={"Europe/Stockholm"}
        />
      </div>

      <div className="relative">
        {isLoggedIn ? (
          <div>
            <img
              onClick={toggleBurgare}
              src={Burgare}
              alt={Burgare}
              className=" w-12 cursor-pointer mr-1"
            />

            {isClicked && (
              <div className="flex flex-col absolute p-8 bg-[#01112b] z-10 right-0 gap-1 -mr-5 rounded w-[200px] md:w-[350px]">
                <>
                  <Link to={"/data"}>
                    <button className="red-button w-full">Min Data</button>
                  </Link>

                  <button
                    onClick={async () => {
                      await handleReset(userId);
                      refreshPage();
                    }}
                    className="red-button"
                  >
                    Återställ
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

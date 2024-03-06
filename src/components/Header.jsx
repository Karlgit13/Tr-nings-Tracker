import React, { useEffect, useState } from "react";
import Burgare from "../assets/icons8-menu-50.png";
import Logo from "../assets/nylogo.webp";
import { useMuscle } from "./MuscleContext";
import { Link } from "react-router-dom";
import { resetUserMuscles, resetUserMuscleTimer } from "./api";
import LiveClock from "react-live-clock";

const Header = () => {
  const { isLoggedIn, setIsloggedIn, userId, setUserId, dayMode, setDayMode } =
    useMuscle();
  const [isClicked, setIsClicked] = useState(false);

  const handleDayNightMode = () => {
    const newMode = !dayMode ? "day" : "night";
    setDayMode(!dayMode);
    localStorage.setItem("dayMode", newMode);
  };

  useEffect(() => {
    document.body.className = dayMode ? "day-mode" : "night-mode";
  }, [dayMode]);

  const handleClickOutside = (event) => {
    if (isClicked && !event.target.closest(".dropdown-menu")) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    if (isClicked) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [isClicked]);

  const toggleBurgare = () => {
    setIsClicked(!isClicked);
  };

  const handleReset = async (userId, muscleName) => {
    const isConfirm = window.confirm(
      "Alla muskler samt återhämtningstider kommer återställas. är du säker?"
    );
    if (isConfirm) {
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
            onClick={(e) => {
              e.stopPropagation();
            }}
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
            <div className="flex place-items-center">
              <img
                className=" w-32"
                src={
                  dayMode
                    ? require("../assets/dayMode.png")
                    : require("../assets/nightMode.png")
                }
                onClick={handleDayNightMode}
                alt=""
              />
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBurgare();
                }}
                src={Burgare}
                alt={Burgare}
                className=" w-12 h-12 cursor-pointer mr-1"
              />
            </div>

            {isClicked && (
              <div className="dropdown-menu flex flex-col absolute p-8 bg-[#01112b] z-10 right-0 gap-1 -mr-5 rounded w-[200px] md:w-[350px]">
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

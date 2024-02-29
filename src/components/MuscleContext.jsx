import { createContext, useContext, useEffect, useState } from "react";
import {
  updateTrainedMuscle,
  getUserTrainedMuscles,
  addMuscleGroups,
} from "./api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Context creation
const MuscleContext = createContext();

// Custom hook to use the context
export const useMuscle = () => useContext(MuscleContext);

// Context provider component
const MuscleProvider = ({ children }) => {
  // ********** State Declarations **********
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isActive, setIsActive] = useState({});
  const [trainedMuscles, setTrainedMuscles] = useState([]);
  const [allMusclesTrained, setAllMusclesTrained] = useState(false);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [userId, setUserId] = useState("");
  const [lastTrained, setLastTrained] = useState({});
  const [trainingEnd, setTrainingEnd] = useState("");

  // ********** Static Data **********
  const muscleGroups = [
    { name: "Bröst", restPeriod: 48 },
    { name: "Rygg", restPeriod: 48 },
    { name: "Ben", restPeriod: 72 },
    { name: "Axlar", restPeriod: 48 },
    { name: "Armar", restPeriod: 48 },
    { name: "Mage", restPeriod: 24 },
  ];

  const muscleImages = [
    { name: "Mage", src: require("../assets/abs1.png") },
    { name: "Mage1", src: require("../assets/abs2.png") },
    { name: "Armar", src: require("../assets/arms.png") },
    { name: "Rygg1", src: require("../assets/back1.png") },
    { name: "Rygg", src: require("../assets/back2.png") },
    { name: "Ben", src: require("../assets/legs1.png") },
    { name: "Axlar", src: require("../assets/shoulder2.png") },
    { name: "Bröst", src: require("../assets/chest1.png") },
  ];

  // ********** Functions **********
  const getWeekNumber = (date) => {
    const newDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    newDate.setUTCDate(newDate.getUTCDate() + 4 - (newDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((newDate - yearStart) / 86400000 + 1) / 7);
  };

  const findMuscleImage = (muscleName) =>
    muscleImages.find((image) => image.name === muscleName)?.src;

  const updateMusclesFromDB = async (userId) => {
    try {
      const muscleData = await getUserTrainedMuscles(userId);
      if (muscleData && muscleData.trainedMuscles) {
        setTrainedMuscles(muscleData.trainedMuscles);
        console.log("muscleData ==== ", muscleData);
        console.log(
          "muscleData.trainedMuscles ==== ",
          muscleData.trainedMuscles
        );
      } else {
        console.log("No trained muscles data for this user.");
      }
    } catch (error) {
      console.error("Failed to update muscles from DB", error);
    }
  };

  const fetchUserIdByIdentifier = (identifier) => {
    console.log(`Börjar hämta användar-ID för identifierare: ${identifier}`);
    fetch(`${API_BASE_URL}/getUserId?identifier=${identifier}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Hämtade data:", data);
        localStorage.setItem("userId", data.userId);
        setUserId(data.userId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const markAsTrained = (muscleName) => {
    if (!isLoggedIn) {
      alert("Du måste logga in för markera");
      return;
    }
    updateTrainedMuscle(userId, muscleName)
      .then(() => {
        setTrainedMuscles((prevState) => [...prevState, muscleName]);
      })
      .catch((error) => {
        console.error("fail", error);
      });
  };

  // ********** Effects **********
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsloggedIn(isLoggedIn);
  }, []);

  useEffect(() => {
    if (userId) {
      updateMusclesFromDB(userId);
    }
  }, [userId]);

  useEffect(() => {
    const today = new Date();
    setCurrentWeek(getWeekNumber(today));
    addMuscleGroups(muscleGroups)
      .then((response) => console.log("Muscle groups added:", response))
      .catch((error) => console.error("Error adding muscle groups:", error));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (trainedMuscles.length === 6) {
      setAllMusclesTrained(true);
    } else {
      setAllMusclesTrained(false);
    }
  }, [trainedMuscles]);

  // ********** Context provider value **********
  const value = {
    muscleGroups,
    currentWeek,
    getWeekNumber,
    trainedMuscles,
    setTrainedMuscles,
    isActive,
    setIsActive,
    muscleImages,
    findMuscleImage,
    markAsTrained,
    allMusclesTrained,
    isLoggedIn,
    setIsloggedIn,
    identifier,
    setIdentifier,
    userId,
    setUserId,
    fetchUserIdByIdentifier,
    updateMusclesFromDB,
    lastTrained,
    setLastTrained,
    trainingEnd,
    setTrainingEnd,
  };

  return (
    <MuscleContext.Provider value={value}>{children}</MuscleContext.Provider>
  );
};

export default MuscleProvider;

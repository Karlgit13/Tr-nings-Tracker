import { createContext, useContext, useEffect, useState } from "react";

// Context creation
const MuscleContext = createContext();

// Custom hook to use the context
export const useMuscle = () => useContext(MuscleContext);

// Context provider component
const MuscleProvider = ({ children }) => {
  // State declarations
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem("isActive");
    return savedIsActive ? JSON.parse(savedIsActive) : {};
  });
  const [trainedMuscles, setTrainedMuscles] = useState(() => {
    const saved = localStorage.getItem("trainedMuscles");
    return saved
      ? JSON.parse(saved)
      : muscleGroups.reduce(
          (acc, group) => ({ ...acc, [group.name]: false }),
          {}
        );
  });

  // Static data for muscle groups and images
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

  // Utility functions
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

  const markAsTrained = (muscleName) => {
    setTrainedMuscles((prevState) => {
      const updated = { ...prevState, [muscleName]: true };
      localStorage.setItem("trainedMuscles", JSON.stringify(updated));
      return updated;
    });
  };

  const handleTraining = (groupName) => {
    const updatedIsActive = { ...isActive, [groupName]: true };
    setIsActive(updatedIsActive);
    localStorage.setItem("isActive", JSON.stringify(updatedIsActive));
  };

  const refreshPage = () => window.location.reload(false);

  const resetTraining = () => {
    const reset = muscleGroups.reduce(
      (acc, group) => ({ ...acc, [group.name]: false }),
      {}
    );
    muscleGroups.forEach((group) => {
      localStorage.removeItem(`timerEnd-${group.name}`);
      localStorage.removeItem(`timer-${group.name}`);
    });
    setTrainedMuscles(reset);
    setIsActive(reset);
    localStorage.setItem("trainedMuscles", JSON.stringify(reset));
    localStorage.setItem("isActive", JSON.stringify(reset));
  };

  // Effects
  useEffect(() => {
    const today = new Date();
    setCurrentWeek(getWeekNumber(today));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("trainedMuscles");
    if (saved) setTrainedMuscles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("trainedMuscles", JSON.stringify(trainedMuscles));
  }, [trainedMuscles]);

  useEffect(() => {
    const resetTracker = () => {
      const reset = Object.keys(trainedMuscles).reduce(
        (acc, muscle) => ({ ...acc, [muscle]: false }),
        {}
      );
      setTrainedMuscles(reset);
      localStorage.setItem("trainedMuscles", JSON.stringify(reset));
    };

    const now = new Date();
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + ((7 - now.getDay()) % 7),
      0,
      0,
      0
    );
    const timeUntilReset = nextReset.getTime() - now.getTime();
    const timer = setTimeout(resetTracker, timeUntilReset);

    return () => clearTimeout(timer);
  }, [trainedMuscles]);

  // Check if all muscles have been trained
  const allMusclesTrained = Object.values(trainedMuscles).every(
    (status) => status
  );

  // Context provider value
  const value = {
    muscleGroups,
    currentWeek,
    getWeekNumber,
    refreshPage,
    trainedMuscles,
    setTrainedMuscles,
    handleTraining,
    resetTraining,
    isActive,
    setIsActive,
    muscleImages,
    findMuscleImage,
    markAsTrained,
    allMusclesTrained,
  };

  return (
    <MuscleContext.Provider value={value}>{children}</MuscleContext.Provider>
  );
};

export default MuscleProvider;

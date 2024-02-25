import { createContext, useContext, useEffect, useState } from "react";

// Context creation
const MuscleContext = createContext();

// Custom hook to use the context
export const useMuscle = () => useContext(MuscleContext);

// Context provider component
const MuscleProvider = ({ children }) => {
  // State declarations
  const [currentWeek, setCurrentWeek] = useState(null);
  const [isActive, setIsActive] = useState({});
  const [trainedMuscles, setTrainedMuscles] = useState({});

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
    // Här skulle du anropa din server för att uppdatera träningsstatus för en muskelgrupp
    // Anta att servern svarar med den uppdaterade listan av trainedMuscles
    // Exempel:
    // api.updateTrainedMuscle(muscleName).then(updatedMuscles => {
    //   setTrainedMuscles(updatedMuscles);
    // });
  };

  const handleTraining = (groupName) => {
    // Liknande markAsTrained, detta skulle trigga ett API-anrop för att uppdatera vilka muskelgrupper som är aktiva
    // Exempel:
    // api.activateMuscleGroup(groupName).then(updatedIsActive => {
    //   setIsActive(updatedIsActive);
    // });
  };

  const refreshPage = () => {
    // Denna funktion kan behöva anpassas eller tas bort beroende på hur du hanterar siduppdateringar med serverdata
  };

  const resetTraining = () => {
    // Skicka ett anrop till servern för att återställa träningsstatus för alla muskelgrupper
    // api.resetAllTraining().then(() => {
    //   setTrainedMuscles({});
    //   setIsActive({});
    // });
  };

  // Effects
  useEffect(() => {
    const today = new Date();
    setCurrentWeek(getWeekNumber(today));
  }, []);

  // Hämta initial data från servern
  useEffect(() => {
    // Antag att du har en funktion som gör API-anropet
    fetch("/api/training")
      .then((response) => response.json())
      .then((data) => {
        setTrainedMuscles(data.trainedMuscles);
        setIsActive(data.isActive);
      })
      .catch((error) => console.error("Failed to fetch training data", error));
  }, []);

  // Notera: Vi tar bort useEffect för att spara till localStorage
  // och hanterar istället detta med API-anrop när ändringar görs.

  // Denna logik kan behöva anpassas beroende på hur du hanterar återställningen server-sidan
  useEffect(() => {
    // Exempel: Kontrollera om det är dags för återställning och gör ett API-anrop för att återställa
  }, []);

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

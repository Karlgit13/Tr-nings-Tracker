import React, { useState } from "react";
import Timer from "./Timer";
import WeeklyTracker from "./WeeklyTracker";

const MuscleGroupComponent = () => {
  const muscleGroups = [
    { name: "Bröst", restPeriod: 48 },
    { name: "Rygg", restPeriod: 48 },
    { name: "Ben", restPeriod: 72 },
    { name: "Axlar", restPeriod: 48 },
    { name: "Armar", restPeriod: 48 },
    { name: "Mage", restPeriod: 24 },
  ];

  const [isActive, setIsActive] = useState({});
  const [trainedMuscles, setTrainedMuscles] = useState({});

  const handleTraining = (groupName) => {
    setIsActive({
      ...isActive,
      [groupName]: true,
    });

    setTrainedMuscles({
      ...trainedMuscles,
      [groupName]: true,
    });
  };

  return (
    <div>
        <div>
            <WeeklyTracker muscleGroups={muscleGroups}/>
        </div>
      {muscleGroups.map((group) => (
        <div key={group.name}>
          <h3>{group.name}</h3>
          <button onClick={() => handleTraining(group.name)}>Tränad</button>
          {isActive[group.name] && <Timer restPeriod={group.restPeriod} />}
        </div>
      ))}
    </div>
  );
};

export default MuscleGroupComponent;

// api.js

const API_BASE_URL = "http://localhost:5000/api"; // Anpassa detta till din server-URL

export const updateTrainedMuscle = async (userId, muscleName) => {
    const response = await fetch(`${API_BASE_URL}/trainedMuscle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, muscleName }),
    });

    if (!response.ok) {
        throw new Error('Failed to update trained muscle');
    }

    return response.json();
};



export const addMuscleGroups = async (muscleGroups) => {
    const response = await fetch(`${API_BASE_URL}/muscleGroups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ muscleGroups }),
    });

    if (!response.ok) {
        throw new Error('Failed to add muscle groups');
    }

    return response.json();
};

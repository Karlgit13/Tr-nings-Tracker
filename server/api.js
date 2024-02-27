// api.js

const API_BASE_URL = "http://localhost:3000/api"; // Ändra portnummer om det behövs

export const updateTrainedMuscle = async (userId, muscleName) => {
    const response = await fetch(`${API_BASE_URL}/trainedMuscle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, muscleName }), // Inkludera userId i anropet
    });
    if (!response.ok) {
        throw new Error('Failed to update trained muscle');
    }
    return response.json();
};


export const activateMuscleGroup = async (groupName) => {
    const response = await fetch(`${API_BASE_URL}/activateMuscleGroup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName }),
    });
    if (!response.ok) {
        throw new Error('Failed to activate muscle group');
    }
    return response.json();
};

export const resetAllTraining = async () => {
    const response = await fetch(`${API_BASE_URL}/resetAllTraining`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to reset all training');
    }
    return response.json();
};
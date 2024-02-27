// api.js

const API_BASE_URL = "http://localhost:5000/api"; // Ändra portnummer om det behövs

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

export const getUserTrainedMuscles = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/userTrainedMuscles/${userId}`, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch trained muscles');
    }
    console.log(response);
    return response.json();
};

// Example of a function to add muscle groups through the API
export const addMuscleGroups = async (muscleGroups) => {
    try {
        const response = await fetch('/api/muscleGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ muscleGroups }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Error in addMuscleGroups:', e);
    }
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
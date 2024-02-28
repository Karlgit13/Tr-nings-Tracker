// API configuration
const API_BASE_URL = "http://localhost:5000/api"; // Change port number if needed

// Function to update a trained muscle for a user
export const updateTrainedMuscle = async (userId, muscleName) => {
    const response = await fetch(`${API_BASE_URL}/trainedMuscle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, muscleName }), // Include userId in the request
    });
    if (!response.ok) {
        throw new Error('Failed to update trained muscle');
    }
    return response.json();
};

// Function to get trained muscles for a user
export const getUserTrainedMuscles = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/userTrainedMuscles/${userId}`, {
            method: 'GET'
        });
        if (response.status === 404) {
            // No data found, handle appropriately, e.g., by informing the user
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch trained muscles');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch trained muscles', error);
        throw error;
    }
};

// Function to add muscle groups
export const addMuscleGroups = async (muscleGroups) => {
    try {
        const response = await fetch(`${API_BASE_URL}/muscleGroups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ muscleGroups }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (e) {
        console.error('Error in addMuscleGroups:', e);
        throw e;
    }
};

// The following functions can be uncommented and modified as needed for additional functionality

/*
// Function to activate a muscle group
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

// Function to reset all training
export const resetAllTraining = async () => {
    const response = await fetch(`${API_BASE_URL}/resetAllTraining`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to reset all training');
    }
    return response.json();
};
*/

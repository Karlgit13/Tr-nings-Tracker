// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


export const unmarkMuscleAsTrained = async (userId, muscleName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/unmarkMuscleTrained`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, muscleName }),
        });
        if (!response.ok) {
            throw new Error("Failed to unmark muscle as trained");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error unmarking muscle as trained:", error);
        throw error;
    }
};



export const fetchUserWeeklyReport = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/getUserWeeklyReport?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user weekly reports');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user weekly reports:', error);
    }
};



export const resetUserMuscleTimer = async (userId, muscleName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/resetMuscleTimer/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ muscleName })
        })
        if (!response.ok) {
            throw new Error("failed to reset muscle timer")
        }
        const data = await response.json()
        return data;
    }
    catch (error) {
        console.error("error resetting muscle timer:", error)
        throw error;
    }
}

export const getUserTrainingEndTimes = async (userId) => {

    try {
        const response = await fetch(`${API_BASE_URL}/userMusclesTimer/${userId}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch training end times');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching training end times:', error);
        throw error;
    }
};



export const markMuscleAsTrained = async (userId, muscleName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/markMuscleTrained`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, muscleName }),
        });
        if (!response.ok) {
            throw new Error('Failed to mark muscle as trained');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to mark muscle as trained', error);
        throw error;
    }
};


export const resetUserMuscles = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/resetUserMuscles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
            throw new Error('Failed to reset user muscles');
        }
        return response.json();
    } catch (error) {
        console.error('Failed to reset user muscles', error);
        throw error;
    }
};

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

export const getUserTrainedMuscles = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/userTrainedMuscles/${userId}`, {
            method: 'GET'
        });
        if (response.status === 404) {
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


// api.js

// Definiera bas-URL för API-anrop
const API_BASE_URL = "http://localhost:5000/api"; // Ändra portnummer om det behövs

// Funktion för att uppdatera tränad muskel
export const updateTrainedMuscle = async (muscleName) => {
    // Skicka en POST-förfrågan till API:et med muskelnamnet som data
    const response = await fetch(`${API_BASE_URL}/trainedMuscle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ muscleName }),
    });

    // Kasta ett fel om förfrågan inte lyckades
    if (!response.ok) {
        throw new Error('Failed to update trained muscle');
    }

    // Returnera JSON-svaret från API:et
    return response.json();
};

// Funktion för att aktivera muskelgrupp
export const activateMuscleGroup = async (groupName) => {
    // Skicka en POST-förfrågan till API:et med gruppnamnet som data
    const response = await fetch(`${API_BASE_URL}/activateMuscleGroup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName }),
    });

    // Kasta ett fel om förfrågan inte lyckades
    if (!response.ok) {
        throw new Error('Failed to activate muscle group');
    }

    // Returnera JSON-svaret från API:et
    return response.json();
};

// Funktion för att återställa all träning
export const resetAllTraining = async () => {
    // Skicka en POST-förfrågan till API:et utan någon data
    const response = await fetch(`${API_BASE_URL}/resetAllTraining`, {
        method: 'POST',
    });

    // Kasta ett fel om förfrågan inte lyckades
    if (!response.ok) {
        throw new Error('Failed to reset all training');
    }

    // Returnera JSON-svaret från API:et
    return response.json();
};
const { connectToDatabase } = require('./db');

async function resetUserMusclesHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST method is allowed' });
    }

    // Du kan behöva verifiera att användaren är behörig att återställa träningen här

    const { userId } = req.body; // userId skickas i begärans body

    if (!userId) {
        return res.status(400).json({ message: 'UserId is required in the request body' });
    }

    try {
        const db = await connectToDatabase(process.env.MONGODB_URI);
        const result = await db.collection('userMuscles').updateOne(
            { userId: userId },
            { $set: { trainedMuscles: [] } } // Rensar trainedMuscles-arrayen
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User muscles have been reset' });
    } catch (error) {
        console.error('Failed to reset user muscles:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = resetUserMusclesHandler;

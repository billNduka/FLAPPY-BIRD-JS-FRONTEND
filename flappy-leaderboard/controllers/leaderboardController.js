const Score = require('../models/score');

//POST /api/leaderboard/submit
const addScore = async (req, res) => {
    const {username, score} = req.body;

    if (!username || !score || typeof score != 'number') {
        return res.status(400).json({error: 'Username and score are required'});
    }
    try {
        const newScore = new Score({username, score});
        await newScore.save();
        res.status(201).json({message: 'Score added successfully', score: newScore});
    } catch (error) {
        console.error('Error adding score:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

//GET /api/leaderboard/view
const viewScores = async (req, res) => {
    try {
        const scores = await Score.find().sort({score: -1}).limit(15);
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({error: 'Internal server error'});
    }  
}

module.exports = {
    addScore, viewScores
}
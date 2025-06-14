const Score = require('../models/score');

//POST /api/leaderboard/submit
const addScore = async (req, res) => {
    const {username, score} = req.body;

    if (!username || !score || typeof score != 'number' || typeof username != 'string') {
        return res.status(400).json({error: 'Username and score are required'});
    } else if(username.length != 3){
        return res.status(400).json({error: 'Username must be 3 characters long'});
    }
    try {
        const newScore = new Score({username, score});
        await newScore.save();
        await Score.find()
            .sort({ score: -1, submittedAt: 1 }) 
            .skip(30)
            .then(async (scoresToDelete) => {
                if (scoresToDelete.length > 0) {
                    const ids = scoresToDelete.map(s => s._id);
                    await Score.deleteMany({ _id: { $in: ids } });
                }
            });

        res.status(201).json({message: 'Score added successfully', score: newScore});
    } catch (error) {
        console.error('Error adding score:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

//GET /api/leaderboard/view
const viewScores = async (req, res) => {
    try {
        const scores = await Score.find().sort({score: -1, submittedAt: 1}).limit(30);
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({error: 'Internal server error'});
    }  
}

module.exports = {
    addScore, viewScores
}
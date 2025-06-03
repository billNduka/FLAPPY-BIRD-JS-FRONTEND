const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Submit a new score
router.post('/add', leaderboardController.addScore);

// Get top scores
router.get('/view', leaderboardController.viewScores);

module.exports = router;
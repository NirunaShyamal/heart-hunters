const express = require('express');
const router = express.Router();
const { getPuzzle, submitAnswer, getLeaderboard, getLevel } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/level/:level', protect, getLevel);
router.get('/puzzle', protect, getPuzzle);
router.post('/submit', protect, submitAnswer);
router.get('/leaderboard', getLeaderboard); // Public route

module.exports = router;

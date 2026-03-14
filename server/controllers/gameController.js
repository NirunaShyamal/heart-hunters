const { fetchPuzzle } = require('../services/heartApiService');
const User = require('../models/User');

// Temporary in-memory store for solutions (In production, use Redis or DB)
// Map<userId, solution>
const activeSolutions = new Map();

// Level Generators
// 0: Empty, 1: Wall, 2: Heart, 3: Treasure, 5: Start
const generateLevel = (levelNum) => {
    const size = 15; // Must be odd for this algorithm
    // 1: Wall (Default)
    const grid = Array(size).fill().map(() => Array(size).fill(1));

    // Recursive Backtracker
    const stack = [];
    // Start at (1,1)
    const startR = 1;
    const startC = 1;
    grid[startR][startC] = 0;
    stack.push([startR, startC]);

    const dirs = [
        [0, -2], [0, 2], [-2, 0], [2, 0]
    ];

    while (stack.length > 0) {
        const [currR, currC] = stack[stack.length - 1];

        // Shuffle directions
        const shuffledDirs = dirs.sort(() => Math.random() - 0.5);
        let moved = false;

        for (const [dr, dc] of shuffledDirs) {
            const nextR = currR + dr;
            const nextC = currC + dc;

            if (nextR > 0 && nextR < size - 1 && nextC > 0 && nextC < size - 1 && grid[nextR][nextC] === 1) {
                grid[nextR][nextC] = 0; // Mark next cell as path
                grid[currR + dr / 2][currC + dc / 2] = 0; // Remove wall between
                stack.push([nextR, nextC]);
                moved = true;
                break;
            }
        }

        if (!moved) {
            stack.pop();
        }
    }

    // Open Start and Exit
    grid[0][0] = 5; // Start
    grid[0][1] = 0; // Connect Start
    grid[1][0] = 0;

    grid[size - 1][size - 1] = 6; // Exit
    grid[size - 1][size - 2] = 0; // Connect Exit
    grid[size - 2][size - 1] = 0;

    // Create Loops (Remove random walls to make it less frustrating)
    // 20% of remaining walls removed to create multiple paths
    for (let r = 1; r < size - 1; r++) {
        for (let c = 1; c < size - 1; c++) {
            if (grid[r][c] === 1 && Math.random() < 0.20) {
                // Ensure we don't create huge open areas (check neighbors)
                let neighbors = 0;
                if (grid[r - 1][c] === 0) neighbors++;
                if (grid[r + 1][c] === 0) neighbors++;
                if (grid[r][c - 1] === 0) neighbors++;
                if (grid[r][c + 1] === 0) neighbors++;

                // Only remove wall if it connects separate paths or extends a path, avoiding large open boxes
                if (neighbors >= 1 && neighbors <= 3) grid[r][c] = 0;
            }
        }
    }

    // Place Objects (Traps, Health, Treasure)
    const emptyCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0 && !(r < 3 && c < 3) && !(r > size - 4 && c > size - 4)) {
                emptyCells.push([r, c]);
            }
        }
    }

    // Settings based on level
    const trapCount = 3 + levelNum;
    const healthCount = 2; // Always some help

    // Shuffle empty cells
    emptyCells.sort(() => Math.random() - 0.5);

    // Place Traps
    for (let i = 0; i < trapCount && i < emptyCells.length; i++) {
        const [r, c] = emptyCells.pop();
        grid[r][c] = 7;
    }

    // Place Health
    for (let i = 0; i < healthCount && i < emptyCells.length; i++) {
        const [r, c] = emptyCells.pop();
        grid[r][c] = 8;
    }

    // Place Treasure (Rare)
    if (Math.random() > 0.7 && emptyCells.length > 0) {
        const [r, c] = emptyCells.pop();
        grid[r][c] = 3;
    }

    return grid;
};

// @desc    Get current level layout
// @route   GET /api/game/level/:level
// @access  Private
const getLevel = async (req, res) => {
    const level = parseInt(req.params.level) || 1;
    const grid = generateLevel(level);
    res.json({ grid, level });
};

// @desc    Get a new puzzle
// @route   GET /api/game/puzzle
// @access  Private
const getPuzzle = async (req, res) => {
    try {
        const puzzleData = await fetchPuzzle();

        // Store solution mapped to user ID
        activeSolutions.set(req.user.id, puzzleData.solution);

        // Send only the image (question) to the client
        res.json({
            image: puzzleData.question
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit an answer
// @route   POST /api/game/submit
// @access  Private
const submitAnswer = async (req, res) => {
    const { answer } = req.body;
    const userId = req.user.id;

    if (!activeSolutions.has(userId)) {
        return res.status(400).json({ message: 'No active puzzle for this user' });
    }

    const correctSolution = activeSolutions.get(userId);

    if (parseInt(answer) === correctSolution) {
        // Correct answer
        activeSolutions.delete(userId); // Clear solution to prevent replay

        // Update score
        const user = await User.findById(userId);
        user.score += 10; // +10 points
        await user.save();

        res.json({
            success: true,
            message: 'Correct!',
            newScore: user.score
        });
    } else {
        res.json({
            success: false,
            message: 'Incorrect, try again.'
        });
    }
};

// @desc    Get leaderboard
// @route   GET /api/game/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ score: -1 }).limit(10).select('username score');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getLevel,
    getPuzzle,
    submitAnswer,
    getLeaderboard
};

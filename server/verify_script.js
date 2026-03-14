const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register
        const username = `user_${Date.now()}`;
        const password = 'password123';
        console.log(`1. Registering user: ${username}`);
        const regRes = await axios.post(`${API_URL}/auth/register`, { username, password });
        console.log('   Registration Success:', regRes.data.username === username);
        const token = regRes.data.token;

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, { username, password });
        console.log('   Login Success:', loginRes.data.token === token);

        // 3. Get Puzzle
        console.log('3. Fetching Puzzle...');
        const puzzleRes = await axios.get(`${API_URL}/game/puzzle`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Puzzle Fetched:', !!puzzleRes.data.image);

        // Note: We can't know the solution from here without cheating or parsing the server logs.
        // But we can try to submit a wrong answer.

        // 4. Submit Wrong Answer
        console.log('4. Submitting Wrong Answer (0)...');
        const wrongRes = await axios.post(`${API_URL}/game/submit`, { answer: 0 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Wrong Answer Response:', wrongRes.data.message);
        console.log('   Success flag is false:', wrongRes.data.success === false);

        // 5. Get Leaderboard
        console.log('5. Fetching Leaderboard...');
        const leadRes = await axios.get(`${API_URL}/game/leaderboard`);
        console.log('   Leaderboard Fetched:', Array.isArray(leadRes.data));
        console.log('   User is in leaderboard:', leadRes.data.some(u => u.username === username));

        console.log('--- Verification Complete: Backend seems functional ---');

    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
};

runVerification();

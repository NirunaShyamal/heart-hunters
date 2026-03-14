const axios = require('axios');

const HEART_API_URL = 'http://marcconrad.com/uob/heart/api.php?out=json&base64=yes';

const fetchPuzzle = async () => {
    try {
        const response = await axios.get(HEART_API_URL);
        return response.data; // { question: "base64...", solution: 12 }
    } catch (error) {
        console.error('Error fetching puzzle:', error);
        throw new Error('Failed to fetch puzzle from Heart API');
    }
};

module.exports = {
    fetchPuzzle
};

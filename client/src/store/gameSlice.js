import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        liveScore: 0,
    },
    reducers: {
        setLiveScore(state, action) {
            state.liveScore = action.payload;
        },
        resetGame(state) {
            state.liveScore = 0;
        },
    },
});

export const { setLiveScore, resetGame } = gameSlice.actions;
export default gameSlice.reducer;

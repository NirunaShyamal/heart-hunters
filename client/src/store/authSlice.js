import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/register', { username, email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

// ── Initial State ─────────────────────────────────────────────────────────────

const storedUser = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: storedUser || null,
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('user');
        },
        // Called after a correct puzzle answer to keep score in sync
        updateScore(state, action) {
            if (state.user) {
                state.user = { ...state.user, score: action.payload };
                // Persist updated score to localStorage too
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout, updateScore } = authSlice.actions;
export default authSlice.reducer;

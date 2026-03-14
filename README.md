# Heart Hunters

Heart Hunters is a MERN stack puzzle game where players solve visual puzzles to collect "Hearts".

## Prerequisites

- Node.js (v14+)
- MongoDB (Must be running locally on default port 27017)

## Setup

1. **Install Dependencies**:
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

2. **Environment Setup**:
   - The backend uses a default `.env` configuration.
   - Ensure MongoDB is running locally.

## Running the Application

1. **Start the Backend**:
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

2. **Start the Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`.

## Features implemented

- **Authentication**: User registration and login with JWT.
- **Game Logic**: Secure proxy to Heart API, preventing cheating.
- **Leaderboard**: Displays top scores.
- **Security**: Hashed passwords, input validation.

## Verification

Due to missing local MongoDB executable, full end-to-end verification could not be completed automatically. Please ensure MongoDB is installed and running before testing.

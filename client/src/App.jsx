import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/layout/AdminRoute';
import AuthContext from './context/AuthContext';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/game"
              element={
                <PrivateRoute>
                  <GamePage />
                </PrivateRoute>
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route path="/" element={<Navigate to="/game" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

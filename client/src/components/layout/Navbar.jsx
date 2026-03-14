import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    // Read directly from Redux store — score updates live after each correct answer
    const user = useSelector((state) => state.auth.user);

    return (
        <nav>
            <div className="logo">
                <h1>Heart Hunters</h1>
            </div>
            <ul>
                {user ? (
                    <>
                        <span>Welcome, {user.username} (Score: {user.score})</span>
                        <Link to="/game">Play</Link>
                        <Link to="/leaderboard">Leaderboard</Link>
                        <button onClick={() => dispatch(logout())} style={{ marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/leaderboard">Leaderboard</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

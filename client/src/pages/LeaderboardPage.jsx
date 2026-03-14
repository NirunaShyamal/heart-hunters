import { useState, useEffect } from 'react';
import api from '../services/api';

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/game/leaderboard');
                setLeaders(res.data);
            } catch (err) {
                console.error('Failed to fetch leaderboard');
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="container">
            <div className="card">
                <h2>Top Hunters</h2>
                {loading ? (
                    <p>Loading scores...</p>
                ) : (
                    <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rank</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Hunter</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Hearts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((user, index) => (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '0.5rem' }}>{index + 1}</td>
                                    <td style={{ padding: '0.5rem' }}>{user.username}</td>
                                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>{user.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;

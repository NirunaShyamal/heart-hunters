import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateScore } from '../store/authSlice';
import { setLiveScore } from '../store/gameSlice';
import api from '../services/api';
import GameGrid from '../components/game/GameGrid';
import PuzzleModal from '../components/game/PuzzleModal';
import GameOverModal from '../components/game/GameOverModal';
import HeartDisplay from '../components/game/HeartDisplay';

// ── Web Audio helpers (no external files needed) ──────────────────────────────
const playSound = (type) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'trap') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        } else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, ctx.currentTime);        // C5
            osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);  // E5
            osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);  // G5
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'health') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        }
    } catch (e) {
        // Silently ignore if AudioContext is unavailable
    }
};

const GamePage = () => {
    const dispatch = useDispatch();
    const reduxUser = useSelector((state) => state.auth.user);
    const liveScore = useSelector((state) => state.game.liveScore);

    const [grid, setGrid] = useState(null);
    const [level, setLevel] = useState(1);
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

    // Stats & Modal States
    const [lives, setLives] = useState(3);
    const [isInvincible, setIsInvincible] = useState(false);
    // UseRef for immediate collision logic to prevent double-hits
    const invincibleRef = useRef(false);

    const [puzzleOpen, setPuzzleOpen] = useState(false);
    const [puzzleImage, setPuzzleImage] = useState(null);
    const [treasureOpen, setTreasureOpen] = useState(false);
    const [treasureImage, setTreasureImage] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [message, setMessage] = useState('Find the Exit Tunnel (🚪)!');

    // Sync live score from Redux user on mount/login
    useEffect(() => {
        if (reduxUser?.score !== undefined) {
            dispatch(setLiveScore(reduxUser.score));
        }
    }, [reduxUser?.score]);

    // Fetch Level Data
    const fetchLevel = async (lvl) => {
        try {
            const res = await api.get(`/game/level/${lvl}`);
            setGrid(res.data.grid);
            setLevel(res.data.level);
            setPlayerPos({ x: 0, y: 0 });
            invincibleRef.current = false;
            setIsInvincible(false);
        } catch (err) {
            console.error('Failed to load level', err);
        }
    };

    useEffect(() => {
        fetchLevel(level);
    }, [level]);

    const fetchPuzzle = async () => {
        try {
            const res = await api.get('/game/puzzle');
            setPuzzleImage(res.data.image);
            setPuzzleOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTreasure = async () => {
        try {
            const res = await api.get('https://dog.ceo/api/breeds/image/random');
            setTreasureImage(res.data.message);
            setTreasureOpen(true);
            setMessage('You found a Legendary Artifact! 📦');
        } catch (err) {
            console.error('Failed to fetch treasure', err);
        }
    };

    const handleRestart = () => {
        window.location.reload();
    };

    // Handle Movement
    const handleKeyDown = useCallback((e) => {
        if (puzzleOpen || treasureOpen || gameOver || !grid) return;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        } else {
            return;
        }

        setPlayerPos(prev => {
            let newX = prev.x;
            let newY = prev.y;

            if (e.key === 'ArrowUp') newY--;
            if (e.key === 'ArrowDown') newY++;
            if (e.key === 'ArrowLeft') newX--;
            if (e.key === 'ArrowRight') newX++;

            // Boundary Check
            if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0].length) {
                return prev;
            }

            const targetCell = grid[newY][newX];

            // Wall Collision
            if (targetCell === 1) return prev;

            // 7: Trap (Fire)
            if (targetCell === 7) {
                if (!invincibleRef.current) {
                    playSound('trap');
                    setLives(l => {
                        const newLives = l - 1;
                        if (newLives <= 0) {
                            setGameOver(true);
                        }
                        return newLives;
                    });

                    // Trigger Invincibility
                    invincibleRef.current = true;
                    setIsInvincible(true);

                    setTimeout(() => {
                        invincibleRef.current = false;
                        setIsInvincible(false);
                    }, 1000);
                }
            }

            // 8: Health (Heart pickup)
            if (targetCell === 8) {
                setLives(l => {
                    if (l < 3) {
                        playSound('health');
                        setMessage('Restored 1 Life! ❤️');
                    }
                    return Math.min(l + 1, 3);
                });
                setGrid(g => {
                    const ng = g.map(r => [...r]);
                    ng[newY][newX] = 0;
                    return ng;
                });
            }

            // 6: Exit Tunnel (Goal)
            if (targetCell === 6) {
                fetchPuzzle();
            }

            // 3: Treasure
            if (targetCell === 3) {
                fetchTreasure();
                setGrid(g => {
                    const ng = g.map(r => [...r]);
                    ng[newY][newX] = 0;
                    return ng;
                });
            }

            return { x: newX, y: newY };
        });
    }, [grid, puzzleOpen, treasureOpen, gameOver]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handlePuzzleSubmit = async (answer) => {
        try {
            const res = await api.post('/game/submit', { answer });
            if (res.data.success) {
                // Play correct sound
                playSound('correct');
                // Update Redux store with new score (Navbar reflects it instantly)
                dispatch(updateScore(res.data.newScore));
                dispatch(setLiveScore(res.data.newScore));
                setMessage(`Sector Cleared! Warp to Level ${level + 1}...`);
                setPuzzleOpen(false);
                setTimeout(() => setLevel(l => l + 1), 1000);
            } else {
                // Wrong answer — return 'wrong' so PuzzleModal can flash
                return { wrong: true };
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', color: '#f1faee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '640px', margin: '0 auto' }}>
                <h2>Level {level}</h2>
                <HeartDisplay lives={lives} maxLives={3} />
            </div>

            <p>{message}</p>

            <GameGrid grid={grid} playerPos={playerPos} isInvincible={isInvincible} />

            {gameOver && <GameOverModal score={liveScore} onRestart={handleRestart} />}

            {puzzleOpen && (
                <PuzzleModal
                    image={puzzleImage}
                    onSubmit={handlePuzzleSubmit}
                    onClose={() => setPuzzleOpen(false)}
                />
            )}

            {treasureOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: '#1d3557', padding: '2rem', borderRadius: '12px',
                        maxWidth: '500px', border: '2px solid #ffd700', textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#ffd700' }}>LEGENDARY FIND!</h3>
                        <img src={treasureImage} alt="Treasure" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '300px' }} />
                        <br />
                        <button
                            onClick={() => setTreasureOpen(false)}
                            style={{ marginTop: '1rem', backgroundColor: '#ffd700', color: '#000' }}
                        >
                            Collect Reward
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <p>Score: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{liveScore}</span></p>
            </div>
        </div>
    );
};

export default GamePage;

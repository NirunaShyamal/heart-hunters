import { useState } from 'react';

const PuzzleModal = ({ image, onSubmit, onClose }) => {
    const [answer, setAnswer] = useState('');
    const [wrongFlash, setWrongFlash] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await onSubmit(answer);
        if (result?.wrong) {
            // Visual flash feedback for wrong answer
            setWrongFlash(true);
            setTimeout(() => setWrongFlash(false), 600);
            setAnswer('');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div style={{
                backgroundColor: '#1d3557', padding: '2rem', borderRadius: '12px',
                maxWidth: '500px', width: '90%', textAlign: 'center',
                border: wrongFlash ? '2px solid #ff0000' : '2px solid #e63946',
                boxShadow: wrongFlash
                    ? '0 0 30px rgba(255, 0, 0, 0.8)'
                    : '0 0 20px rgba(230, 57, 70, 0.4)',
                transition: 'border 0.1s, box-shadow 0.1s',
                animation: wrongFlash ? 'shakeModal 0.4s ease' : 'none',
            }}>
                <h3 style={{ color: wrongFlash ? '#ff4444' : '#f1faee', transition: 'color 0.2s' }}>
                    {wrongFlash ? '❌ Incorrect! Try Again!' : 'Unlock the Gateway!'}
                </h3>
                <img
                    src={image.startsWith('http') ? image : `data:image/png;base64,${image}`}
                    alt="Puzzle"
                    style={{
                        maxWidth: '100%', margin: '1rem 0', borderRadius: '8px',
                        opacity: wrongFlash ? 0.6 : 1,
                        transition: 'opacity 0.2s'
                    }}
                />
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        placeholder="Solution?"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        autoFocus
                        style={{
                            padding: '0.8rem', fontSize: '1.2rem', width: '100px',
                            textAlign: 'center',
                            border: wrongFlash ? '2px solid #ff4444' : '1px solid #457b9d',
                            backgroundColor: wrongFlash ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                            color: '#f1faee',
                            borderRadius: '4px',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                    />
                    <br />
                    <button type="submit" style={{ marginTop: '1rem' }}>Unlock</button>
                    <button type="button" onClick={onClose} style={{ marginLeft: '1rem', backgroundColor: '#457b9d' }}>Retreat</button>
                </form>
            </div>

            {/* Shake animation for wrong answer */}
            <style>{`
                @keyframes shakeModal {
                    0%   { transform: translateX(0); }
                    20%  { transform: translateX(-10px); }
                    40%  { transform: translateX(10px); }
                    60%  { transform: translateX(-8px); }
                    80%  { transform: translateX(8px); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default PuzzleModal;

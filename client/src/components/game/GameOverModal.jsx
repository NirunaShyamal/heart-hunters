import React from 'react';

const GameOverModal = ({ score, onRestart }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
            <div style={{
                backgroundColor: '#1d3557', padding: '3rem', borderRadius: '12px',
                border: '4px solid #e63946', textAlign: 'center',
                boxShadow: '0 0 50px rgba(230, 57, 70, 0.5)'
            }}>
                <h1 style={{ color: '#e63946', fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>
                    Game Over
                </h1>
                <p style={{ color: '#f1faee', fontSize: '1.5rem', marginBottom: '2rem' }}>
                    The maze has claimed another soul.
                </p>
                <div style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#a8dadc' }}>
                    Final Score: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{score}</span>
                </div>
                <button
                    onClick={onRestart}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        backgroundColor: '#e63946',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 0 #9d0208'
                    }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;

import React from 'react';

// Dedicated component for displaying player lives as heart icons
const HeartDisplay = ({ lives, maxLives = 3 }) => {
    return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {Array.from({ length: maxLives }).map((_, i) => (
                <span
                    key={i}
                    style={{
                        fontSize: '1.4rem',
                        filter: i < lives
                            ? 'drop-shadow(0 0 6px #ff0055)'
                            : 'grayscale(1) opacity(0.3)',
                        transition: 'filter 0.3s ease',
                        transform: i < lives ? 'scale(1)' : 'scale(0.85)',
                        display: 'inline-block',
                        transition: 'all 0.3s ease',
                    }}
                >
                    ❤️
                </span>
            ))}
        </div>
    );
};

export default HeartDisplay;

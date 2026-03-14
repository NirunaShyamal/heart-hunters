import React from 'react';

const TILE_STYLES = {
    0: { background: 'rgba(20, 30, 40, 0.6)' }, // Path (Lighter)
    1: { background: '#000', border: '1px solid #00f3ff', boxShadow: '0 0 5px #00f3ff' }, // Wall (Neon Outline)
    3: { fontSize: '24px', filter: 'drop-shadow(0 0 8px #ffd700)' }, // Treasure
    4: { fontSize: '24px', filter: 'drop-shadow(0 0 8px #00ffcc)' }, // Player
    5: { background: 'rgba(0, 255, 0, 0.2)', border: '1px dashed #00ff00' }, // Start
    6: { background: 'rgba(0, 243, 255, 0.2)', border: '2px solid #fff' }, // Exit Tile Background
    7: { fontSize: '24px', filter: 'drop-shadow(0 0 8px #ff4500)' }, // Trap
    8: { fontSize: '24px', filter: 'drop-shadow(0 0 8px #ff0055)' }  // Health
};

const GameGrid = ({ grid, playerPos, isInvincible }) => {
    if (!grid) return <div style={{ color: 'var(--neon-blue)' }}>Initializing Neural Link...</div>;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${grid[0].length}, 40px)`,
                gridTemplateRows: `repeat(${grid.length}, 40px)`,
                gap: '2px',
                backgroundColor: '#050a10', // Deep dark bg
                padding: '20px',
                borderRadius: '8px',
                margin: '20px auto',
                width: 'fit-content',
                border: '2px solid var(--neon-blue)',
                boxShadow: '0 0 50px rgba(0, 243, 255, 0.2)'
            }}
        >
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const isPlayer = rowIndex === playerPos.y && colIndex === playerPos.x;
                    const style = TILE_STYLES[isPlayer ? 4 : cell] || TILE_STYLES[0];

                    // Invincibility flicker
                    const playerStyle = isPlayer && isInvincible ? {
                        opacity: 0.5,
                        filter: 'sepia(1) hue-rotate(90deg)'
                    } : {};

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.1s',
                                ...style,
                                ...playerStyle
                            }}
                        >
                            {/* Icons */}
                            {cell === 3 && '📦'}

                            {/* Exit Tunnel with Text */}
                            {cell === 6 && (
                                <>
                                    <span style={{ fontSize: '20px', lineHeight: '20px' }}>🚪</span>
                                    <span style={{ fontSize: '8px', color: '#fff', fontWeight: 'bold', lineHeight: '8px' }}>EXIT</span>
                                </>
                            )}

                            {cell === 7 && '🔥'}
                            {cell === 8 && '❤️'}
                            {isPlayer && '🤖'}
                            {cell === 5 && 'S'}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default GameGrid;

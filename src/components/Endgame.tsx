// src/components/EndGame.tsx
import React from 'react';

interface EndGameProps {
  onRestart: () => void;  // Function to handle restarting the game
  onExit?: () => void;    // Optional function to handle exiting to the main menu
}

const EndGame: React.FC<EndGameProps> = ({ onRestart, onExit }) => {
  return (
    <div className="end-game">
      <h1>Game Over</h1>
      <p>Your adventure has come to an end, but every end is a new beginning.</p>
      <button onClick={onRestart}>Restart Game</button>
      {onExit && <button onClick={onExit}>Exit to Menu</button>}
    </div>
  );
};

export default EndGame;

import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import EndGame from './components/Endgame';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  const restartGame = () => {
    setGameOver(false);
    setGameStarted(true);
  };

  if (gameOver) {
    return <EndGame onRestart={restartGame} onExit={() => setGameStarted(false)} />;
  }

  return (
    <div className="App">
      {gameStarted ? <Game onEndGame={endGame} /> : <Menu onStartGame={startGame} />}
    </div>
  );
}

export default App;

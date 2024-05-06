import { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import EndGame from './components/Endgame';
import { getInitialGameState } from './components/Game'; // Update this path if needed
import { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameState(getInitialGameState());  // Create a new game state instance
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  const restartGame = () => {
    setGameState(getInitialGameState());  // Create a new game state instance
    setGameOver(false);
    setGameStarted(true);
  };

  if (gameOver) {
    return <EndGame onRestart={restartGame} />;
  }

  return (
    <div className="App">
      {gameStarted ? <Game gameState={gameState} updateGameState={setGameState} onEndGame={endGame} /> : <Menu onStartGame={startGame} />}
    </div>
  );
}

export default App;

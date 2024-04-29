import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu'; // Make sure the path is correct

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="App">
      {gameStarted ? <Game /> : <Menu onStartGame={startGame} />}
    </div>
  );
}

export default App;

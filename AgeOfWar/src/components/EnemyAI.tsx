import React, { useEffect } from 'react';
import { GameState, Unit, UnitsByEvolution } from '../types';

function chooseUnitToSpawn(unitsByEvolution: UnitsByEvolution, evolutionLevel: number): Unit | null {
  const possibleUnits = unitsByEvolution[evolutionLevel];
  if (!possibleUnits || possibleUnits.length === 0) {
    console.log("No units available for spawning.");
    return null;
  }
  return possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
}

const EnemyAIComponent: React.FC<{
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => GameState) => void;
  unitsByEvolution: UnitsByEvolution;
}> = ({ gameState, updateGameState, unitsByEvolution }) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      const unitToSpawn = chooseUnitToSpawn(unitsByEvolution, gameState.enemyEvolutionLevel);
      if (unitToSpawn) {
        updateGameState((prevState: GameState): GameState => {
          const newEnemyUnits = [...prevState.enemyUnits, { ...unitToSpawn, position: 1650 }];
          return {
            ...prevState,
            enemyUnits: newEnemyUnits,
            enemyGold: prevState.enemyGold - unitToSpawn.cost, // Assuming this operation makes sense for your game logic
          };
        });
      }
    }, 7000);

    return () => clearInterval(intervalId);
  }, [gameState.enemyEvolutionLevel, gameState.enemyGold, unitsByEvolution, updateGameState]);

  return null; // This component doesn't render anything
};

export default EnemyAIComponent;

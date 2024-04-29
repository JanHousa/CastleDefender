import React, { useEffect, useState } from 'react';
import { GameState, Unit, UnitsByEvolution } from '../types';
import { v4 as uuidv4 } from 'uuid';

function chooseUnitToSpawn(unitsByEvolution: UnitsByEvolution, evolutionLevel: number, timeElapsed: number): Unit | null {
  let availableUnits;
  if (timeElapsed >= 100000) { // 100 seconds, can spawn all units
    availableUnits = unitsByEvolution[evolutionLevel];
  } else if (timeElapsed >= 30000) { // 30 seconds, can spawn units up to ID 2
    availableUnits = unitsByEvolution[evolutionLevel].filter(unit => unit.id <= 2);
  } else { // Less than 30 seconds, only spawn units with ID 1
    availableUnits = unitsByEvolution[evolutionLevel].filter(unit => unit.id === 1);
  }

  if (!availableUnits || availableUnits.length === 0) {
    console.log("No units available for spawning.");
    return null;
  }

  // Randomly select from available units
  return { ...availableUnits[Math.floor(Math.random() * availableUnits.length)], id: uuidv4() };
}

const EnemyAIComponent: React.FC<{
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => GameState) => void;
  unitsByEvolution: UnitsByEvolution;
}> = ({ gameState, updateGameState, unitsByEvolution }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [evolutionTimer, setEvolutionTimer] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);
      setEvolutionTimer(prevTime => prevTime + Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);

      const unitToSpawn = chooseUnitToSpawn(unitsByEvolution, gameState.enemyTower.evolutionLevel, timeElapsed);
      if (unitToSpawn) {
      updateGameState((prevState: GameState): GameState => {
        const newEnemyUnit = { ...unitToSpawn, position: 1800, id: uuidv4(), isEnemy: true };
        const newEnemyUnits = [...prevState.enemyUnits, newEnemyUnit];
        return {
        ...prevState,
        enemyUnits: newEnemyUnits,
        };
      });
      }

      // Check if it's time to evolve
      if (evolutionTimer >= 180000) { // Evolve every 3 minutes
      updateGameState(prevState => ({
        ...prevState,
        enemyTower: {
        ...prevState.enemyTower,
        evolutionLevel: prevState.enemyTower.evolutionLevel + 1
        }
      }));
      setEvolutionTimer(0); // Reset the evolution timer
      setTimeElapsed(0); // Reset the unit spawning timer
      }

    }, Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000);

    return () => clearInterval(intervalId);
  }, [gameState.enemyTower.evolutionLevel, unitsByEvolution, updateGameState, timeElapsed, evolutionTimer]);

  return null; 
};

export default EnemyAIComponent;

import React, { useEffect } from 'react';
import { GameState, Unit, UnitsByEvolution } from '../types';
import { v4 as uuidv4 } from 'uuid'; 

function chooseUnitToSpawn(unitsByEvolution: UnitsByEvolution, evolutionLevel: number): Unit | null {
  const possibleUnits = unitsByEvolution[evolutionLevel];
  if (!possibleUnits || possibleUnits.length === 0) {
    console.log("No units available for spawning.");
    return null;
  }

  const unitTemplate = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
  return {
    ...unitTemplate,
    id: uuidv4(), 
  };
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

          const newEnemyUnit = { ...unitToSpawn, position: 1600, id: uuidv4(), isEnemy: true };
          const newEnemyUnits = [...prevState.enemyUnits, newEnemyUnit];
          return {
            ...prevState,
            enemyUnits: newEnemyUnits,
            enemyGold: prevState.enemyGold - unitToSpawn.cost,
          };
        });
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [gameState.enemyEvolutionLevel, gameState.enemyGold, unitsByEvolution, updateGameState]);

  return null; 
};

export default EnemyAIComponent;


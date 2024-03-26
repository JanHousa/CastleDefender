import React, { useEffect } from 'react';
import { GameState, Unit, UnitsByEvolution } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

function chooseUnitToSpawn(unitsByEvolution: UnitsByEvolution, evolutionLevel: number): Unit | null {
  const possibleUnits = unitsByEvolution[evolutionLevel];
  if (!possibleUnits || possibleUnits.length === 0) {
    console.log("No units available for spawning.");
    return null;
  }
  // Vybrat jednotku a přiřadit jí uuid
  const unitTemplate = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
  return {
    ...unitTemplate,
    id: uuidv4(), // Přidání UUID při vytváření jednotky
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
          // Přiřazení počáteční pozice a přidání do seznamu nepřátelských jednotek
          const newEnemyUnit = { ...unitToSpawn, position: 1650, id: uuidv4() }; // Zde je přidáno UUID
          const newEnemyUnits = [...prevState.enemyUnits, newEnemyUnit];
          return {
            ...prevState,
            enemyUnits: newEnemyUnits,
            enemyGold: prevState.enemyGold - unitToSpawn.cost,
          };
        });
      }
    }, 7000); // Můžete upravit interval spawnování dle potřeby

    return () => clearInterval(intervalId);
  }, [gameState.enemyEvolutionLevel, gameState.enemyGold, unitsByEvolution, updateGameState]);

  return null; // Tato komponenta nic nevykresluje
};

export default EnemyAIComponent;

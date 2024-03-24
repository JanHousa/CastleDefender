import React, { useEffect } from 'react';
import { GameState, Unit } from '../types';
import UnitComponent from '../components/UnitComponent';


const BattlefieldComponent = ({ gameState, updateGameState }) => {
  // Function to handle unit movements and attacks
  const handleCombatAndMovement = () => {
    let newGameState = { ...gameState };

    // Process each active unit
    newGameState.activeUnits = gameState.activeUnits.map(unit => {
      // Find an enemy within range
      const targetIndex = gameState.enemyUnits.findIndex(
        enemy => Math.abs(enemy.position - unit.position) <= unit.range
      );

      if (targetIndex !== -1) {
        // Enemy is within range, attack
        const enemy = gameState.enemyUnits[targetIndex];
        const updatedEnemy = { ...enemy, health: enemy.health - unit.attack };

        // Check if the enemy is defeated
        if (updatedEnemy.health <= 0) {
          newGameState.enemyUnits = newGameState.enemyUnits.filter((_, i) => i !== targetIndex);
        } else {
          newGameState.enemyUnits[targetIndex] = updatedEnemy;
        }

        // Here, you could set the unit's status to "attacking"
        return { ...unit /*, status: "attacking" */ };
      } else {
        // No enemy in range, move the unit forward
        // This simplistic movement logic should be replaced with your game's logic
        return { ...unit, position: unit.position + 1 };
      }
    });

    // Update the global game state with new positions and health
    updateGameState(newGameState);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleCombatAndMovement();
    }, 1000); // Adjust as necessary for your game's pace

    return () => clearInterval(interval);
  }, [gameState, updateGameState]);

  return (
    <div className="battlefield">
      {gameState.activeUnits.map(unit => (
        // Assuming UnitComponent is a component that renders the unit
        <UnitComponent key={unit.id} unit={unit} />
      ))}
      {gameState.enemyUnits.map(unit => (
        <UnitComponent key={unit.id} unit={unit} isEnemy={true} />
      ))}
    </div>
  );
};

export default BattlefieldComponent;
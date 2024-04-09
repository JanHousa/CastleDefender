import React, { useEffect } from 'react';
import { GameState, Unit } from '../types'; // Předpokládejme definici typů
import UnitComponent from './UnitComponent';

interface BattlefieldProps {
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => Partial<GameState>) => void;
}

function fight(unit: Unit, target: Unit, currentTime: number): { attacked: boolean; newHealth: number } {
  if (currentTime - unit.lastAttackTime >= unit.attackSpeed) {
    const newHealth = target.health - unit.attack;
    unit.lastAttackTime = currentTime;
    return { attacked: true, newHealth: Math.max(0, newHealth) }; // Zajišťujeme, že zdraví nebude záporné
  }
  return { attacked: false, newHealth: target.health };
}

function updateUnitPositionAndAttack(
  unit: Unit,
  opponents: Unit[],
  allies: Unit[],
  currentTime: number,
  updateGameState: (update: Partial<GameState>) => void
): Unit | null {
  let isAttacking = false;
  const targetIndex = opponents.findIndex(opponent => Math.abs(unit.position - opponent.position) <= unit.range);

  if (targetIndex !== -1) {
    const target = opponents[targetIndex];
    const { attacked, newHealth } = fight(unit, target, currentTime);

    if (attacked) {
      isAttacking = true;
      if (newHealth <= 0) {
        opponents.splice(targetIndex, 1); // Remove the unit if its health drops to 0 or less
      } else {
        opponents[targetIndex].health = newHealth; // Update the unit's health if it's still alive
      }
      // Update the game state with the new unit data
      updateGameState(prevState => {
        const updatedActiveUnits = prevState.activeUnits.map(u => u.id === target.id ? { ...u, health: newHealth } : u);
        const updatedEnemyUnits = prevState.enemyUnits.map(u => u.id === unit.id ? { ...u, isAttacking: true } : u);
        return {
          ...prevState,
          activeUnits: updatedActiveUnits,
          enemyUnits: updatedEnemyUnits,
        };
      });
    }
  }

  const moveDirection = unit.isEnemy ? -5 : 5;
  const newPosition = unit.position + moveDirection;

  const isBlocked = allies.some(ally => Math.abs(ally.position - newPosition) < 40 && ally.id !== unit.id)
    || opponents.some(opponent => Math.abs(opponent.position - newPosition) < 40);

  if (!isBlocked && !isAttacking) {
    // Move if not blocked and not attacking
    return { ...unit, position: newPosition, isAttacking: false };
  }

  // The unit stands still if the path is blocked or it is attacking
  return { ...unit, isAttacking };
}

const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  // Inside BattlefieldComponent component
useEffect(() => {
  const combatInterval = setInterval(() => {
    const currentTime = Date.now();
    
    // Process logic for all units
    const updatedActiveUnits = gameState.activeUnits.map(unit => 
      updateUnitPositionAndAttack(unit, gameState.enemyUnits, gameState.activeUnits, currentTime, updateGameState)
    ).filter(unit => unit !== null) as Unit[]; // Remove null values and cast

    const updatedEnemyUnits = gameState.enemyUnits.map(unit => 
      updateUnitPositionAndAttack(unit, gameState.activeUnits, gameState.enemyUnits, currentTime, updateGameState)
    ).filter(unit => unit !== null) as Unit[]; // Remove null values and cast

    // Now you can update the overall game state with the newly updated units
    updateGameState(prevState => ({
      ...prevState,
      activeUnits: updatedActiveUnits,
      enemyUnits: updatedEnemyUnits,
    }));
  }, 100);

  return () => clearInterval(combatInterval);
}, [gameState, updateGameState]);

  return (
    <div className="battlefield">
      {gameState.activeUnits.map((unit) => (
        <UnitComponent 
          key={unit.id} 
          unit={unit} 
          isEnemy={unit.isEnemy} 
          isAttacking={unit.isAttacking || false} // Zde zajištěno, že bude vždy boolean
        />
      ))}
      {gameState.enemyUnits.map((unit) => (
        <UnitComponent 
          key={unit.id} 
          unit={unit} 
          isEnemy={unit.isEnemy} 
          isAttacking={unit.isAttacking || false} // Zde zajištěno, že bude vždy boolean
        />
      ))}
    </div>
  );
};
export default BattlefieldComponent;
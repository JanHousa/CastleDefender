import React, { useEffect } from 'react';
import { GameState, Unit, DefenseTower } from '../types'; // Předpokládejme definici typů
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
): Unit {
  const targetIndex = opponents.findIndex(opponent => Math.abs(unit.position - opponent.position) <= unit.range);

  if (targetIndex !== -1) {
    const target = opponents[targetIndex];
    const { attacked, newHealth } = fight(unit, target, currentTime);

    if (attacked) {
      if (newHealth <= 0) {
        opponents.splice(targetIndex, 1); // Odstraňujeme jednotku, pokud její zdraví klesne na 0 nebo méně
      } else {
        opponents[targetIndex].health = newHealth; // Aktualizujeme zdraví jednotky, pokud je stále živá
      }
      // Požádáme o aktualizaci stavu hry s novými daty o jednotkách
      updateGameState({ activeUnits: [...opponents], enemyUnits: [...allies] });
      return { ...unit, isAttacking: true };
    }
  }

  const moveDirection = unit.isEnemy ? -5 : 3;
  const newPosition = unit.position + moveDirection;

  const isBlocked = allies.some(ally => Math.abs(ally.position - newPosition) < 50 && ally.id !== unit.id)
    || opponents.some(opponent => Math.abs(opponent.position - newPosition) < 50);

  if (!isBlocked) {
    return { ...unit, position: newPosition, isAttacking: false };
  }

  return { ...unit, isAttacking: false };
}

function attackWithTowers(towers: DefenseTower[], enemyUnits: Unit[], currentTime: number): Unit[] {
  // Copy the enemy units to avoid direct state mutation
  const updatedEnemyUnits = [...enemyUnits];

  towers.forEach(tower => {
    // Find the closest enemy unit within range
    const targetIndex = updatedEnemyUnits.findIndex(
      enemy => Math.abs(tower.position - enemy.position) <= tower.range
    );

    if (targetIndex !== -1) {
      const target = updatedEnemyUnits[targetIndex];
      const newHealth = target.health - tower.attack;
      target.health = Math.max(0, newHealth); // Ensure health is not negative

      if (target.health <= 0) {
        // Remove the enemy unit if its health drops to 0 or below
        updatedEnemyUnits.splice(targetIndex, 1);
      }
    }
  });

  return updatedEnemyUnits;
}

const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const combatInterval = setInterval(() => {
      const currentTime = Date.now();
  
      // First, let the towers attack
      const enemyUnitsAfterTowerAttack = attackWithTowers(gameState.defenseTowers, gameState.enemyUnits, currentTime);
  
      let activeUnitsUpdated = gameState.activeUnits
        .map(unit => updateUnitPositionAndAttack(unit, enemyUnitsAfterTowerAttack, gameState.activeUnits, currentTime, updateGameState))
        .filter((unit): unit is Unit => unit !== null);
  
      let enemyUnitsUpdated = enemyUnitsAfterTowerAttack
        .map(unit => updateUnitPositionAndAttack(unit, activeUnitsUpdated, gameState.enemyUnits, currentTime, updateGameState))
        .filter((unit): unit is Unit => unit !== null);
  
      // Update the game state with new units and potentially fewer enemy units after tower attacks
      updateGameState(prevState => ({
        ...prevState,
        activeUnits: activeUnitsUpdated,
        enemyUnits: enemyUnitsUpdated,
      }));
    }, 100);
  
    return () => clearInterval(combatInterval);
  }, [gameState, updateGameState]);

  return (
    <div className="battlefield">
      {gameState.activeUnits.map((unit) => (
        <UnitComponent key={unit.id} unit={unit} isEnemy={false} isAttacking={unit.isAttacking || false} />
      ))}
      {gameState.enemyUnits.map((unit) => (
        <UnitComponent key={unit.id} unit={unit} isEnemy={true} isAttacking={unit.isAttacking || false} />
      ))}
    </div>
  );
};

export default BattlefieldComponent;


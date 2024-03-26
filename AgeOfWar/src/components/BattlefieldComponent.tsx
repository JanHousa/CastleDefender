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

  const moveDirection = unit.isEnemy ? -5 : 5;
  const newPosition = unit.position + moveDirection;

  const isBlocked = allies.some(ally => Math.abs(ally.position - newPosition) < 100 && ally.id !== unit.id)
    || opponents.some(opponent => Math.abs(opponent.position - newPosition) < 100);

  if (!isBlocked) {
    return { ...unit, position: newPosition, isAttacking: false };
  }

  return { ...unit, isAttacking: false };
}


const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const combatInterval = setInterval(() => {
      const currentTime = Date.now();
  
      let activeUnitsUpdated = gameState.activeUnits
        .map(unit => updateUnitPositionAndAttack(unit, gameState.enemyUnits, gameState.activeUnits, currentTime))
        .filter((unit): unit is Unit => unit !== null);
  
      let enemyUnitsUpdated = gameState.enemyUnits
        .map(unit => updateUnitPositionAndAttack(unit, gameState.activeUnits, gameState.enemyUnits, currentTime))
        .filter((unit): unit is Unit => unit !== null);
  
      // Aktualizace globálního stavu hry s novými poli jednotek
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


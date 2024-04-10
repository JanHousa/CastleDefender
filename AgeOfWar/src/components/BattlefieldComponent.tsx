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
    console.log(`${unit.id} attacked ${target.id}, new health: ${newHealth}`); // Debug log
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
  const targetIndex = opponents.findIndex(opponent => Math.abs(unit.position - opponent.position) <= unit.range);

  if (targetIndex !== -1) {
    // Nepřítel je v dosahu útoku
    const target = opponents[targetIndex];
    const { attacked, newHealth } = fight(unit, target, currentTime);

    if (attacked) {
      // Útok proběhl
      if (newHealth <= 0) {
        // Nepřítel byl zabit
        console.log(`${unit.id} killed ${target.id}`); // Debug log
        opponents.splice(targetIndex, 1);
      } else {
        // Nepřítel přežil, aktualizujeme jeho zdraví
        opponents[targetIndex].health = newHealth;
      }

      // V tomto případě udržujeme isAttacking na true, protože jednotka je stále v boji
      return { ...unit, isAttacking: true };
    } else {
      // Pokud jednotka nemůže útočit kvůli cooldownu, stále je v bojovém stavu
      return { ...unit, isAttacking: true };
    }
  } else {
    // Nepřítel není v dosahu, jednotka se může pohnout
    const moveDirection = unit.isEnemy ? -5 : 5;
    const newPosition = unit.position + moveDirection;
    const isBlocked = allies.some(ally => Math.abs(ally.position - newPosition) < 40 && ally.id !== unit.id)
                      || opponents.some(opponent => Math.abs(opponent.position - newPosition) < 40);

    if (!isBlocked) {
      // Pokud není blokována, jednotka se pohne a ukončí bojový stav
      console.log(`${unit.id} moved to ${newPosition}`); // Debug log
      return { ...unit, position: newPosition, isAttacking: false };
    }
  }

  // Pokud je cesta blokovaná, necháme jednotku stát na místě
  return { ...unit, isAttacking: false };
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
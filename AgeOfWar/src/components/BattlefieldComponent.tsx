import React, { useEffect } from 'react';
import { GameState, Unit } from '../types'; 
import UnitComponent from './UnitComponent';
import attackSound from '/src/assets/music/damage.mp3'; 

interface BattlefieldProps {
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => Partial<GameState>) => void;
}

function fight(unit: Unit, target: Unit, currentTime: number): { attacked: boolean; newHealth: number } {
  if (currentTime - unit.lastAttackTime >= unit.attackSpeed) {
    const newHealth = target.health - unit.attack;
    unit.lastAttackTime = currentTime;

    const sound = new Audio(attackSound);
    sound.play();

    return { attacked: true, newHealth: Math.max(0, newHealth) };
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
    const target = opponents[targetIndex];
    const { attacked, newHealth } = fight(unit, target, currentTime);

    if (attacked) {
      if (newHealth <= 0) {
        opponents.splice(targetIndex, 1);
      } else {
        opponents[targetIndex].health = newHealth; 
      }
      return { ...unit, isAttacking: true };
    } else {
      return { ...unit, isAttacking: true };
    }
  } else {
    const moveDirection = unit.isEnemy ? -5 : 5;
    const newPosition = unit.position + moveDirection;
    const isBlocked = allies.some(ally => Math.abs(ally.position - newPosition) < 40 && ally.id !== unit.id)
                      || opponents.some(opponent => Math.abs(opponent.position - newPosition) < 40);

    if (!isBlocked) {
      return { ...unit, position: newPosition, isAttacking: false };
    }
  }
  return { ...unit, isAttacking: false };
}

const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const combatInterval = setInterval(() => {
      const currentTime = Date.now();
      
      const updatedActiveUnits = gameState.activeUnits.map(unit => 
        updateUnitPositionAndAttack(unit, gameState.enemyUnits, gameState.activeUnits, currentTime, updateGameState)
      ).filter(unit => unit !== null) as Unit[];

      const updatedEnemyUnits = gameState.enemyUnits.map(unit => 
        updateUnitPositionAndAttack(unit, gameState.activeUnits, gameState.enemyUnits, currentTime, updateGameState)
      ).filter(unit => unit !== null) as Unit[];

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
          isAttacking={unit.isAttacking || false}
        />
      ))}
      {gameState.enemyUnits.map((unit) => (
        <UnitComponent 
          key={unit.id} 
          unit={unit} 
          isEnemy={unit.isEnemy} 
          isAttacking={unit.isAttacking || false}
        />  
      ))}
    </div>
  );
};

export default BattlefieldComponent;
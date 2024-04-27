import React, { useEffect } from 'react';
import { GameState, Unit } from '../types';
import UnitComponent from './UnitComponent';
import attackSound from '/src/assets/music/damage.mp3';
import { TowerComponentProps } from './TowerComponent';

interface BattlefieldProps {
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => GameState) => void;
}

interface Attackable {
  health: number;
  position: number;
  lastAttackTime: number; // Might not be necessary for tower but included for consistency
  attackSpeed: number; // Might not be necessary for tower but included for consistency
}


function fight(unit: Unit, target: Attackable, currentTime: number): { attacked: boolean, newHealth: number } {
  if (currentTime - unit.lastAttackTime >= unit.attackSpeed) {
    unit.lastAttackTime = currentTime;
    const newHealth = target.health - unit.attack;
    const sound = new Audio(attackSound);
    sound.play();
    return { attacked: true, newHealth: Math.max(0, newHealth) };
  }
  return { attacked: false, newHealth: target.health };
}

function updateUnits(units: Unit[], opponents: Unit[], towers: { playerTower: TowerComponentProps, enemyTower: TowerComponentProps }, currentTime: number, isEnemy: boolean): { updatedUnits: Unit[], updatedOpponents: Unit[], updatedTowers: { playerTower: TowerComponentProps, enemyTower: TowerComponentProps } } {
  let newUnits = [...units];
  let newOpponents = [...opponents];

  let targetTower = isEnemy ? towers.playerTower : towers.enemyTower;

  units.forEach((unit, index) => {
    // First try to find an opponent unit within range
    const targetIndex = newOpponents.findIndex(opponent => Math.abs(unit.position - opponent.position) <= unit.range);
    if (targetIndex !== -1) {
      const target = newOpponents[targetIndex];
      const { attacked, newHealth } = fight(unit, target, currentTime);
      if (attacked) {
        if (newHealth <= 0) {
          newOpponents.splice(targetIndex, 1); // Remove dead opponent
        } else {
          newOpponents[targetIndex].health = newHealth; // Update opponent's health
        }
        newUnits[index].isAttacking = true;
      }
    } else if (Math.abs(unit.position - targetTower.position) <= unit.range) {
      // No opponent within range, but tower is within range
      const { attacked, newHealth } = fight(unit, { health: targetTower.health, position: targetTower.position, attackSpeed: 999999, lastAttackTime: 0 }, currentTime);
      if (attacked) {
        targetTower.health = newHealth;
        newUnits[index].isAttacking = true;
      }
    } else {
      // Move if no target is in range
      const moveDirection = isEnemy ? -5 : 5;
      const newPosition = unit.position + moveDirection;
      const isBlocked = newUnits.some(ally => Math.abs(ally.position - newPosition) < 40 && ally.id !== unit.id) || newOpponents.some(opponent => Math.abs(opponent.position - newPosition) < 40);

      if (!isBlocked) {
        newUnits[index].position = newPosition; // Update unit's position
        newUnits[index].isAttacking = false;
      }
    }
  });

  return { updatedUnits: newUnits, updatedOpponents: newOpponents, updatedTowers: { playerTower: towers.playerTower, enemyTower: towers.enemyTower } };
}


const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const combatInterval = setInterval(() => {
      const currentTime = Date.now();

      const towers = { playerTower: gameState.playerTower, enemyTower: gameState.enemyTower };

      const { updatedUnits: updatedEnemyUnits, updatedOpponents: updatedPlayerUnits } = updateUnits(gameState.enemyUnits, gameState.playerUnits, towers, currentTime, true);
      const { updatedUnits: newUpdatedPlayerUnits, updatedOpponents: newUpdatedEnemyUnits } = updateUnits(updatedPlayerUnits, updatedEnemyUnits, towers, currentTime, false);

      updateGameState(prevState => ({
        ...prevState,
        playerUnits: newUpdatedPlayerUnits,
        enemyUnits: newUpdatedEnemyUnits,
        playerTower: towers.playerTower, // Ensure you handle updates properly if tower health changes
        enemyTower: towers.enemyTower,
      }));
    }, 100);

    return () => clearInterval(combatInterval);
  }, [gameState, updateGameState]);

  return (
    <div className="battlefield">
      {gameState.playerUnits.map(unit => (
        <UnitComponent key={unit.id} unit={unit} isEnemy={false} isAttacking={unit.isAttacking || false} />
      ))}
      {gameState.enemyUnits.map(unit => (
        <UnitComponent key={unit.id} unit={unit} isEnemy={true} isAttacking={unit.isAttacking || false} />
      ))}
    </div>
  );
};

export default BattlefieldComponent;


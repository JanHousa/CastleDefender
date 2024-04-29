import React, { useEffect, useState } from 'react';
import { GameState, Unit } from '../types';
import UnitComponent from './UnitComponent';
import attackSound from '/src/assets/music/damage.mp3';
import { TowerComponentProps } from './TowerComponent';
import { DefenseTower } from '../types';
import Effect from './Effect'; // Import the Effect component
import cannonSound from '/src/assets/music/cannon.mp3';

interface BattlefieldProps {
  gameState: GameState;
  updateGameState: (updateFunction: (prevState: GameState) => GameState) => void;
}

interface Attackable {
  health: number;
  position: number;
  lastAttackTime: number;
  attackSpeed: number;
}

interface EffectDetail {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
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

function updateUnits(units: Unit[], opponents: Unit[], towers: { playerTower: TowerComponentProps, enemyTower: TowerComponentProps }, currentTime: number, isEnemy: boolean, gameState: GameState): { updatedUnits: Unit[], updatedOpponents: Unit[], updatedTowers: { playerTower: TowerComponentProps, enemyTower: TowerComponentProps }, updatedGameState: GameState } {
  let newUnits = [...units];
  let newOpponents = [...opponents];
  let newGameState = { ...gameState };

  let targetTower = isEnemy ? towers.playerTower : towers.enemyTower;

  units.forEach((unit, index) => {
    const targetIndex = newOpponents.findIndex(opponent => Math.abs(unit.position - opponent.position) <= unit.range);
    if (targetIndex !== -1) {
      const target = newOpponents[targetIndex];
      const { attacked, newHealth } = fight(unit, target, currentTime);
      if (attacked) {
        if (newHealth <= 0) {
          newOpponents.splice(targetIndex, 1);
          if (!isEnemy) {
            newGameState.gold += Number(target.goldValue); // Use the target's gold value
          }
        } else {
          newOpponents[targetIndex].health = newHealth;
        }
        newUnits[index].isAttacking = true;
      }
    } else if (Math.abs(unit.position - targetTower.position) <= unit.range) {
      const { attacked, newHealth } = fight(unit, { health: targetTower.health, position: targetTower.position, attackSpeed: 999999, lastAttackTime: 0 }, currentTime);
      if (attacked) {
        targetTower.health = newHealth;
        newUnits[index].isAttacking = true;
      }
    } else {
      const moveDirection = isEnemy ? -5 : 5;
      const newPosition = unit.position + moveDirection;
      const isBlocked = newUnits.some(ally => Math.abs(ally.position - newPosition) < 40 && ally.id !== unit.id) || newOpponents.some(opponent => Math.abs(opponent.position - newPosition) < 40);

      if (!isBlocked) {
        newUnits[index].position = newPosition;
        newUnits[index].isAttacking = false;
      }
    }
  });

  return { updatedUnits: newUnits, updatedOpponents: newOpponents, updatedTowers: { playerTower: towers.playerTower, enemyTower: towers.enemyTower }, updatedGameState: newGameState };
}

function attackWithTowers(towers: DefenseTower[], units: Unit[], currentTime: number, effects: EffectDetail[], gameState: GameState): Unit[] {
  return units.map(unit => {
    towers.forEach(tower => {
      if (Math.abs(tower.position - unit.position) <= tower.range && currentTime - tower.lastAttackTime >= tower.attackSpeed) {
        const attackDamage = tower.attack;
    
        effects.push({
          startX: 260,
          startY: 530,
          endX: unit.position + 20,
          endY: 750
        });
    
        const sound = new Audio(cannonSound);
        sound.play();
    
        setTimeout(() => {
          unit.health -= attackDamage;
          if (unit.health <= 0) {
            gameState.gold += unit.goldValue; // Award gold based on the killed unit's value
          }
        }, 800);
    
        tower.lastAttackTime = currentTime;
      }
    });
    
    return unit;
  }).filter(unit => unit.health > 0);
}




const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  const [effects, setEffects] = useState<EffectDetail[]>([]);

  useEffect(() => {
    const combatInterval = setInterval(() => {
      const currentTime = Date.now();
      let newEffects: EffectDetail[] = [];

      // Towers attack enemy units first, creating effects
      let updatedEnemyUnits = attackWithTowers(gameState.defenseTowers, gameState.enemyUnits, currentTime, newEffects, gameState);

      // Then update units' interactions
      const { updatedUnits: newUpdatedEnemyUnits1, updatedOpponents: updatedPlayerUnits, updatedGameState } = updateUnits(updatedEnemyUnits, gameState.playerUnits, { playerTower: gameState.playerTower, enemyTower: gameState.enemyTower }, currentTime, true, gameState);
      const { updatedUnits: newUpdatedPlayerUnits, updatedOpponents: newUpdatedEnemyUnits2, updatedGameState: newUpdatedGameState } = updateUnits(updatedPlayerUnits, newUpdatedEnemyUnits1, { playerTower: gameState.playerTower, enemyTower: gameState.enemyTower }, currentTime, false, updatedGameState);

      // Update effects to trigger animations
      setEffects(prev => [...prev, ...newEffects]);

      // Clean up old effects after 1 second
      setTimeout(() => {
        setEffects(prev => prev.slice(newEffects.length));
      }, 1000);

      updateGameState(prevState => ({
        ...prevState,
        playerUnits: newUpdatedPlayerUnits,
        enemyUnits: newUpdatedEnemyUnits2,
        defenseTowers: prevState.defenseTowers,
        playerTower: gameState.playerTower,
        enemyTower: gameState.enemyTower,
        gold: newUpdatedGameState.gold,
      }));
    }, 100);

    return () => {
      clearInterval(combatInterval);
    };
  }, [gameState, updateGameState]);

  return (
    <div className="battlefield">
      {effects.map((effect, index) => (
        <Effect key={index} startX={effect.startX} startY={effect.startY} endX={effect.endX} endY={effect.endY} />
      ))}
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

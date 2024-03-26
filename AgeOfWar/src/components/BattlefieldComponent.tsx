import React, { useEffect } from 'react';
import { GameState, Unit } from '../types'; // Předpokládejme definici typů
import UnitComponent from './UnitComponent';

interface BattlefieldProps {
  gameState: GameState;
  updateGameState: (newStateOrUpdater: GameState | ((prevState: GameState) => GameState | Partial<GameState>)) => void;
}

const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const combatInterval = setInterval(() => {
      // Aktualizace pozic a stavu útoku jednotek
      let activeUnitsUpdated = gameState.activeUnits.map(unit =>
        // Předání spojeneckých jednotek pro aktivní jednotky
        updateUnitPositionAndAttack(unit, gameState.enemyUnits, gameState.activeUnits)
      );

      let enemyUnitsUpdated = gameState.enemyUnits.map(unit =>
        // Předání spojeneckých jednotek pro nepřátelské jednotky
        updateUnitPositionAndAttack(unit, gameState.activeUnits, gameState.enemyUnits)
      );

      // Odstranění jednotek s nulovým nebo záporným zdravím
      activeUnitsUpdated = activeUnitsUpdated.filter(unit => unit.health > 0);
      enemyUnitsUpdated = enemyUnitsUpdated.filter(unit => unit.health > 0);

      // Aktualizace hry
      updateGameState({
        ...gameState,
        activeUnits: activeUnitsUpdated,
        enemyUnits: enemyUnitsUpdated,
      });
    }, 100); // Interval aktualizace

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



// Funkce pro boj mezi jednotkami
function fight(unit: Unit, target: Unit): boolean {
  target.health -= unit.attack;
  if (target.health <= 0) {
    return true;
  }
  return false;
}

// Funkce pro aktualizaci pozice a útok jednotek
function updateUnitPositionAndAttack(unit: Unit, opponents: Unit[], allies: Unit[]): Unit {
  const target = opponents.find(opponent => Math.abs(unit.position - opponent.position) <= unit.range);

  if (target) {
    const isKilled = fight(unit, target);
    if (isKilled) {
      const index = opponents.indexOf(target);
      if (index !== -1) {
        opponents.splice(index, 1);
      }
      const newPosition = unit.position + (unit.isEnemy ? -5 : 5);
      return { ...unit, position: newPosition, isAttacking: false };
    }
    return { ...unit, isAttacking: true };
  } else {
    const moveDirection = unit.isEnemy ? -1 : 1;
    const newPosition = unit.position + moveDirection * (5 || 5); // Předpokládáme výchozí rychlost pohybu 5, pokud není specifikováno
    return { ...unit, position: newPosition, isAttacking: false };
  }
}
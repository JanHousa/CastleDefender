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
      let activeUnitsUpdated = gameState.activeUnits.map(unit => {
        // Výpočet pohybu nebo útoku pro každou aktivní jednotku
        return updateUnitPositionAndAttack(unit, gameState.enemyUnits);
      });

      let enemyUnitsUpdated = gameState.enemyUnits.map(unit => {
        // Výpočet pohybu nebo útoku pro každou nepřátelskou jednotku
        return updateUnitPositionAndAttack(unit, gameState.activeUnits);
      });

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

function updateUnitPositionAndAttack(unit: Unit, opponents: Unit[]): Unit {
  const target = opponents.find(opponent => Math.abs(unit.position - opponent.position) <= unit.range);

  if (target) {
    // Útok (poznámka: aktualizace health by měla proběhnout globálně, ne zde)
    return { ...unit, isAttacking: true };
  } else {
    // Enemy units (isEnemy == true) jdou doleva (-5), přátelské jednotky jdou doprava (+5)
    const newPosition = unit.position + (unit.isEnemy ? -5 : 5); 
    return { ...unit, position: newPosition, isAttacking: false };
  }
}

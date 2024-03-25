import React, { useEffect } from 'react';
import { GameState, Unit } from '../types';
import UnitComponent from './UnitComponent';

interface BattlefieldProps {
  gameState: GameState;
  // Toto musí být konzistentní s definicí v UnitComponent
  updateGameState: (updateFunction: (prevGameState: GameState) => Partial<GameState>) => void;
}


const BattlefieldComponent: React.FC<BattlefieldProps> = ({ gameState, updateGameState }) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateGameState(prevGameState => {
        const newActiveUnits = prevGameState.activeUnits.map(unit => {
          // Vyhledávání nepřátelské jednotky v dosahu útoku
          const enemyInRange = prevGameState.enemyUnits.find(enemyUnit =>
            Math.abs(enemyUnit.position - unit.position) <= unit.range);

          // Pokud je nepřítel v dosahu, nastavíme "isAttacking" na true
          if (enemyInRange) {
            return { ...unit, isAttacking: true };
          } else {
            // Jinak se jednotka pohybuje (pokud již neútočí)
            const newPosition = !unit.isAttacking ? unit.position + 5 : unit.position;
            return { ...unit, position: newPosition, isAttacking: false };
          }
        });

        const newEnemyUnits = prevGameState.enemyUnits.map(unit => {
          // Analogická logika pro nepřátelské jednotky
          const activeUnitInRange = prevGameState.activeUnits.find(activeUnit =>
            Math.abs(activeUnit.position - unit.position) <= unit.range);
          
          if (activeUnitInRange) {
            return { ...unit, isAttacking: true };
          } else {
            const newPosition = !unit.isAttacking ? unit.position - 5 : unit.position;
            return { ...unit, position: newPosition, isAttacking: false };
          }
        });

        return { activeUnits: newActiveUnits, enemyUnits: newEnemyUnits };
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [updateGameState]);
  

  return (
    <div className="battlefield">
      {gameState.activeUnits.map((unit) => (
        <UnitComponent
        key={unit.id}
        unit={unit}
        updateGameState={updateGameState}
        isEnemy={false}
        isAttacking={!!unit.isAttacking} // Převádí undefined na false
      />
      ))}
      {gameState.enemyUnits.map((unit) => (
       <UnitComponent
       key={unit.id}
       unit={unit}
       updateGameState={updateGameState}
       isEnemy={true}
       isAttacking={!!unit.isAttacking} // Převádí undefined na false
     />
      ))}
    </div>
  );
};

export default BattlefieldComponent;

// UnitComponent.tsx
import React from 'react';
import { Unit, GameState } from '../types';

interface UnitProps {
  unit: Unit;
  // Tato definice musí být konzistentní s použitím v BattlefieldComponent
  updateGameState: (updateFunction: (prevGameState: GameState) => Partial<GameState>) => void;
  isEnemy: boolean;
  isAttacking: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, updateGameState, isEnemy, isAttacking }) => {
  // Implementace komponenty...
  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''} ${isAttacking ? 'attacking' : ''}`} style={{ left: `${unit.position}px` }}>
      <img src={unit.imageUrl} alt={unit.type} />
      {/* Další vizuální prvky a logika */}
    </div>
  );
};

export default UnitComponent;

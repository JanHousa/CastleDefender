import React from 'react';
import { Unit, GameState } from '../types';

interface UnitProps {
  unit: Unit;
  updateGameState: (newState: GameState) => void;
  isEnemy?: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, updateGameState, isEnemy = false }) => {
  // Zde by byla implementována logika pro pohyb a útok jednotek

  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''}`} style={{ left: `${unit.position}px` }}>
      <img src={unit.imageUrl} alt={unit.type} />
      {/* Další vizuální prvky jednotky */}
    </div>
  );
};

export default UnitComponent;

import React from 'react';
import { Unit } from '../types'; // Předpokládáme definici typů

interface UnitProps {
  unit: Unit;
  isEnemy: boolean;
  isAttacking: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, isEnemy, isAttacking }) => {
  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''} ${isAttacking ? 'attacking' : ''}`} style={{ left: `${unit.position}px` }}>
      <img src={unit.imageUrl} alt={unit.type} />
    </div>
  );
};

export default UnitComponent;


import React from 'react';
import { Unit } from '../types';

interface UnitCardProps {
  unit: Unit;
  onBuy: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onBuy }) => {
  return (
    <div className="unit-card" onClick={onBuy}>
      <img src={unit.imageUrl} alt={unit.type} style={{ width: '100%', height: '100%' }} />
      <div className="unit-info">
        <h3>{unit.type}</h3>
        <p>Health: {unit.health}</p>
        <p>Attack: {unit.attack}</p>
        <p>Cost: {unit.cost}</p>
      </div>
    </div>
  );
};

export default UnitCard;

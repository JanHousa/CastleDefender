import React from 'react';
import { Unit } from '../types'; // Import interface Unit

interface UnitsListProps {
  units: Unit[];
  onUnitClick: (unit: Unit) => void; // Callback pro kliknutí na jednotku
}

const UnitsList: React.FC<UnitsListProps> = ({ units, onUnitClick }) => {
  return (
    <div className="units-list">
      {units.map((unit) => (
        <div key={unit.id} className="unit-card" onClick={() => onUnitClick(unit)}>
          <img src={unit.imageUrl} alt={unit.type} />
          <div>
            <h4>{unit.type}</h4>
            <p>Health: {unit.health}</p>
            <p>Attack: {unit.attack}</p>
            {unit.attackType === 'range' && <p>Range: {unit.range}</p>}
            <p>Cost: {unit.cost}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnitsList;

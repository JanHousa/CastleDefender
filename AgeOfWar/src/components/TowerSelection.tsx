import React from 'react';
import { DefenseTower } from '../types';

interface TowerSelectionComponentProps {
  towers: DefenseTower[];
  onTowerSelected: (tower: DefenseTower | 'sell', slotId: number) => void;
  currentTower?: DefenseTower;
  slotId: number;
}

const TowerSelectionComponent = ({
  towers,
  onTowerSelected,
  currentTower,
  slotId,
}: TowerSelectionComponentProps) => {
  return (
    <div className="tower-selection-menu">
      {currentTower ? (
        <div
          className="tower-option sell"
          onClick={() => onTowerSelected('sell', slotId)}
        >
          <div className="cost-overlay">
          <div className='gold-icon'></div>
          <span>Sell {Math.round(currentTower.cost * 0.5)}</span>
          </div>
        </div>
      ) : (
        towers.map((tower) => (
          <div
            key={tower.id}
            className="tower-option"
            onClick={() => onTowerSelected(tower, slotId)}
          >
            <img src={tower.imageUrl} alt={tower.type} />
            <div className="cost-overlay">
              <div className='gold-icon'></div>
              <span>{tower.cost}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TowerSelectionComponent;

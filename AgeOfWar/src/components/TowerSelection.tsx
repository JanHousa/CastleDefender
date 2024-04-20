
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
          Sell {currentTower.type} for {Math.round(currentTower.cost * 0.5)} Gold
        </div>
      ) : (
        towers.map((tower) => (
          <div
            key={tower.id}
            className="tower-option"
            onClick={() => onTowerSelected(tower, slotId)} 
          >
            <p>{tower.type}</p>
            <p>Cost: {tower.cost} Gold</p>
          </div>
        ))
      )}
    </div>
  );
};


export default TowerSelectionComponent;

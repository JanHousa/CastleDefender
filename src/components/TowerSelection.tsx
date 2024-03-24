// TowerSelectionComponent.tsx
import React from 'react';
import { DefenseTower } from '../types'; // Předpokládáme import typů

interface TowerSelectionComponentProps {
  towers: DefenseTower[];
  onTowerSelected: (tower: DefenseTower | 'sell', slotId: number) => void;
  currentTower?: DefenseTower; // Optional current tower
  slotId: number; // Add slotId here
}


const TowerSelectionComponent = ({
  towers,
  onTowerSelected,
  currentTower,
  slotId, // Include slotId in the component parameters
}: TowerSelectionComponentProps) => {
  return (
    <div className="tower-selection-menu">
      {currentTower ? (
        <div
          className="tower-option sell"
          onClick={() => onTowerSelected('sell', slotId)} // Pass slotId here
        >
          Sell {currentTower.type} for {Math.round(currentTower.cost * 0.5)} Gold
        </div>
      ) : (
        towers.map((tower) => (
          <div
            key={tower.id}
            className="tower-option"
            onClick={() => onTowerSelected(tower, slotId)} // Pass slotId here
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

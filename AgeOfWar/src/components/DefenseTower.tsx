import React from 'react';
import { DefenseTower } from '../types'; // Ensure this import path is correct

interface DefenseTowerProps {
  tower: DefenseTower;
}

const DefenseTowerComponent: React.FC<DefenseTowerProps> = ({ tower }) => {
  return (
    <div className="defense-tower">
      {tower.imageUrl ? (
        // Ensure the image fits within the slot. You might need to adjust the styles further.
        <img src={tower.imageUrl} alt={tower.type} style={{ width: '100%', height: 'auto' }} />
      ) : (
        // A default placeholder in case there's no image URL
        <div style={{ width: '100%', height: '100%', backgroundColor: 'red' }}></div>
      )}
    </div>
  );
};


export default DefenseTowerComponent;

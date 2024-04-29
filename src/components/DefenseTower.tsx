import React from 'react';
import { DefenseTower } from '../types'; 

interface DefenseTowerProps {
  tower: DefenseTower;
}

const DefenseTowerComponent: React.FC<DefenseTowerProps> = ({ tower }) => {
  return (
    <div className="defense-tower">
      {tower.imageUrl ? (

        <img src={tower.imageUrl} alt={tower.type} style={{ width: '100%', height: 'auto' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'red' }}></div>
      )}
    </div>
  );
};


export default DefenseTowerComponent;

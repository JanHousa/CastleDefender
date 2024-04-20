import React from 'react';
import { DefenseTower } from '../types'; 
import DefenseTowerComponent from './DefenseTower'; 

interface DefenseSlotProps {
  slotId: number;
  tower?: DefenseTower;
  onSlotClick: (slotId: number) => void;
}

const DefenseSlot: React.FC<DefenseSlotProps> = ({ slotId, tower, onSlotClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSlotClick(slotId);
  };

  return (
    <div className="defense-slot" onClick={handleClick}>
      {tower ? (
        <DefenseTowerComponent tower={tower} />
      ) : (

        <div style={{ width: '100%', height: '100%', backgroundColor: 'lightgrey' }}></div>
      )}
    </div>
  );
};

export default DefenseSlot;

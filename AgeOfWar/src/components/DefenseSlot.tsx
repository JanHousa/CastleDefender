import React from 'react';
import { DefenseTower } from '../types'; // Ensure this import path is correct
import DefenseTowerComponent from './DefenseTower'; // Adjust the import path as necessary

interface DefenseSlotProps {
  slotId: number;
  tower?: DefenseTower;
  onSlotClick: (slotId: number) => void;
}

const DefenseSlot: React.FC<DefenseSlotProps> = ({ slotId, tower, onSlotClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent event from bubbling to prevent unwanted click handling
    onSlotClick(slotId);
  };

  return (
    <div className="defense-slot" onClick={handleClick}>
      {tower ? (
        // Here, we ensure the tower component or its representation is nested within the slot.
        // This makes it part of the slot's content, aligning with your requirement.
        <DefenseTowerComponent tower={tower} />
      ) : (
        // Placeholder or a visual cue for an empty slot
        <div style={{ width: '100%', height: '100%', backgroundColor: 'lightgrey' }}></div>
      )}
    </div>
  );
};

export default DefenseSlot;

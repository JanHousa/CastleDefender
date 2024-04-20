import React from 'react';
import { Effect } from '../types'; 

interface EffectComponentProps {
  effect: Effect;
}

const EffectComponent: React.FC<EffectComponentProps> = ({ effect }) => {

    const style = {
        left: `${effect.currentPosition.x}px`,
        top: `${effect.currentPosition.y}px`,
        position: 'absolute' as const,
        width: '10px',
        height: '2px',
        backgroundColor: 'black',
        transform: 'rotate(-45deg)', 
    };

    return <div style={style}></div>;
};

export default EffectComponent;

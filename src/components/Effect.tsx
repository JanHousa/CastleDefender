
import React from 'react';
import './Game.css'; 

interface EffectProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }
  
  const Effect: React.FC<EffectProps> = ({ startX, startY, endX, endY }) => {

    const translateX = endX - startX;
    const translateY = endY - startY;
  
  
    const style = {
      left: `${startX}px`, 
      top: `${startY}px`,
      '--translateX': `${translateX}px`, 
      '--translateY': `${translateY}px` 
    } as React.CSSProperties;
  
    return <div className="effect" style={style}></div>;
  };
  
  export default Effect;
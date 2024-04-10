import React, { useState, useEffect } from 'react';
import { Unit } from '../types'; // Předpokládejme definici typů

interface UnitProps {
  unit: Unit;
  isEnemy: boolean;
  isAttacking: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, isEnemy, isAttacking }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Předpokládáme, že máte animace uložené ve složce `public/animations/[unitType]/[action]/[frameIndex].png`
  const actionType = isAttacking ? 'attack' : 'walk';
  const maxHealth = 100; // Nahradit skutečným maximálním zdravím
  const healthPercentage = (unit.health / maxHealth) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(frame => (frame + 1) % 10); // Cyklus přes 10 snímků, 0 až 9
      console.log(isAttacking);
    }, 100); // Změňte rychlost podle potřeby

    return () => clearInterval(interval);
  }, [isAttacking]); // Změna intervalu při změně stavu útoku

  const imageSrc = `/src/assets/images/animations/${unit.type}/${actionType}/${animationFrame}.png`;

  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''} ${isAttacking ? 'attacking' : ''}`} style={{ left: `${unit.position}px` }}>
      <div className="hp-bar-container">
        <div className="hp-bar" style={{ width: `${healthPercentage}%` }}></div>
      </div>
      <div className="unit-image">
      <img src={imageSrc} alt={`${unit.type} ${actionType}`} draggable="false"/>
      </div>
    </div>
  );
};

export default UnitComponent;

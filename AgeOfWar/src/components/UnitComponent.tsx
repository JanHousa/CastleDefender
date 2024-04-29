import React, { useState, useEffect } from 'react';
import { Unit } from '../types'; // Předpokládejme definici typů

interface UnitProps {
  unit: Unit;
  isEnemy: boolean;
  isAttacking: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, isEnemy, isAttacking }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Specifikace chování pro berserk nebo goldenguard
  const specialUnitTypes = ['berserk', 'goldenguard'];
  const isSpecialUnit = specialUnitTypes.includes(unit.type);

  // Přizpůsobení počtu snímků a rychlosti animace pro speciální typy jednotek
  const frameCount = isSpecialUnit ? 5 : 10; // Méně snímků pro speciální jednotky
  const animationInterval = isSpecialUnit ? 200 : 100; // Pomalejší animace pro speciální jednotky

  const actionType = isAttacking ? 'attack' : 'walk';
  const maxHealth = unit.maxHealth; // Nahradit skutečným maximálním zdravím
  const healthPercentage = (unit.health / maxHealth) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(frame => (frame + 1) % frameCount); // Dynamicky přizpůsobit počet snímků
    }, animationInterval); // Dynamicky přizpůsobit interval animace

    return () => clearInterval(interval);
  }, [isAttacking, unit.type]); // Přidání unit.type do závislostí pro přizpůsobení speciálních typů

  const imageSrc = `/src/assets/images/animations/${unit.type}/${actionType}/${animationFrame}.png`;

  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''} ${isAttacking ? 'attacking' : ''} ${isSpecialUnit ? 'unit-image-bottom unit-image-scale' : ''}`} style={{ left: `${unit.position}px` }}>
      <div className="hp-bar-container">
        <div className="hp-bar" style={{ width: `${healthPercentage}%` }}></div>
      </div>
      
      <div className={`unit-image ${isSpecialUnit ? 'unit-image-scale' : ''}`}>
        <img src={imageSrc} alt={`${unit.type} ${actionType}`} draggable="false"/>
      </div>
      
    </div>
  );
};

export default UnitComponent;

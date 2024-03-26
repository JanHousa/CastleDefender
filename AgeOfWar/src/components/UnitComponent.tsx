import React from 'react';
import { Unit } from '../types'; // Předpokládáme definici typů

interface UnitProps {
  unit: Unit;
  isEnemy: boolean;
  isAttacking: boolean;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, isEnemy, isAttacking }) => {
  // Předpokládejme, že maximální zdraví jednotky je známé (můžete to ukládat ve stavu, konfiguraci atd.)
  const maxHealth = 100; // Tuto hodnotu nahraďte skutečným maximálním zdravím vaší jednotky

  // Vypočítáme procentuální podíl aktuálního zdraví oproti maximálnímu
  const healthPercentage = (unit.health / maxHealth) * 100;

  return (
    <div className={`unit ${isEnemy ? 'enemy' : ''} ${isAttacking ? 'attacking' : ''}`} style={{ left: `${unit.position}px` }}>
      {/* HP bar nad jednotkou */}
      <div className="hp-bar-container">
        <div className="hp-bar" style={{ width: `${healthPercentage}%` }}></div>
      </div>
      {/* Obrázek jednotky */}
      <img src={unit.imageUrl} alt={unit.type} />
    </div>
  );
};


export default UnitComponent;

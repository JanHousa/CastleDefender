
import React from 'react';

interface HealthBarProps {
  health: number;
  maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ health, maxHealth }) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="health-bar-container">
      <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
    </div>
  );
};

export default HealthBar;

import React from 'react';
import HealthBar from './HealthBar';

export interface TowerComponentProps {
    health: number;
    maxHealth: number;
    evolutionLevel: number; 
    isEnemy: boolean;
    position: number;
}

const TowerComponent: React.FC<TowerComponentProps> = ({ health, maxHealth, evolutionLevel }) => {
    const imageUrl = getImageUrlForEvolution(evolutionLevel);

    return (
        <div className="tower-slot">
            <HealthBar health={health} maxHealth={maxHealth} /> {}
            <img src={imageUrl} alt="Tower" />
        </div>
    );
};


const getImageUrlForEvolution = (evolutionLevel: number): string => {
    const imageUrlMap : any = {
        1: './src/assets/images/Tower1.png',
        2: './src/assets/images/Tower2.png',
        3: './src/assets/images/Tower3.png'
    };

    return imageUrlMap[evolutionLevel] || imageUrlMap[1]; 
};

export default TowerComponent;

import React from 'react';
import HealthBar from './HealthBar';

interface TowerComponentProps {
    health: number;
    maxHealth: number;
    evolutionLevel: number; // Přidáno pro určení úrovně evoluce
}

const TowerComponent: React.FC<TowerComponentProps> = ({ health, maxHealth, evolutionLevel }) => {
    const imageUrl = getImageUrlForEvolution(evolutionLevel);

    return (
        <div className="tower-slot">
            <HealthBar health={health} maxHealth={maxHealth} /> {/* Přesunuto nad obrázek */}
            <img src={imageUrl} alt="Tower" />
        </div>
    );
};

// Předpokládáme, že máte nějakou logiku nebo mapování, které na základě evolutionLevel určuje správný obrázek
const getImageUrlForEvolution = (evolutionLevel: number): string => {
    const imageUrlMap = {
        1: '/src/assets/images/Tower1.png',
        2: '/src/assets/images/Tower2.png',
        3: '/src/assets/images/Tower3.png'
    };

    return imageUrlMap[evolutionLevel] || imageUrlMap[1]; // Vrátí výchozí obrázek, pokud není nalezen odpovídající klíč
};

export default TowerComponent;

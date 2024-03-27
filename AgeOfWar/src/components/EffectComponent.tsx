import React from 'react';
import { Effect } from '../types'; // Předpokládáme, že máte soubor types.ts, kde je definovaný typ Effect

interface EffectComponentProps {
  effect: Effect;
}

const EffectComponent: React.FC<EffectComponentProps> = ({ effect }) => {
    // Předpokládáme, že efekt má typ 'arrow' a že se pohybuje ve 2D prostoru (x, y)
    // Tento příklad pouze zobrazuje div na pozici efektu, ale můžete použít obrázky nebo jiné SVG
    const style = {
        left: `${effect.currentPosition.x}px`,
        top: `${effect.currentPosition.y}px`,
        position: 'absolute' as const,
        width: '10px',
        height: '2px',
        backgroundColor: 'black',
        transform: 'rotate(-45deg)', // Příklad rotace, můžete upravit podle směru pohybu
    };

    return <div style={style}></div>;
};

export default EffectComponent;

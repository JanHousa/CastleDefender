import React, { useState, useEffect } from 'react';
import './Game.css';
import { GameState, DefenseTower, UnitsByEvolution } from '../types';
import UnitCard from './UnitCard';
import HealthBar from './HealthBar';
import BattlefieldComponent from './BattlefieldComponent';
import EnemyAIComponent from './EnemyAI';
import UnitsList from './UnitsList';
import TowerSelectionComponent from './TowerSelection'; // Předpokládá, že máte tuto komponentu
import DefenseSlot from './DefenseSlot'; // Adjust the path as necessary
import DefenseTowerComponent from './DefenseTower'; // Adjust the path as necessary
import TowerComponent from './TowerComponent'; // Adjust the path as necessary
import { v4 as uuidv4 } from 'uuid';


const unitsByEvolution: UnitsByEvolution = {
  1: [
    { id: 1, type: 'knight', health: 100, attack: 20, cost: 50, imageUrl: '/src/assets/images/animations/knight/walk/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},

  ],
  2: [
    { id: 1, type: 'knight', health: 100, attack: 20, cost: 50, imageUrl: '/src/assets/images/animations/knight/walk/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},
    // Další jednotky...
  ],
  3: [
    { id: 1, type: 'knight', health: 100, attack: 20, cost: 50, imageUrl: '/src/assets/images/animations/knight/walk/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},
    // Další jednotky...
  ],
  // Další úrovně...
};


const availableTowers: DefenseTower[] = [
  { id: 1, type: 'Catapult', cost: 300, attack: 5, range: 450, position: 0, imageUrl: '/src/assets/images/catapult.png' },
  { id: 2, type: 'Cannon', cost: 500, attack: 7, range: 450, position: 0, imageUrl: '/src/assets/images/cannon.png' },
  // Add more towers as needed
];

// Počáteční stav hry
const initialGameState: GameState = {
  units: unitsByEvolution[1], // Začínáme s jednotkami pro úroveň 1
  gold: 1000,
  health: 100,
  activeUnits: [],
  evolutionLevel: 1,
  baseColor: 'gray', // Výchozí barva základny
  lastSpawnTime: Date.now(), // Inicializace času posledního spawnu
  unitQueue: [], // Inicializace prázdné fronty jednotek
  enemyUnits: [],
  enemyGold: 1000,
  enemyEvolutionLevel: 1,
  defenseTowers: [], // Přidáno pro věže
  unitsByEvolution: unitsByEvolution, // Add this line
  effects: [], // Add this line
  enemyHealth: 100, // Oprava chyby v názvu
};

interface Tower {
  id: number;
  type: string;
  cost: number;
  attack: number;
  range: number;
  imageUrl: string;
  slotId: number;
}


const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showTowerSelection, setShowTowerSelection] = useState(false);

  //TOGGLE TOWER SELECTION
  const toggleTowerSelection = () => {
    setShowTowerSelection(!showTowerSelection);
  };

 // Add gold to player every second
 useEffect(() => {
  const goldInterval = setInterval(() => {
    setGameState((prevState) => ({
      ...prevState,
      gold: prevState.gold + 2,
    }));
  }, 1000); // Adds 2 gold every second

  return () => clearInterval(goldInterval);
}, []);

/*
  // Move enemy units towards the player's base
  useEffect(() => {
    
    const moveUnitsInterval = setInterval(() => {
      setGameState((prevState) => {
        const movedUnits = prevState.enemyUnits.map((unit) => ({
          ...unit,
          position: unit.position - 5, // Move enemy units towards the player's base
        }));

        return { ...prevState, enemyUnits: movedUnits };
      });
    }, 100); // Update unit positions every 100 ms

    return () => clearInterval(moveUnitsInterval);
  }, []);

*/
  // Handle the purchase of a tower and place it in the selected slot
  const handleTowerPurchase = (tower: DefenseTower, slotId: number) => {
    const isSlotOccupied = gameState.defenseTowers.some((t) => t.slotId === slotId);
    if (isSlotOccupied) {
      alert('A tower is already present in this slot!');
      return;
    }

    if (gameState.gold >= tower.cost) {
      setGameState((prevState) => ({
        ...prevState,
        gold: prevState.gold - tower.cost,
        defenseTowers: [...prevState.defenseTowers, { ...tower, slotId }],
      }));
    } else {
      alert('Not enough gold to purchase this tower!');
    }
  };

  
  // Update the game state with new values
// V Game komponentě
const updateGameState: (newStateOrUpdater: GameState | ((prevState: GameState) => GameState | Partial<GameState>)) => void = (newStateOrUpdater) => {
  if (typeof newStateOrUpdater === 'function') {
    // Pokud je to funkce, použijte ji k aktualizaci stavu
    setGameState((prevState) => {
      const result = newStateOrUpdater(prevState);
      return {...prevState, ...result};
    });
  } else {
    // Pokud je to přímo objekt GameState, použijte jej k přímé aktualizaci stavu
    setGameState(newStateOrUpdater);
  }
};


 // Sell a tower that's placed in a specific slot
 const sellTower = (slotId: number) => {
  const towerIndex = gameState.defenseTowers.findIndex((t) => t.slotId === slotId);
  if (towerIndex === -1) {
    alert('No tower to sell in this slot!');
    return;
  }

  // Return 50% of the tower's cost
  const towerPrice = gameState.defenseTowers[towerIndex].cost;
  setGameState((prevState) => ({
    ...prevState,
    gold: prevState.gold + towerPrice * 0.5, // Return 50% of the tower's cost
    defenseTowers: prevState.defenseTowers.filter((_, index) => index !== towerIndex),
  }));
};

  // Spawn units from the queue
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (gameState.unitQueue.length > 0 && now - gameState.lastSpawnTime >= 3000) {
        const unitToSpawn = gameState.unitQueue[0];
        setGameState(prevState => ({
          ...prevState,
          activeUnits: [...prevState.activeUnits, { ...unitToSpawn, id: uuidv4(), position: 0 }], // Přidáváme UUID při spawnování
          unitQueue: prevState.unitQueue.slice(1),
          lastSpawnTime: now,
        }));
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [gameState.unitQueue, gameState.lastSpawnTime]);
  
  const handleTowerSelection = (towerOrAction: DefenseTower | 'sell', slotId: number): void => {
    if (towerOrAction === 'sell') {
      sellTower(slotId);
    } else {
      handleTowerPurchase(towerOrAction, slotId);
    }
  };


  // Animace by měla být řešena přímo v CSS s vhodným použitím React state a style props.
  
// Upravená část pro přidání jednotky do fronty, která zaručí, že 'addedToQueueAt' bude vždy definováno
const spawnUnit = (unitType: string) => {
  if (gameState.unitQueue.length >= 5) {
    alert('Fronta je plná!');
    return;
  }


  // Přidání jednotky do fronty
  const unitTemplate = gameState.units.find(unit => unit.type === unitType);
  if (unitTemplate && gameState.gold >= unitTemplate.cost) {
    setGameState(prevState => ({
      ...prevState,
      gold: prevState.gold - unitTemplate.cost,
      unitQueue: [...prevState.unitQueue, { ...unitTemplate, addedToQueueAt: Date.now() }], // Přidání času
    }));
  } else {
    alert('Nedostatek zlata nebo chybný typ jednotky!');
  }
};
  /*
// Pohyb jednotek
useEffect(() => {
  const moveUnits = () => {
    setGameState(prevState => ({
      ...prevState,
      activeUnits: prevState.activeUnits.map(unit => ({
        ...unit,
        position: unit.position + 2, // Příklad posunu jednotek
      })),
    }));
  };

  // Pohyb jednotek každých 50 ms
  const intervalId = setInterval(moveUnits, 50); 

  return () => clearInterval(intervalId);
}, [gameState.activeUnits.length]); // Spustí se znovu, pokud se změní počet aktivních jednotek
*/
  // Evoluce
  const evolve = () => {
    const costOfEvolution = 100;
    if (gameState.gold >= costOfEvolution && unitsByEvolution[gameState.evolutionLevel + 1]) {
      setGameState(prevState => ({
        ...prevState,
        gold: prevState.gold - costOfEvolution,
        evolutionLevel: prevState.evolutionLevel + 1,
        // Předpokládá se, že máte definovanou funkci getTowerImageForEvolution
        towerImage: getImageUrlForTower(prevState.evolutionLevel + 1),
        units: unitsByEvolution[prevState.evolutionLevel + 1] || [],
      }));
    } else {
      alert('Nedostatek zlata pro evoluci nebo neexistuje další úroveň.');
    }
  };
  
  // Získání URL obrázku věže pro danou úroveň evoluce
  const getImageUrlForTower = (evolutionLevel: number): string => {
    const images = [
      '/src/assets/images/animations/knight/walk/0.png', // URL obrázku pro úroveň 1
    ];
    return images[evolutionLevel - 1] || images[images.length - 1];
  };
  
  

  return (
    <div>
      <header className="header">
      <div className='header-left'>
        <div className="gold-info">
          <div className="gold-icon"></div>
          <span>{gameState.gold} Gold</span>
        </div>
      </div>

      {/* Jednotky vedle sebe v hlavičce */}
      <div className="unit-buttons">
        {gameState.units.map(unit => (
          <UnitCard key={unit.id} unit={unit} onBuy={() => spawnUnit(unit.type)} />
        ))}
      </div>
          

      <div className="evolve-button">
        <button onClick={evolve}>Evoluce (Stojí 100 Gold)</button>
      </div>
    </header>
      <div className="game-area" style={{ borderColor: gameState.baseColor }}>

          
      <footer className="unit-queue">
        {gameState.unitQueue.map((unit, index) => (
          <div key={index} className="queue-item" style={{
            animation: `fadeInAnimation ${1000}ms ease-out forwards`,
          }}>
            <img src={unit.imageUrl} alt={unit.type} />
          </div>
        ))}
      </footer>

         <BattlefieldComponent gameState={gameState} updateGameState={updateGameState} />
      <EnemyAIComponent gameState={gameState} updateGameState={setGameState} unitsByEvolution={unitsByEvolution} />

      <div className="player-base">
      <TowerComponent
        health={gameState.health} // Předpokládáme, že health je stav vaší věže
        maxHealth={100} // Předpokládáme, že maxHealth je maximální zdraví vaší věže
        evolutionLevel={gameState.evolutionLevel}
    />
          {showTowerSelection && (
              <TowerSelectionComponent
                  towers={availableTowers}
                  onTowerSelected={(tower, slotId) => handleTowerSelection(tower, slotId)}
                  currentTower={gameState.defenseTowers.find(tower => tower.slotId === 1)}
                  slotId={1}
              />
          )}
      </div>

      <div className="enemy-base">
        <TowerComponent
        health={gameState.health} // Předpokládáme, že health je stav vaší věže
        maxHealth={100} // Předpokládáme, že maxHealth je maximální zdraví vaší věže
        evolutionLevel={gameState.evolutionLevel}
    />
        </div>
      </div>
      </div>



  );
  
};

export default Game;

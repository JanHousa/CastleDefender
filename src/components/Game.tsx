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
import MusicPlayer from './MusicPlayer';
import { v4 as uuidv4 } from 'uuid';


const unitsByEvolution: UnitsByEvolution = {
  1: [
    { id: 1, type: 'knight', health: 200, maxHealth: 200, attack: 20, cost: 15, goldValue: 25, imageUrl: '/src/assets/images/knight_icon.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},
    { id: 2, type: 'archer', health: 100, maxHealth: 100, attack: 20, cost: 20, goldValue: 40, imageUrl: '/src/assets/images/archer_icon.png', position: 0, attackType: 'melee', range: 200, attackSpeed: 1000, lastAttackTime: 0},
    { id: 3, type: 'berserk', health: 500, maxHealth: 500, attack: 40, cost: 200, goldValue: 300, imageUrl: '/src/assets/images/animations/berserk/attack/0.png', position: 0, attackType: 'melee', range: 80, attackSpeed: 1000, lastAttackTime: 0},

  ],
  2: [
    { id: 1, type: 'assasin', health: 300, maxHealth: 300, attack: 40, cost: 150, goldValue: 200, imageUrl: '/src/assets/images/animations/assasin/attack/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},
    { id: 1, type: 'warrior', health: 500, maxHealth: 500, attack: 60, cost: 500, goldValue: 200, imageUrl: '/src/assets/images/animations/warrior/attack/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},
    { id: 1, type: 'goldenguard', health: 500, maxHealth: 500, attack: 60, cost: 500, goldValue: 200, imageUrl: '/src/assets/images/animations/goldenguard/attack/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},

  ],
  3: [
    { id: 1, type: 'knight', health: 100, maxHealth: 100, attack: 20, cost: 50, goldValue: 200, imageUrl: '/src/assets/images/animations/knight/walk/0.png', position: 0, attackType: 'melee', range: 90, attackSpeed: 1000, lastAttackTime: 0},

  ],

};


const availableTowers: DefenseTower[] = [
  { id: 1, type: 'Catapult', cost: 300, attack: 50, range: 600, position: 0, imageUrl: '/src/assets/images/catapult.png', attackSpeed: 2000, lastAttackTime: 0 },
  { id: 2, type: 'Cannon', cost: 500, attack: 80, range: 700, position: 0, imageUrl: '/src/assets/images/cannon.png', attackSpeed: 2000, lastAttackTime: 0 },
];

const initialGameState: GameState = {
  units: unitsByEvolution[1], 
  gold: 1000,
  health: 100,
  playerUnits: [],
  evolutionLevel: 1,
  baseColor: 'gray', 
  lastSpawnTime: Date.now(), 
  unitQueue: [], 
  enemyUnits: [],
  enemyGold: 1000,
  enemyEvolutionLevel: 1,
  defenseTowers: [],
  unitsByEvolution: unitsByEvolution, 
  effects: [], 
  enemyHealth: 100,
  playerTower: { health: 300, maxHealth: 300, evolutionLevel: 1, isEnemy: false, position: 300 },
  enemyTower: { health: 300, maxHealth: 300, evolutionLevel: 1, isEnemy: true, position: 1600 },
  attackingTargets: [],
};

//

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showTowerSelection, setShowTowerSelection] = useState(false);

  //TOGGLE TOWER SELECTION
  const toggleTowerSelection = () => {
    setShowTowerSelection(!showTowerSelection);
  };


 useEffect(() => {
  const goldInterval = setInterval(() => {
    setGameState((prevState) => ({
      ...prevState,
      gold: prevState.gold + 2,
    }));
  }, 1000); 

  return () => clearInterval(goldInterval);
}, []);


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

  

const updateGameState: (newStateOrUpdater: GameState | ((prevState: GameState) => GameState | Partial<GameState>)) => void = (newStateOrUpdater) => {
  if (typeof newStateOrUpdater === 'function') {

    setGameState((prevState) => {
      const result = newStateOrUpdater(prevState);
      return {...prevState, ...result};
    });
  } else {

    setGameState(newStateOrUpdater);
  }
};


 const sellTower = (slotId: number) => {
  const towerIndex = gameState.defenseTowers.findIndex((t) => t.slotId === slotId);
  if (towerIndex === -1) {
    alert('No tower to sell in this slot!');
    return;
  }


  const towerPrice = gameState.defenseTowers[towerIndex].cost;
  setGameState((prevState) => ({
    ...prevState,
    gold: prevState.gold + towerPrice * 0.5, 
    defenseTowers: prevState.defenseTowers.filter((_, index) => index !== towerIndex),
  }));
};


  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (gameState.unitQueue.length > 0 && now - gameState.lastSpawnTime >= 3000) {
        const unitToSpawn = gameState.unitQueue[0];
        setGameState(prevState => ({
          ...prevState,
          playerUnits: [...prevState.playerUnits, { ...unitToSpawn, id: uuidv4(), position: 230 }], // Přidáváme UUID při spawnování
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



  

const spawnUnit = (unitType: string) => {
  if (gameState.unitQueue.length >= 5) {
    alert('Fronta je plná!');
    return;
  }



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

  // Evoluce
  const evolve = () => {
    const costOfEvolution = 100;
    if (gameState.gold >= costOfEvolution && unitsByEvolution[gameState.evolutionLevel + 1]) {
      setGameState(prevState => ({
        ...prevState,
        gold: prevState.gold - costOfEvolution,
        evolutionLevel: prevState.evolutionLevel + 1,

        towerImage: getImageUrlForTower(prevState.evolutionLevel + 1),
        units: unitsByEvolution[prevState.evolutionLevel + 1] || [],
      }));
    } else {
      alert('Nedostatek zlata pro evoluci nebo neexistuje další úroveň.');
    }
  };
  

  const getImageUrlForTower = (evolutionLevel: number): string => {
    const images = [
      '/src/assets/images/animations/knight/walk/0.png', 
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

      {}
      <div className="unit-buttons">
        {gameState.units.map(unit => (
          <UnitCard key={unit.id} unit={unit} onBuy={() => spawnUnit(unit.type)} />
        ))}
      </div>

      <MusicPlayer></MusicPlayer>
          

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
        health={gameState.playerTower.health} 
        maxHealth={gameState.playerTower.maxHealth} 
        evolutionLevel={gameState.evolutionLevel}
        isEnemy={gameState.playerTower.isEnemy}
        position={gameState.playerTower.position}
    />  


    <div className='defense-container'>
         
        <DefenseSlot
        onSlotClick={toggleTowerSelection}
        slotId={1}
        tower={gameState.defenseTowers.find(tower => tower.slotId === 1)}
      />
      {showTowerSelection && (
        <TowerSelectionComponent
          towers={availableTowers}
          onTowerSelected={handleTowerSelection}
          currentTower={gameState.defenseTowers.find(tower => tower.slotId === 1)}
          slotId={1} // Pass slotId if needed for handling selections
        />
      )}

        </div>  
      </div>


      <div className="enemy-base">
        <TowerComponent
        health={gameState.enemyTower.health} 
        maxHealth={gameState.enemyTower.maxHealth} 
        evolutionLevel={gameState.enemyTower.evolutionLevel}
        isEnemy={gameState.enemyTower.isEnemy}
        position={gameState.enemyTower.position}
    />
        </div>
      </div>
      </div>



  );
  
};

export default Game;

export interface Unit {
  id: number;
  type: string;
  health: number;
  attack: number;
  cost: number;
  imageUrl: string;
  position: number;
  attackType: 'melee' | 'range';
  range: number;
  addedToQueueAt?: number; // Přidáno pro správu času přidání do fronty
}

export interface GameState {
  units: Unit[];
  gold: number;
  health: number;
  activeUnits: Unit[];
  evolutionLevel: number;
  baseColor: string;
  lastSpawnTime: number;
  unitQueue: Unit[];
  enemyUnits: Unit[];
  enemyGold: number;
  enemyEvolutionLevel: number;
  defenseTowers: DefenseTower[];
  unitsByEvolution: UnitsByEvolution; // Add this line
}


export interface UnitsByEvolution {
  [level: number]: Unit[];
}

export interface DefenseTower {
  id: number;
  type: 'Catapult' | 'Cannon'; // Example types
  cost: number;
  attack: number;
  range: number;
  position: number;
  imageUrl: string; // Include this line to add the imageUrl property
  slotId?: number; // Přidáno pro správu slotů
}

export interface GameState {
  // ostatní pole zůstávají stejná
  defenseTowers: DefenseTower[];
}


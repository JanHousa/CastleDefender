import { v4 as uuidv4 } from 'uuid';


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
  isEnemy?: boolean;
  isAttacking?: boolean;
  lastAttackTime: number;
  attackSpeed: number; // Milisekundy
  isBlocked?: boolean; // Přidáno pro blokování jednotek
}

export interface Effect {
  id: string;
  type: 'arrow';
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  speed: number;
}

export interface GameState {
  units: Unit[];
  gold: number;
  health: number;
  playerUnits: Unit[];
  evolutionLevel: number;
  baseColor: string;
  lastSpawnTime: number;
  unitQueue: Unit[];
  enemyUnits: Unit[];
  enemyGold: number;
  enemyEvolutionLevel: number;
  defenseTowers: DefenseTower[];
  unitsByEvolution: UnitsByEvolution;
  effects: Effect[]; // Přidání efektů do stavu
  enemyHealth: number; // Oprava chyby v názvu
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


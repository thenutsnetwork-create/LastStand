// Game Types for Last Stand: Mars Exodus

export type TeamId = 'red' | 'blue' | 'green';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type CardType = 'minion' | 'army' | 'modifier' | 'super';

export type GamePhase = 'setup' | 'playing' | 'combat' | 'victory';

export type TurnAction = 'attack' | 'play' | 'draw' | null;

export interface Position {
  x: number;
  y: number;
}

export interface StateTerritory {
  id: string;
  name: string;
  abbreviation: string;
  path: string;
  center: Position;
  neighbors: string[];
  region: 'northeast' | 'south' | 'midwest' | 'west' | 'southwest' | 'northwest';
}

export interface TerritoryState {
  stateId: string;
  ownerId: TeamId | null;
  troops: number;
  isBase: boolean;
}

export interface SpecialEffect {
  type:
    | 'heal'
    | 'damage_target'
    | 'reinforce_target'
    | 'reinforce_all'
    | 'double_attack'
    | 'reveal_hand'
    | 'resurrect_base'
    | 'instant_capture'
    | 'check_victory'
    | 'double_defense'
    | 'nuke_penalty';
  value?: number;
  duration?: number;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: CardRarity;
  attackModifier: number;
  defenseModifier: number;
  specialEffect?: SpecialEffect;
  icon: string;
}

export interface Team {
  id: TeamId;
  name: string;
  color: string;
  baseStateId: string;
  troops: number;
  territories: string[];
  cards: Card[];
  isAI: boolean;
  isActive: boolean;
}

export interface CombatResult {
  attackerRoll: number[];
  defenderRoll: number[];
  attackerTotal: number;
  defenderTotal: number;
  attackerCard?: Card;
  defenderCard?: Card;
  winner: 'attacker' | 'defender' | 'tie';
  attackerLosses: number;
  defenderLosses: number;
  territoryCaptured: boolean;
  attackerTerritoryId: string;
  defenderTerritoryId: string;
}

export interface TimedMultiplierEffect {
  multiplier: number;
  remainingTurns: number;
}

export interface EspionageState {
  targetTeamId: TeamId | null;
  remainingTurns: number;
}

export interface GameState {
  phase: GamePhase;
  teams: Record<TeamId, Team>;
  territories: Record<string, TerritoryState>;
  currentTeamId: TeamId;
  turnNumber: number;
  maxTurns: number;
  timeRemaining: number;
  turnAction: TurnAction;
  selectedTerritory: string | null;
  selectedCard: Card | null;
  combatResult: CombatResult | null;
  winner: TeamId | null;
  deck: Card[];
  discardPile: Card[];
  showCombatModal: boolean;
  aiThinking: boolean;
  espionageActive: EspionageState;
  cardsPlayedByTeam: Record<TeamId, number>;
  extraAttacksRemaining: number;
  teamDefenseBuffs: Record<TeamId, TimedMultiplierEffect>;
}

export interface GameConfig {
  playerCount: number;
  aiOpponents: number;
  turnTimeLimit: number;
  maxTurns: number;
}

export const TEAM_IDS: TeamId[] = ['red', 'blue', 'green'];

export const TEAM_COLORS: Record<TeamId, { primary: string; secondary: string; glow: string }> = {
  red: {
    primary: '#dc2626',
    secondary: '#991b1b',
    glow: 'rgba(220, 38, 38, 0.5)',
  },
  blue: {
    primary: '#2563eb',
    secondary: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.5)',
  },
  green: {
    primary: '#16a34a',
    secondary: '#15803d',
    glow: 'rgba(22, 163, 74, 0.5)',
  },
};

export const TEAM_NAMES: Record<TeamId, string> = {
  red: 'New Federation',
  blue: 'Resistance',
  green: 'Unity Coalition',
};

export const STARTING_POSITIONS: Record<TeamId, string> = {
  red: 'CT',
  blue: 'CA',
  green: 'TX',
};

export const RARITY_COLORS: Record<CardRarity, { border: string; glow: string; bg: string }> = {
  common: {
    border: '#6b7280',
    glow: 'rgba(107, 114, 128, 0.3)',
    bg: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
  },
  uncommon: {
    border: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.4)',
    bg: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  },
  rare: {
    border: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.5)',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
  },
  legendary: {
    border: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.6)',
    bg: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
  },
};

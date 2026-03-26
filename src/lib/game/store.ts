// Zustand Game Store for Last Stand: Mars Exodus
import { create } from 'zustand';
import {
  Card,
  CombatResult,
  EspionageState,
  GameConfig,
  GamePhase,
  GameState,
  Team,
  TeamId,
  TerritoryState,
  TimedMultiplierEffect,
  TEAM_COLORS,
  TEAM_IDS,
  TEAM_NAMES,
  STARTING_POSITIONS,
} from './types';
import { STATE_MAP, US_STATES } from './states';
import { createDeck, drawCard, shuffleDeck } from './cards';
import {
  calculateTerritoryCount,
  calculateTotalTroops,
  canAttack,
  cardCanAttack,
  cardCanPlayAsSupport,
  getAIDecision,
  getPlayableSupportTargets,
  getTerritoryLeader,
} from './gameLogic';

const DEFAULT_CONFIG: GameConfig = {
  playerCount: 1,
  aiOpponents: 2,
  maxTurns: 50,
  turnTimeLimit: 900,
};

const rollDice = (count: number): number[] => Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);

const createEmptyDefenseBuffs = (): Record<TeamId, TimedMultiplierEffect> => ({
  red: { multiplier: 1, remainingTurns: 0 },
  blue: { multiplier: 1, remainingTurns: 0 },
  green: { multiplier: 1, remainingTurns: 0 },
});

const createEmptyCardStats = (): Record<TeamId, number> => ({
  red: 0,
  blue: 0,
  green: 0,
});

const createEmptyEspionage = (): EspionageState => ({
  targetTeamId: null,
  remainingTurns: 0,
});

const initializeTeams = (playerCount: number, aiOpponents: number): Record<TeamId, Team> => ({
  red: {
    id: 'red',
    name: TEAM_NAMES.red,
    color: TEAM_COLORS.red.primary,
    baseStateId: STARTING_POSITIONS.red,
    troops: 0,
    territories: [STARTING_POSITIONS.red],
    cards: [],
    isAI: false,
    isActive: true,
  },
  blue: {
    id: 'blue',
    name: TEAM_NAMES.blue,
    color: TEAM_COLORS.blue.primary,
    baseStateId: STARTING_POSITIONS.blue,
    troops: 0,
    territories: [STARTING_POSITIONS.blue],
    cards: [],
    isAI: playerCount < 2,
    isActive: playerCount >= 2 || aiOpponents >= 1,
  },
  green: {
    id: 'green',
    name: TEAM_NAMES.green,
    color: TEAM_COLORS.green.primary,
    baseStateId: STARTING_POSITIONS.green,
    troops: 0,
    territories: [STARTING_POSITIONS.green],
    cards: [],
    isAI: playerCount < 3,
    isActive: playerCount >= 3 || aiOpponents >= 2,
  },
});

const initializeTerritories = (teams: Record<TeamId, Team>): Record<string, TerritoryState> => {
  const territories: Record<string, TerritoryState> = {};

  for (const state of US_STATES) {
    let ownerId: TeamId | null = null;
    let isBase = false;

    for (const teamId of TEAM_IDS) {
      const team = teams[teamId];
      if (team.isActive && team.baseStateId === state.id) {
        ownerId = teamId;
        isBase = true;
        break;
      }
    }

    territories[state.id] = {
      stateId: state.id,
      ownerId,
      troops: ownerId ? 1000 : Math.floor(Math.random() * 300) + 200,
      isBase,
    };
  }

  return territories;
};

const syncTeamsFromTerritories = (
  baseTeams: Record<TeamId, Team>,
  territories: Record<string, TerritoryState>,
): Record<TeamId, Team> => {
  const nextTeams = { ...baseTeams } as Record<TeamId, Team>;

  for (const teamId of TEAM_IDS) {
    const ownedTerritories = Object.values(territories)
      .filter((territory) => territory.ownerId === teamId)
      .map((territory) => territory.stateId);

    nextTeams[teamId] = {
      ...nextTeams[teamId],
      territories: ownedTerritories,
      troops: calculateTotalTroops(territories, teamId),
      isActive: ownedTerritories.length > 0,
    };
  }

  return nextTeams;
};

const drawInitialHands = (
  teams: Record<TeamId, Team>,
  deck: Card[],
): { teams: Record<TeamId, Team>; deck: Card[] } => {
  const updatedTeams = { ...teams };
  let currentDeck = [...deck];

  for (const teamId of TEAM_IDS) {
    const team = updatedTeams[teamId];
    if (!team.isActive) {
      continue;
    }

    const { drawn, remaining } = drawCard(currentDeck, 10);
    updatedTeams[teamId] = {
      ...team,
      cards: drawn,
    };
    currentDeck = remaining;
  }

  return { teams: updatedTeams, deck: currentDeck };
};

const getFirstActiveTeamId = (teams: Record<TeamId, Team>): TeamId => TEAM_IDS.find((teamId) => teams[teamId].isActive) ?? 'red';

const decrementTimedEffects = (effects: Record<TeamId, TimedMultiplierEffect>): Record<TeamId, TimedMultiplierEffect> => {
  const nextEffects = { ...effects };
  for (const teamId of TEAM_IDS) {
    const effect = nextEffects[teamId];
    if (effect.remainingTurns <= 0) {
      nextEffects[teamId] = { multiplier: 1, remainingTurns: 0 };
      continue;
    }

    const remainingTurns = effect.remainingTurns - 1;
    nextEffects[teamId] = remainingTurns > 0 ? { ...effect, remainingTurns } : { multiplier: 1, remainingTurns: 0 };
  }
  return nextEffects;
};

const decrementEspionage = (espionage: EspionageState): EspionageState => {
  if (espionage.remainingTurns <= 0) {
    return createEmptyEspionage();
  }

  const remainingTurns = espionage.remainingTurns - 1;
  if (remainingTurns <= 0) {
    return createEmptyEspionage();
  }

  return { ...espionage, remainingTurns };
};

const determineWinner = (state: Pick<GameState, 'teams' | 'territories'>): TeamId | null => {
  const activeTeams = TEAM_IDS.filter((teamId) => calculateTerritoryCount(state.territories, teamId) > 0);

  if (activeTeams.length === 1) {
    return activeTeams[0] ?? null;
  }

  for (const teamId of activeTeams) {
    if (calculateTerritoryCount(state.territories, teamId) >= 30) {
      return teamId;
    }
  }

  return null;
};

const getTimeoutWinner = (territories: Record<string, TerritoryState>): TeamId | null => getTerritoryLeader(territories);

const createGameState = (config: GameConfig = DEFAULT_CONFIG): GameState => {
  const teams = initializeTeams(config.playerCount, config.aiOpponents);
  const territories = initializeTerritories(teams);
  const syncedTeams = syncTeamsFromTerritories(teams, territories);
  const deck = createDeck();
  const { teams: teamsWithCards, deck: remainingDeck } = drawInitialHands(syncedTeams, deck);

  return {
    phase: 'setup',
    teams: teamsWithCards,
    territories,
    currentTeamId: getFirstActiveTeamId(teamsWithCards),
    turnNumber: 1,
    maxTurns: config.maxTurns,
    timeRemaining: config.turnTimeLimit,
    turnAction: null,
    selectedTerritory: null,
    selectedCard: null,
    combatResult: null,
    winner: null,
    deck: remainingDeck,
    discardPile: [],
    showCombatModal: false,
    aiThinking: false,
    espionageActive: createEmptyEspionage(),
    cardsPlayedByTeam: createEmptyCardStats(),
    extraAttacksRemaining: 0,
    teamDefenseBuffs: createEmptyDefenseBuffs(),
  };
};

let scheduledAITurn: ReturnType<typeof setTimeout> | null = null;

const clearScheduledAI = () => {
  if (scheduledAITurn) {
    clearTimeout(scheduledAITurn);
    scheduledAITurn = null;
  }
};

interface GameStore extends GameState {
  initializeGame: (config: GameConfig) => void;
  startGame: () => void;
  resetGame: () => void;
  nextTurn: () => void;
  selectTerritory: (stateId: string | null) => void;
  selectCard: (card: Card | null) => void;
  playCard: (targetTerritory?: string) => boolean;
  drawCardAction: () => void;
  executeAttack: (attackerTerritory: string, defenderTerritory: string, card: Card) => CombatResult | null;
  resolveCombat: (result: CombatResult) => void;
  closeCombatModal: () => void;
  applySpecialEffect: (card: Card, targetTerritory?: string) => boolean;
  executeAITurn: () => void;
  checkVictory: () => TeamId | null;
}

const initialGameState = createGameState();

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,

  initializeGame: (config) => {
    clearScheduledAI();
    set(createGameState(config));
  },

  startGame: () => {
    const state = get();
    set({ phase: 'playing', aiThinking: false });
    if (state.teams[state.currentTeamId].isAI) {
      get().executeAITurn();
    }
  },

  resetGame: () => {
    clearScheduledAI();
    set(createGameState(DEFAULT_CONFIG));
  },

  nextTurn: () => {
    clearScheduledAI();
    const state = get();
    const winner = determineWinner(state);
    if (winner) {
      set({ phase: 'victory', winner, aiThinking: false, showCombatModal: false, combatResult: null });
      return;
    }

    const activeTeams = TEAM_IDS.filter((teamId) => state.teams[teamId].isActive);
    if (activeTeams.length === 0) {
      set({ phase: 'victory', winner: null, aiThinking: false, showCombatModal: false, combatResult: null });
      return;
    }

    const currentIndex = activeTeams.indexOf(state.currentTeamId);
    const nextIndex = (currentIndex + 1) % activeTeams.length;
    const nextTeamId = activeTeams[nextIndex] ?? activeTeams[0] ?? state.currentTeamId;
    const newTurnNumber = nextIndex === 0 ? state.turnNumber + 1 : state.turnNumber;

    const decrementedEspionage = decrementEspionage(state.espionageActive);
    const decrementedDefenseBuffs = decrementTimedEffects(state.teamDefenseBuffs);

    if (newTurnNumber > state.maxTurns) {
      const timeoutWinner = getTimeoutWinner(state.territories);
      set({
        phase: 'victory',
        winner: timeoutWinner,
        turnNumber: newTurnNumber,
        aiThinking: false,
        showCombatModal: false,
        combatResult: null,
      });
      return;
    }

    set({
      currentTeamId: nextTeamId,
      turnNumber: newTurnNumber,
      turnAction: null,
      selectedTerritory: null,
      selectedCard: null,
      showCombatModal: false,
      combatResult: null,
      aiThinking: false,
      espionageActive: decrementedEspionage,
      teamDefenseBuffs: decrementedDefenseBuffs,
      extraAttacksRemaining: 0,
    });

    if (get().phase === 'playing' && get().teams[nextTeamId].isAI) {
      get().executeAITurn();
    }
  },

  selectTerritory: (stateId) => {
    set({ selectedTerritory: stateId });
  },

  selectCard: (card) => {
    set({ selectedCard: card });
  },

  playCard: (targetTerritory) => {
    const state = get();
    const { selectedCard, currentTeamId, teams, territories } = state;
    if (!selectedCard || state.phase !== 'playing') {
      return false;
    }

    const currentTeam = teams[currentTeamId];
    const cardInHand = currentTeam.cards.some((card) => card.id === selectedCard.id);
    if (!cardInHand || !cardCanPlayAsSupport(selectedCard) || state.turnAction === 'draw' || state.turnAction === 'attack') {
      return false;
    }

    const validTargets = getPlayableSupportTargets(state, selectedCard);
    if (validTargets.length > 0 && (!targetTerritory || !validTargets.includes(targetTerritory))) {
      return false;
    }

    let updatedTerritories = { ...territories };
    let updatedTeams = { ...teams };
    let updatedEspionage = state.espionageActive;
    let updatedDefenseBuffs = { ...state.teamDefenseBuffs };
    let updatedPhase: GamePhase = state.phase;
    let updatedWinner = state.winner;
    let updatedExtraAttacksRemaining = state.extraAttacksRemaining;
    let effectApplied = false;

    const applyDefenseBuff = (bonus: number, duration: number) => {
      const existing = updatedDefenseBuffs[currentTeamId];
      const multiplier = Math.max(existing.multiplier, 1 + bonus);
      updatedDefenseBuffs[currentTeamId] = {
        multiplier,
        remainingTurns: Math.max(existing.remainingTurns, duration),
      };
    };

    if (selectedCard.specialEffect) {
      const effect = selectedCard.specialEffect;
      switch (effect.type) {
        case 'heal': {
          if (!targetTerritory || updatedTerritories[targetTerritory]?.ownerId !== currentTeamId) {
            return false;
          }
          updatedTerritories[targetTerritory] = {
            ...updatedTerritories[targetTerritory],
            troops: updatedTerritories[targetTerritory].troops + (effect.value ?? 500),
          };
          effectApplied = true;
          break;
        }
        case 'reinforce_target': {
          if (!targetTerritory || updatedTerritories[targetTerritory]?.ownerId !== currentTeamId) {
            return false;
          }
          updatedTerritories[targetTerritory] = {
            ...updatedTerritories[targetTerritory],
            troops: updatedTerritories[targetTerritory].troops + (effect.value ?? 300),
          };
          effectApplied = true;
          break;
        }
        case 'reinforce_all': {
          for (const territory of Object.values(updatedTerritories)) {
            if (territory.ownerId === currentTeamId) {
              updatedTerritories[territory.stateId] = {
                ...territory,
                troops: territory.troops + (effect.value ?? 300),
              };
            }
          }
          effectApplied = true;
          break;
        }
        case 'damage_target': {
          if (!targetTerritory || updatedTerritories[targetTerritory]?.ownerId === currentTeamId || !updatedTerritories[targetTerritory]?.ownerId) {
            return false;
          }
          updatedTerritories[targetTerritory] = {
            ...updatedTerritories[targetTerritory],
            troops: Math.max(0, updatedTerritories[targetTerritory].troops - (effect.value ?? 300)),
          };
          effectApplied = true;
          break;
        }
        case 'reveal_hand': {
          const targetTeamId = TEAM_IDS
            .filter((teamId) => teamId !== currentTeamId && updatedTeams[teamId].isActive)
            .sort((a, b) => calculateTerritoryCount(updatedTerritories, b) - calculateTerritoryCount(updatedTerritories, a))[0] ?? null;

          if (!targetTeamId) {
            return false;
          }

          updatedEspionage = {
            targetTeamId,
            remainingTurns: effect.duration ?? 2,
          };
          effectApplied = true;
          break;
        }
        case 'resurrect_base': {
          const baseStateId = currentTeam.baseStateId;
          const currentBaseOwner = updatedTerritories[baseStateId]?.ownerId ?? null;
          if (currentBaseOwner !== currentTeamId) {
            updatedTerritories[baseStateId] = {
              ...updatedTerritories[baseStateId],
              ownerId: currentTeamId,
              troops: effect.value ?? 1000,
              isBase: true,
            };
            effectApplied = true;
          }
          break;
        }
        case 'instant_capture': {
          if (!targetTerritory || !validTargets.includes(targetTerritory)) {
            return false;
          }

          const adjacentOrigin = Object.values(updatedTerritories)
            .filter((territory) => territory.ownerId === currentTeamId)
            .find((territory) => STATE_MAP[territory.stateId]?.neighbors.includes(targetTerritory));

          const movedTroops = adjacentOrigin ? Math.min(400, Math.max(200, Math.floor(adjacentOrigin.troops * 0.35))) : 300;
          if (adjacentOrigin) {
            updatedTerritories[adjacentOrigin.stateId] = {
              ...adjacentOrigin,
              troops: Math.max(100, adjacentOrigin.troops - movedTroops),
            };
          }

          updatedTerritories[targetTerritory] = {
            ...updatedTerritories[targetTerritory],
            ownerId: currentTeamId,
            troops: movedTroops,
          };
          effectApplied = true;
          break;
        }
        case 'check_victory': {
          if (calculateTerritoryCount(updatedTerritories, currentTeamId) < (effect.value ?? 20)) {
            return false;
          }

          updatedPhase = 'victory';
          updatedWinner = currentTeamId;
          effectApplied = true;
          break;
        }
        case 'double_defense': {
          applyDefenseBuff(effect.value ?? 1, effect.duration ?? 1);
          effectApplied = true;
          break;
        }
        case 'double_attack': {
          updatedExtraAttacksRemaining = Math.max(updatedExtraAttacksRemaining, effect.value ?? 1);
          effectApplied = true;
          break;
        }
        case 'nuke_penalty': {
          return false;
        }
        default:
          break;
      }
    } else if (selectedCard.defenseModifier > 0) {
      applyDefenseBuff(selectedCard.defenseModifier, 1);
      effectApplied = true;
    }

    if (!effectApplied) {
      return false;
    }

    updatedTeams[currentTeamId] = {
      ...updatedTeams[currentTeamId],
      cards: updatedTeams[currentTeamId].cards.filter((card) => card.id !== selectedCard.id),
    };
    updatedTeams = syncTeamsFromTerritories(updatedTeams, updatedTerritories);

    set({
      teams: updatedTeams,
      territories: updatedTerritories,
      discardPile: [...state.discardPile, selectedCard],
      selectedCard: null,
      selectedTerritory: null,
      turnAction: selectedCard.specialEffect?.type === 'double_attack' ? null : 'play',
      espionageActive: updatedEspionage,
      teamDefenseBuffs: updatedDefenseBuffs,
      phase: updatedPhase,
      winner: updatedWinner,
      extraAttacksRemaining: updatedExtraAttacksRemaining,
      cardsPlayedByTeam: {
        ...state.cardsPlayedByTeam,
        [currentTeamId]: state.cardsPlayedByTeam[currentTeamId] + 1,
      },
      aiThinking: false,
    });

    return true;
  },

  drawCardAction: () => {
    const state = get();
    const currentTeam = state.teams[state.currentTeamId];
    if (state.turnAction || !currentTeam.isActive) {
      return;
    }

    if (state.deck.length > 0) {
      const { drawn, remaining } = drawCard(state.deck, 1);
      set({
        teams: {
          ...state.teams,
          [state.currentTeamId]: {
            ...currentTeam,
            cards: [...currentTeam.cards, ...drawn],
          },
        },
        deck: remaining,
        turnAction: 'draw',
      });
      return;
    }

    if (state.discardPile.length > 0) {
      const recycledDeck = shuffleDeck([...state.discardPile]);
      const { drawn, remaining } = drawCard(recycledDeck, 1);
      set({
        teams: {
          ...state.teams,
          [state.currentTeamId]: {
            ...currentTeam,
            cards: [...currentTeam.cards, ...drawn],
          },
        },
        deck: remaining,
        discardPile: [],
        turnAction: 'draw',
      });
      return;
    }

    set({ turnAction: 'draw' });
  },

  executeAttack: (attackerTerritoryId, defenderTerritoryId, card) => {
    const state = get();
    const attacker = state.territories[attackerTerritoryId];
    const defender = state.territories[defenderTerritoryId];
    const currentTeam = state.teams[state.currentTeamId];

    if (
      state.phase !== 'playing' ||
      !attacker ||
      !defender ||
      attacker.ownerId !== state.currentTeamId ||
      !defender.ownerId ||
      defender.ownerId === state.currentTeamId ||
      !STATE_MAP[attackerTerritoryId]?.neighbors.includes(defenderTerritoryId) ||
      !currentTeam.cards.some((handCard) => handCard.id === card.id) ||
      !cardCanAttack(card) ||
      (state.turnAction !== null && state.extraAttacksRemaining <= 0)
    ) {
      return null;
    }

    const defenderMultiplier = defender.ownerId ? state.teamDefenseBuffs[defender.ownerId]?.multiplier ?? 1 : 1;
    const attackerRoll = rollDice(2);
    const defenderRoll = rollDice(1);

    const attackerTotal = Math.round(attackerRoll.reduce((sum, roll) => sum + roll, 0) * (1 + card.attackModifier));
    const defenderTotal = Math.round(defenderRoll.reduce((sum, roll) => sum + roll, 0) * defenderMultiplier);

    const attackerLossesBase = Math.max(50, Math.round(attacker.troops * 0.1));
    const defenderLossesBase = Math.max(50, Math.round(defender.troops * 0.15));

    let winner: CombatResult['winner'] = 'tie';
    let attackerLosses = attackerLossesBase;
    let defenderLosses = defenderLossesBase;

    if (attackerTotal > defenderTotal) {
      winner = 'attacker';
      defenderLosses = Math.max(100, Math.round(defender.troops * 0.5));
    } else if (attackerTotal < defenderTotal) {
      winner = 'defender';
      attackerLosses = Math.max(100, Math.round(attacker.troops * 0.2));
    }

    const result: CombatResult = {
      attackerRoll,
      defenderRoll,
      attackerTotal,
      defenderTotal,
      attackerCard: card,
      defenderCard: undefined,
      winner,
      attackerLosses,
      defenderLosses,
      territoryCaptured: winner === 'attacker',
      attackerTerritoryId,
      defenderTerritoryId,
    };

    set({
      teams: {
        ...state.teams,
        [state.currentTeamId]: {
          ...currentTeam,
          cards: currentTeam.cards.filter((handCard) => handCard.id !== card.id),
        },
      },
      discardPile: [...state.discardPile, card],
      selectedCard: null,
      selectedTerritory: attackerTerritoryId,
      combatResult: result,
      showCombatModal: true,
      turnAction: 'attack',
      cardsPlayedByTeam: {
        ...state.cardsPlayedByTeam,
        [state.currentTeamId]: state.cardsPlayedByTeam[state.currentTeamId] + 1,
      },
      aiThinking: false,
    });

    return result;
  },

  resolveCombat: (result) => {
    const state = get();
    const attackerTerritory = state.territories[result.attackerTerritoryId];
    const defenderTerritory = state.territories[result.defenderTerritoryId];

    if (!attackerTerritory || !defenderTerritory) {
      return;
    }

    let updatedTerritories = { ...state.territories };
    let updatedTeams = { ...state.teams };

    const attackerRemaining = Math.max(100, attackerTerritory.troops - result.attackerLosses);
    updatedTerritories[result.attackerTerritoryId] = {
      ...updatedTerritories[result.attackerTerritoryId],
      troops: attackerRemaining,
    };

    if (result.territoryCaptured) {
      const transferTroops = Math.max(100, Math.min(Math.floor(attackerRemaining / 2), attackerRemaining - 100));
      updatedTerritories[result.attackerTerritoryId] = {
        ...updatedTerritories[result.attackerTerritoryId],
        troops: attackerRemaining - transferTroops,
      };
      updatedTerritories[result.defenderTerritoryId] = {
        ...updatedTerritories[result.defenderTerritoryId],
        ownerId: state.currentTeamId,
        troops: transferTroops,
      };
    } else {
      updatedTerritories[result.defenderTerritoryId] = {
        ...updatedTerritories[result.defenderTerritoryId],
        troops: Math.max(0, defenderTerritory.troops - result.defenderLosses),
      };
    }

    if (result.attackerCard?.specialEffect?.type === 'nuke_penalty') {
      const penaltyMultiplier = result.attackerCard.specialEffect.value ?? 0.5;
      const penalizedTroops = Math.max(100, Math.floor(updatedTerritories[result.attackerTerritoryId].troops * (1 - penaltyMultiplier)));
      updatedTerritories[result.attackerTerritoryId] = {
        ...updatedTerritories[result.attackerTerritoryId],
        troops: penalizedTroops,
      };
    }

    updatedTeams = syncTeamsFromTerritories(updatedTeams, updatedTerritories);
    const winner = determineWinner({ teams: updatedTeams, territories: updatedTerritories });

    set({
      territories: updatedTerritories,
      teams: updatedTeams,
      phase: winner ? 'victory' : state.phase,
      winner: winner ?? state.winner,
    });
  },

  closeCombatModal: () => {
    clearScheduledAI();
    const state = get();

    if (state.phase === 'victory') {
      set({ showCombatModal: false, combatResult: null, aiThinking: false, extraAttacksRemaining: 0 });
      return;
    }

    if (state.extraAttacksRemaining > 0) {
      const nextExtraAttacks = state.extraAttacksRemaining - 1;
      set({
        showCombatModal: false,
        combatResult: null,
        aiThinking: false,
        turnAction: null,
        extraAttacksRemaining: nextExtraAttacks,
        selectedTerritory: null,
      });

      if (state.teams[state.currentTeamId].isAI && canAttack(get())) {
        get().executeAITurn();
      }
      return;
    }

    set({ showCombatModal: false, combatResult: null, aiThinking: false, extraAttacksRemaining: 0, selectedTerritory: null });
    get().nextTurn();
  },

  applySpecialEffect: (card, targetTerritory) => {
    const state = get();
    set({ selectedCard: card });
    const success = get().playCard(targetTerritory);
    if (!success) {
      set({ selectedCard: state.selectedCard });
    }
    return success;
  },

  executeAITurn: () => {
    clearScheduledAI();
    const snapshot = get();
    const currentTeam = snapshot.teams[snapshot.currentTeamId];
    if (!currentTeam.isAI || !currentTeam.isActive || snapshot.phase !== 'playing' || snapshot.showCombatModal) {
      return;
    }

    set({ aiThinking: true });

    scheduledAITurn = setTimeout(() => {
      const state = get();
      const actingTeam = state.teams[state.currentTeamId];
      if (!actingTeam.isAI || !actingTeam.isActive || state.phase !== 'playing' || state.showCombatModal) {
        set({ aiThinking: false });
        return;
      }

      const winningCard = actingTeam.cards.find(
        (card) => card.specialEffect?.type === 'check_victory' && calculateTerritoryCount(state.territories, state.currentTeamId) >= (card.specialEffect.value ?? 20),
      );
      if (winningCard) {
        set({ selectedCard: winningCard });
        get().playCard();
        set({ aiThinking: false });
        return;
      }

      const instantCaptureCard = actingTeam.cards.find((card) => card.specialEffect?.type === 'instant_capture');
      if (instantCaptureCard) {
        const targets = getPlayableSupportTargets(state, instantCaptureCard)
          .sort((a, b) => state.territories[a].troops - state.territories[b].troops);
        if (targets.length > 0) {
          set({ selectedCard: instantCaptureCard });
          get().playCard(targets[0]);
          set({ aiThinking: false });
          get().nextTurn();
          return;
        }
      }

      const extraAttackCard = actingTeam.cards.find((card) => card.specialEffect?.type === 'double_attack');
      if (extraAttackCard && canAttack(state)) {
        set({ selectedCard: extraAttackCard });
        get().playCard();
      }

      const refreshedState = get();
      const decision = getAIDecision(refreshedState);
      if (decision.action === 'attack' && decision.origin && decision.target && decision.card) {
        get().executeAttack(decision.origin, decision.target, decision.card);
        set({ aiThinking: false });
        return;
      }

      const damageCard = actingTeam.cards.find((card) => card.specialEffect?.type === 'damage_target');
      if (damageCard) {
        const targets = getPlayableSupportTargets(state, damageCard)
          .sort((a, b) => state.territories[b].troops - state.territories[a].troops);
        if (targets.length > 0) {
          set({ selectedCard: damageCard });
          get().playCard(targets[0]);
          set({ aiThinking: false });
          get().nextTurn();
          return;
        }
      }

      get().drawCardAction();
      set({ aiThinking: false });
      get().nextTurn();
    }, 700);
  },

  checkVictory: () => determineWinner(get()),
}));

export default useGameStore;

// Game Logic Helper Functions for Last Stand: Mars Exodus
import { Card, GameState, TeamId, TerritoryState } from './types';
import { STATE_MAP } from './states';
import { TEAM_IDS } from './types';

export function calculateTotalTroops(territories: Record<string, TerritoryState>, teamId: TeamId): number {
  return Object.values(territories)
    .filter((territory) => territory.ownerId === teamId)
    .reduce((sum, territory) => sum + territory.troops, 0);
}

export function calculateTerritoryCount(territories: Record<string, TerritoryState>, teamId: TeamId): number {
  return Object.values(territories).filter((territory) => territory.ownerId === teamId).length;
}

export function cardCanAttack(card: Card): boolean {
  return card.attackModifier > 0;
}

export function cardCanPlayAsSupport(card: Card): boolean {
  return Boolean(card.specialEffect) || card.defenseModifier > 0;
}

export function cardRequiresTarget(card: Card): boolean {
  if (!cardCanPlayAsSupport(card)) {
    return false;
  }

  if (!card.specialEffect) {
    return card.defenseModifier > 0;
  }

  return ['heal', 'damage_target', 'reinforce_target', 'instant_capture'].includes(card.specialEffect.type);
}

export function cardTargetsOwnedTerritory(card: Card): boolean {
  if (!card.specialEffect) {
    return card.defenseModifier > 0;
  }

  return ['heal', 'reinforce_target'].includes(card.specialEffect.type);
}

export function cardTargetsEnemyTerritory(card: Card): boolean {
  return card.specialEffect ? ['damage_target', 'instant_capture'].includes(card.specialEffect.type) : false;
}

export function getPlayableSupportTargets(gameState: GameState, card: Card): string[] {
  const { currentTeamId, territories } = gameState;

  if (!cardRequiresTarget(card)) {
    return [];
  }

  if (cardTargetsOwnedTerritory(card)) {
    return Object.values(territories)
      .filter((territory) => territory.ownerId === currentTeamId)
      .map((territory) => territory.stateId);
  }

  if (card.specialEffect?.type === 'instant_capture') {
    const targets = new Set<string>();
    for (const territory of Object.values(territories)) {
      if (territory.ownerId !== currentTeamId) {
        continue;
      }

      const stateData = STATE_MAP[territory.stateId];
      if (!stateData) {
        continue;
      }

      for (const neighborId of stateData.neighbors) {
        const neighbor = territories[neighborId];
        if (neighbor?.ownerId && neighbor.ownerId !== currentTeamId) {
          targets.add(neighborId);
        }
      }
    }

    return Array.from(targets);
  }

  return Object.values(territories)
    .filter((territory) => territory.ownerId && territory.ownerId !== currentTeamId)
    .map((territory) => territory.stateId);
}

export function hasAttackCard(gameState: GameState): boolean {
  return gameState.teams[gameState.currentTeamId].cards.some(cardCanAttack);
}

export function canAttack(gameState: GameState): boolean {
  const { teams, currentTeamId, turnAction, extraAttacksRemaining } = gameState;
  const currentTeam = teams[currentTeamId];

  if (!currentTeam.isActive || !hasAttackCard(gameState)) {
    return false;
  }

  if (turnAction === 'draw' || turnAction === 'play') {
    return false;
  }

  if (turnAction === 'attack' && extraAttacksRemaining <= 0) {
    return false;
  }

  return getAttackOrigins(gameState).length > 0;
}

export function getAttackOrigins(gameState: GameState): string[] {
  const { territories, currentTeamId } = gameState;
  const origins: string[] = [];

  for (const territory of Object.values(territories)) {
    if (territory.ownerId !== currentTeamId) {
      continue;
    }

    const stateData = STATE_MAP[territory.stateId];
    if (!stateData) {
      continue;
    }

    const hasEnemyNeighbor = stateData.neighbors.some((neighborId) => {
      const neighbor = territories[neighborId];
      return Boolean(neighbor?.ownerId && neighbor.ownerId !== currentTeamId);
    });

    if (hasEnemyNeighbor) {
      origins.push(territory.stateId);
    }
  }

  return origins;
}

export function getAttackTargets(gameState: GameState, originId: string): string[] {
  const { territories, currentTeamId } = gameState;
  const stateData = STATE_MAP[originId];
  if (!stateData) {
    return [];
  }

  return stateData.neighbors.filter((neighborId) => {
    const neighbor = territories[neighborId];
    return Boolean(neighbor?.ownerId && neighbor.ownerId !== currentTeamId);
  });
}

export function calculateCombatOdds(
  attackerTroops: number,
  defenderTroops: number,
  attackerCard?: Card,
  defenderMultiplier = 1,
): {
  attackerWinChance: number;
  defenderWinChance: number;
  tieChance: number;
} {
  const attackerBase = 7;
  const defenderBase = 3.5;

  const attackerPower = attackerBase * (1 + (attackerCard?.attackModifier ?? 0));
  const defenderPower = defenderBase * defenderMultiplier;

  const troopDelta = (attackerTroops - defenderTroops) / Math.max(defenderTroops, 1);
  const troopModifier = Math.max(-0.3, Math.min(0.3, troopDelta * 0.1));

  const rawAttackerChance = attackerPower / (attackerPower + defenderPower) + troopModifier;
  const attackerWinChance = Math.max(0.15, Math.min(0.8, rawAttackerChance));
  const tieChance = 0.1;
  const defenderWinChance = Math.max(0.1, 1 - attackerWinChance - tieChance);

  return {
    attackerWinChance: Math.round(attackerWinChance * 100) / 100,
    defenderWinChance: Math.round(defenderWinChance * 100) / 100,
    tieChance,
  };
}

export function getRecommendedAttackCard(cards: Card[], defenderTroops: number): Card | null {
  const attackCards = cards.filter(cardCanAttack).sort((a, b) => b.attackModifier - a.attackModifier);
  if (attackCards.length === 0) {
    return null;
  }

  if (defenderTroops > 1000) {
    return attackCards[0];
  }

  if (defenderTroops > 500) {
    return attackCards[Math.min(1, attackCards.length - 1)] ?? attackCards[0];
  }

  return attackCards[attackCards.length - 1] ?? attackCards[0];
}

export function countConnectedTerritories(
  startTerritory: string,
  teamId: TeamId,
  territories: Record<string, TerritoryState>,
): number {
  const visited = new Set<string>();
  const queue = [startTerritory];
  let count = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);
    const territory = territories[current];
    if (territory?.ownerId !== teamId) {
      continue;
    }

    count += 1;
    const stateData = STATE_MAP[current];
    if (!stateData) {
      continue;
    }

    for (const neighbor of stateData.neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return count;
}

export function getAIDecision(gameState: GameState): {
  action: 'attack' | 'draw';
  origin?: string;
  target?: string;
  card?: Card;
} {
  const { territories, currentTeamId } = gameState;
  const origins = getAttackOrigins(gameState);
  const currentTeam = gameState.teams[currentTeamId];

  if (origins.length === 0) {
    return { action: 'draw' };
  }

  const availableAttackCards = currentTeam.cards.filter(cardCanAttack);
  if (availableAttackCards.length === 0) {
    return { action: 'draw' };
  }

  let bestAttack: { origin: string; target: string; score: number; card: Card } | null = null;

  for (const origin of origins) {
    const attackerTerritory = territories[origin];
    if (!attackerTerritory) {
      continue;
    }

    for (const target of getAttackTargets(gameState, origin)) {
      const defenderTerritory = territories[target];
      if (!defenderTerritory) {
        continue;
      }

      const card = getRecommendedAttackCard(availableAttackCards, defenderTerritory.troops) ?? availableAttackCards[0];
      const odds = calculateCombatOdds(attackerTerritory.troops, defenderTerritory.troops, card);

      let score = odds.attackerWinChance * 100;
      if (defenderTerritory.isBase) {
        score += 25;
      }
      if (defenderTerritory.troops < 300) {
        score += 15;
      }
      score += countConnectedTerritories(origin, currentTeamId, territories) * 3;

      if (!bestAttack || score > bestAttack.score) {
        bestAttack = { origin, target, score, card };
      }
    }
  }

  if (!bestAttack || bestAttack.score < 25) {
    return { action: 'draw' };
  }

  return {
    action: 'attack',
    origin: bestAttack.origin,
    target: bestAttack.target,
    card: bestAttack.card,
  };
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getRarityDisplayName(rarity: string): string {
  const names: Record<string, string> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    legendary: 'Legendary',
  };
  return names[rarity] || rarity;
}

export function getTypeDisplayName(type: string): string {
  const names: Record<string, string> = {
    minion: 'Minion',
    army: 'Army',
    modifier: 'Modifier',
    super: 'Super Rare',
  };
  return names[type] || type;
}

export function getDiceResultString(rolls: number[]): string {
  return `${rolls.map((roll) => `[${roll}]`).join(' + ')} = ${rolls.reduce((a, b) => a + b, 0)}`;
}

export function getTerritoryLeader(territories: Record<string, TerritoryState>): TeamId | null {
  const ranked = TEAM_IDS.map((teamId) => ({
    teamId,
    territoryCount: calculateTerritoryCount(territories, teamId),
    troopCount: calculateTotalTroops(territories, teamId),
  }))
    .filter((entry) => entry.territoryCount > 0)
    .sort((a, b) => {
      if (b.territoryCount !== a.territoryCount) {
        return b.territoryCount - a.territoryCount;
      }
      return b.troopCount - a.troopCount;
    });

  return ranked[0]?.teamId ?? null;
}

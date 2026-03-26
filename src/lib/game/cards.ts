// Card definitions for Last Stand: Mars Exodus
import { Card, CardRarity, CardType } from './types';

let cardIdCounter = 0;
const generateCardId = (base: string) => `${base}_${++cardIdCounter}`;

const cardTemplates: Omit<Card, 'id'>[] = [
  {
    name: 'Scout Squad',
    description: 'Deploy reconnaissance units for tactical advantage. +10% attack bonus.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0.1,
    defenseModifier: 0,
    icon: 'Eye',
  },
  {
    name: 'Defense Drone',
    description: 'Deploy an automated defense grid. Play as support to grant +10% defense to your faction for 1 turn.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0,
    defenseModifier: 0.1,
    icon: 'Shield',
  },
  {
    name: 'Medic Team',
    description: 'Heal 500 troops in one of your territories.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'heal', value: 500 },
    icon: 'Heart',
  },
  {
    name: 'Supply Drop',
    description: 'Reinforce one of your territories with 200 troops.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'reinforce_target', value: 200 },
    icon: 'Package',
  },
  {
    name: 'Radar Station',
    description: 'Either attack with +5%, or play as support to grant +5% defense for 1 turn.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0.05,
    defenseModifier: 0.05,
    icon: 'Radio',
  },
  {
    name: 'Combat Engineer',
    description: 'Play as support to fortify your faction with +8% defense for 1 turn.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0,
    defenseModifier: 0.08,
    icon: 'Hammer',
  },
  {
    name: 'Infiltrator',
    description: 'Silent operations specialist. +7% attack bonus.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0.07,
    defenseModifier: 0,
    icon: 'UserX',
  },
  {
    name: 'Field Commander',
    description: 'Either attack with +5%, or play as support to grant +5% defense for 1 turn.',
    type: 'minion',
    rarity: 'common',
    attackModifier: 0.05,
    defenseModifier: 0.05,
    icon: 'Medal',
  },
  {
    name: 'Tank Battalion',
    description: 'Heavy armor division advances. +25% attack bonus.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0.25,
    defenseModifier: 0,
    icon: 'Tank',
  },
  {
    name: 'Fortification',
    description: 'Play as support to grant +30% defense to your faction for 1 turn.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0,
    defenseModifier: 0.3,
    icon: 'Castle',
  },
  {
    name: 'Airstrike',
    description: 'Deal 300 damage to one enemy territory.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'damage_target', value: 300 },
    icon: 'Plane',
  },
  {
    name: 'Reinforcements',
    description: 'Add 500 troops to one of your territories.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'reinforce_target', value: 500 },
    icon: 'Users',
  },
  {
    name: 'Artillery Battery',
    description: 'Long-range bombardment support. +20% attack bonus.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0.2,
    defenseModifier: 0,
    icon: 'Crosshair',
  },
  {
    name: 'Anti-Air System',
    description: 'Play as support to grant +25% defense to your faction for 1 turn.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0,
    defenseModifier: 0.25,
    icon: 'Target',
  },
  {
    name: 'Mechanized Infantry',
    description: 'Either attack with +15%, or play as support to grant +10% defense for 1 turn.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0.15,
    defenseModifier: 0.1,
    icon: 'Truck',
  },
  {
    name: 'Special Ops',
    description: 'Elite forces for precision strikes. +18% attack bonus.',
    type: 'army',
    rarity: 'uncommon',
    attackModifier: 0.18,
    defenseModifier: 0,
    icon: 'Crosshair',
  },
  {
    name: 'Nuclear Strike',
    description: 'Tactical nuclear weapon. +50% attack, but your attacking territory loses 50% of its troops after the battle.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0.5,
    defenseModifier: 0,
    specialEffect: { type: 'nuke_penalty', value: 0.5 },
    icon: 'Atom',
  },
  {
    name: 'Shield Matrix',
    description: 'Double your faction defense for 1 turn.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'double_defense', value: 1, duration: 1 },
    icon: 'ShieldCheck',
  },
  {
    name: 'Blitz',
    description: 'Gain one extra attack this turn.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'double_attack', value: 1 },
    icon: 'Zap',
  },
  {
    name: 'Espionage',
    description: 'Reveal an enemy hand for 2 turns.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'reveal_hand', duration: 2 },
    icon: 'Eye',
  },
  {
    name: 'Propaganda',
    description: 'Demoralize enemy forces and deal 200 damage to one enemy territory.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'damage_target', value: 200 },
    icon: 'Megaphone',
  },
  {
    name: 'Cyber Warfare',
    description: 'Disrupt enemy communications. +30% attack bonus.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0.3,
    defenseModifier: 0,
    icon: 'Wifi',
  },
  {
    name: 'Emergency Protocol',
    description: 'Grant +400 troops to all of your territories.',
    type: 'modifier',
    rarity: 'rare',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'reinforce_all', value: 400 },
    icon: 'AlertTriangle',
  },
  {
    name: 'Phoenix Protocol',
    description: 'Retake your base instantly and restore it with 1000 troops.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'resurrect_base', value: 1000 },
    icon: 'Flame',
  },
  {
    name: 'Mass Conscription',
    description: 'Grant +1000 troops to all of your territories.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'reinforce_all', value: 1000 },
    icon: 'Users',
  },
  {
    name: 'Tactical Nuke',
    description: 'Instantly capture one adjacent enemy territory.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'instant_capture' },
    icon: 'Bomb',
  },
  {
    name: 'Mars Beacon',
    description: 'If you control 20 or more states, win immediately.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'check_victory', value: 20 },
    icon: 'Rocket',
  },
  {
    name: 'Quantum Shield',
    description: 'Grant +50% defense to your faction for 3 turns.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'double_defense', value: 0.5, duration: 3 },
    icon: 'Shield',
  },
  {
    name: 'Orbital Strike',
    description: 'Destroy 800 troops in one enemy territory.',
    type: 'super',
    rarity: 'legendary',
    attackModifier: 0,
    defenseModifier: 0,
    specialEffect: { type: 'damage_target', value: 800 },
    icon: 'Satellite',
  },
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  cardIdCounter = 0;

  const distribution: Record<CardRarity, number> = {
    common: 5,
    uncommon: 4,
    rare: 3,
    legendary: 2,
  };

  for (const template of cardTemplates) {
    const copies = distribution[template.rarity];
    for (let i = 0; i < copies; i += 1) {
      deck.push({
        ...template,
        id: generateCardId(template.name.toLowerCase().replace(/\s+/g, '_')),
      });
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCard(deck: Card[], count = 1): { drawn: Card[]; remaining: Card[] } {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
}

export function getCardByType(cards: Card[], type: CardType): Card[] {
  return cards.filter((card) => card.type === type);
}

export function getCardByRarity(cards: Card[], rarity: CardRarity): Card[] {
  return cards.filter((card) => card.rarity === rarity);
}

export { cardTemplates };

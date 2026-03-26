// U.S. State Data with SVG paths for Last Stand: Mars Exodus
import { StateTerritory } from './types';

// SVG paths are simplified for the contiguous 48 states
// Each path is scaled to fit in a 960x600 viewBox
export const US_STATES: StateTerritory[] = [
  // Northeast
  {
    id: 'ME',
    name: 'Maine',
    abbreviation: 'ME',
    path: 'M835,65 L860,50 L890,60 L895,90 L880,120 L860,130 L840,110 L835,65 Z',
    center: { x: 862, y: 90 },
    neighbors: ['NH'],
    region: 'northeast'
  },
  {
    id: 'NH',
    name: 'New Hampshire',
    abbreviation: 'NH',
    path: 'M815,100 L835,90 L845,110 L845,135 L825,140 L815,100 Z',
    center: { x: 830, y: 120 },
    neighbors: ['ME', 'VT', 'MA'],
    region: 'northeast'
  },
  {
    id: 'VT',
    name: 'Vermont',
    abbreviation: 'VT',
    path: 'M795,95 L815,100 L820,140 L800,145 L795,95 Z',
    center: { x: 807, y: 120 },
    neighbors: ['NH', 'MA', 'NY'],
    region: 'northeast'
  },
  {
    id: 'MA',
    name: 'Massachusetts',
    abbreviation: 'MA',
    path: 'M810,155 L855,145 L865,160 L850,175 L820,175 L810,155 Z',
    center: { x: 835, y: 162 },
    neighbors: ['NH', 'VT', 'NY', 'CT', 'RI'],
    region: 'northeast'
  },
  {
    id: 'RI',
    name: 'Rhode Island',
    abbreviation: 'RI',
    path: 'M835,175 L850,172 L852,185 L838,188 L835,175 Z',
    center: { x: 843, y: 180 },
    neighbors: ['MA', 'CT'],
    region: 'northeast'
  },
  {
    id: 'CT',
    name: 'Connecticut',
    abbreviation: 'CT',
    path: 'M800,175 L835,170 L838,195 L805,200 L800,175 Z',
    center: { x: 818, y: 185 },
    neighbors: ['MA', 'RI', 'NY'],
    region: 'northeast'
  },
  {
    id: 'NY',
    name: 'New York',
    abbreviation: 'NY',
    path: 'M720,100 L795,95 L800,155 L820,175 L815,200 L780,220 L750,200 L730,180 L720,100 Z',
    center: { x: 760, y: 155 },
    neighbors: ['VT', 'MA', 'CT', 'NJ', 'PA'],
    region: 'northeast'
  },
  {
    id: 'NJ',
    name: 'New Jersey',
    abbreviation: 'NJ',
    path: 'M780,215 L800,205 L810,235 L795,255 L780,250 L780,215 Z',
    center: { x: 792, y: 230 },
    neighbors: ['NY', 'PA', 'DE'],
    region: 'northeast'
  },
  {
    id: 'PA',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    path: 'M720,190 L780,200 L785,235 L770,250 L700,260 L695,230 L720,190 Z',
    center: { x: 740, y: 225 },
    neighbors: ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH'],
    region: 'northeast'
  },
  {
    id: 'DE',
    name: 'Delaware',
    abbreviation: 'DE',
    path: 'M780,255 L795,250 L800,280 L785,285 L780,255 Z',
    center: { x: 788, y: 268 },
    neighbors: ['NJ', 'PA', 'MD'],
    region: 'northeast'
  },
  {
    id: 'MD',
    name: 'Maryland',
    abbreviation: 'MD',
    path: 'M720,260 L780,255 L785,285 L750,290 L720,280 L720,260 Z',
    center: { x: 750, y: 272 },
    neighbors: ['PA', 'DE', 'WV', 'VA'],
    region: 'northeast'
  },

  // South
  {
    id: 'VA',
    name: 'Virginia',
    abbreviation: 'VA',
    path: 'M680,280 L720,260 L750,290 L750,320 L700,330 L650,320 L640,300 L680,280 Z',
    center: { x: 695, y: 300 },
    neighbors: ['MD', 'WV', 'KY', 'TN', 'NC'],
    region: 'south'
  },
  {
    id: 'WV',
    name: 'West Virginia',
    abbreviation: 'WV',
    path: 'M680,250 L720,245 L730,270 L720,285 L680,290 L670,270 L680,250 Z',
    center: { x: 700, y: 268 },
    neighbors: ['PA', 'MD', 'VA', 'KY', 'OH'],
    region: 'south'
  },
  {
    id: 'NC',
    name: 'North Carolina',
    abbreviation: 'NC',
    path: 'M680,330 L750,320 L780,340 L760,360 L700,365 L660,355 L680,330 Z',
    center: { x: 720, y: 345 },
    neighbors: ['VA', 'TN', 'SC', 'GA'],
    region: 'south'
  },
  {
    id: 'SC',
    name: 'South Carolina',
    abbreviation: 'SC',
    path: 'M700,365 L745,358 L760,385 L730,400 L700,390 L700,365 Z',
    center: { x: 728, y: 380 },
    neighbors: ['NC', 'GA'],
    region: 'south'
  },
  {
    id: 'GA',
    name: 'Georgia',
    abbreviation: 'GA',
    path: 'M680,370 L700,365 L705,400 L740,420 L720,450 L680,445 L680,370 Z',
    center: { x: 705, y: 410 },
    neighbors: ['NC', 'SC', 'FL', 'AL'],
    region: 'south'
  },
  {
    id: 'FL',
    name: 'Florida',
    abbreviation: 'FL',
    path: 'M700,450 L740,430 L780,470 L790,520 L760,550 L720,540 L700,480 L700,450 Z',
    center: { x: 740, y: 490 },
    neighbors: ['GA', 'AL'],
    region: 'south'
  },
  {
    id: 'AL',
    name: 'Alabama',
    abbreviation: 'AL',
    path: 'M640,370 L680,370 L685,445 L665,460 L640,450 L640,370 Z',
    center: { x: 660, y: 410 },
    neighbors: ['GA', 'FL', 'MS', 'TN'],
    region: 'south'
  },
  {
    id: 'MS',
    name: 'Mississippi',
    abbreviation: 'MS',
    path: 'M590,380 L640,370 L645,450 L620,470 L590,450 L590,380 Z',
    center: { x: 615, y: 415 },
    neighbors: ['AL', 'TN', 'AR', 'LA'],
    region: 'south'
  },
  {
    id: 'LA',
    name: 'Louisiana',
    abbreviation: 'LA',
    path: 'M540,430 L590,410 L600,470 L570,500 L530,490 L540,430 Z',
    center: { x: 560, y: 455 },
    neighbors: ['MS', 'AR', 'TX'],
    region: 'south'
  },
  {
    id: 'KY',
    name: 'Kentucky',
    abbreviation: 'KY',
    path: 'M620,270 L680,260 L700,290 L680,310 L630,315 L600,300 L620,270 Z',
    center: { x: 650, y: 288 },
    neighbors: ['WV', 'VA', 'TN', 'MO', 'IL', 'IN', 'OH'],
    region: 'south'
  },
  {
    id: 'TN',
    name: 'Tennessee',
    abbreviation: 'TN',
    path: 'M590,320 L650,310 L680,330 L675,360 L630,365 L590,350 L590,320 Z',
    center: { x: 635, y: 340 },
    neighbors: ['KY', 'VA', 'NC', 'GA', 'AL', 'MS', 'AR', 'MO'],
    region: 'south'
  },

  // Midwest
  {
    id: 'OH',
    name: 'Ohio',
    abbreviation: 'OH',
    path: 'M650,220 L700,215 L715,250 L700,275 L655,280 L640,260 L650,220 Z',
    center: { x: 677, y: 248 },
    neighbors: ['PA', 'WV', 'KY', 'IN', 'MI'],
    region: 'midwest'
  },
  {
    id: 'MI',
    name: 'Michigan',
    abbreviation: 'MI',
    path: 'M640,140 L680,120 L700,140 L710,180 L695,210 L660,200 L650,170 L640,140 Z M680,180 L695,175 L698,190 L683,195 L680,180 Z',
    center: { x: 670, y: 165 },
    neighbors: ['OH', 'IN', 'WI'],
    region: 'midwest'
  },
  {
    id: 'IN',
    name: 'Indiana',
    abbreviation: 'IN',
    path: 'M610,220 L650,220 L655,280 L615,285 L610,220 Z',
    center: { x: 632, y: 252 },
    neighbors: ['OH', 'KY', 'IL', 'MI'],
    region: 'midwest'
  },
  {
    id: 'IL',
    name: 'Illinois',
    abbreviation: 'IL',
    path: 'M570,200 L610,200 L620,280 L600,320 L570,310 L560,250 L570,200 Z',
    center: { x: 590, y: 260 },
    neighbors: ['IN', 'KY', 'MO', 'IA', 'WI'],
    region: 'midwest'
  },
  {
    id: 'WI',
    name: 'Wisconsin',
    abbreviation: 'WI',
    path: 'M560,130 L610,120 L620,160 L610,200 L570,205 L550,180 L560,130 Z',
    center: { x: 585, y: 165 },
    neighbors: ['MI', 'IL', 'IA', 'MN'],
    region: 'midwest'
  },
  {
    id: 'MN',
    name: 'Minnesota',
    abbreviation: 'MN',
    path: 'M500,90 L560,80 L575,130 L560,180 L520,190 L500,160 L500,90 Z',
    center: { x: 535, y: 135 },
    neighbors: ['WI', 'IA', 'ND', 'SD'],
    region: 'midwest'
  },
  {
    id: 'IA',
    name: 'Iowa',
    abbreviation: 'IA',
    path: 'M520,195 L570,195 L580,250 L540,260 L510,240 L520,195 Z',
    center: { x: 545, y: 225 },
    neighbors: ['WI', 'IL', 'MO', 'NE', 'SD', 'MN'],
    region: 'midwest'
  },
  {
    id: 'MO',
    name: 'Missouri',
    abbreviation: 'MO',
    path: 'M520,280 L600,280 L620,330 L580,360 L520,350 L510,310 L520,280 Z',
    center: { x: 560, y: 320 },
    neighbors: ['IL', 'KY', 'TN', 'AR', 'OK', 'KS', 'NE', 'IA'],
    region: 'midwest'
  },

  // Great Plains
  {
    id: 'ND',
    name: 'North Dakota',
    abbreviation: 'ND',
    path: 'M380,80 L450,75 L455,130 L380,135 L380,80 Z',
    center: { x: 415, y: 105 },
    neighbors: ['MN', 'SD', 'MT'],
    region: 'midwest'
  },
  {
    id: 'SD',
    name: 'South Dakota',
    abbreviation: 'SD',
    path: 'M380,135 L455,130 L460,195 L380,200 L380,135 Z',
    center: { x: 418, y: 165 },
    neighbors: ['ND', 'MN', 'IA', 'NE', 'WY', 'MT'],
    region: 'midwest'
  },
  {
    id: 'NE',
    name: 'Nebraska',
    abbreviation: 'NE',
    path: 'M400,210 L510,205 L525,270 L440,280 L400,250 L400,210 Z',
    center: { x: 460, y: 240 },
    neighbors: ['SD', 'IA', 'MO', 'KS', 'CO', 'WY'],
    region: 'midwest'
  },
  {
    id: 'KS',
    name: 'Kansas',
    abbreviation: 'KS',
    path: 'M400,285 L520,275 L530,340 L420,350 L400,315 L400,285 Z',
    center: { x: 460, y: 315 },
    neighbors: ['NE', 'MO', 'OK', 'CO'],
    region: 'midwest'
  },
  {
    id: 'OK',
    name: 'Oklahoma',
    abbreviation: 'OK',
    path: 'M360,350 L460,340 L520,360 L510,410 L380,420 L360,380 L360,350 Z',
    center: { x: 435, y: 380 },
    neighbors: ['KS', 'MO', 'AR', 'TX', 'NM', 'CO'],
    region: 'southwest'
  },

  // Texas & Southwest
  {
    id: 'TX',
    name: 'Texas',
    abbreviation: 'TX',
    path: 'M300,380 L360,350 L380,420 L510,430 L500,520 L400,550 L320,500 L280,450 L300,380 Z',
    center: { x: 390, y: 470 },
    neighbors: ['OK', 'AR', 'LA', 'NM'],
    region: 'southwest'
  },
  {
    id: 'NM',
    name: 'New Mexico',
    abbreviation: 'NM',
    path: 'M280,310 L350,300 L380,420 L320,440 L260,400 L280,310 Z',
    center: { x: 315, y: 365 },
    neighbors: ['OK', 'TX', 'CO', 'AZ'],
    region: 'southwest'
  },
  {
    id: 'AZ',
    name: 'Arizona',
    abbreviation: 'AZ',
    path: 'M200,320 L280,310 L275,420 L200,440 L180,380 L200,320 Z',
    center: { x: 230, y: 375 },
    neighbors: ['NM', 'UT', 'NV', 'CA'],
    region: 'southwest'
  },

  // Mountain West
  {
    id: 'MT',
    name: 'Montana',
    abbreviation: 'MT',
    path: 'M220,70 L340,60 L350,140 L280,160 L210,150 L220,70 Z',
    center: { x: 280, y: 110 },
    neighbors: ['ND', 'SD', 'WY', 'ID'],
    region: 'northwest'
  },
  {
    id: 'WY',
    name: 'Wyoming',
    abbreviation: 'WY',
    path: 'M230,170 L350,160 L360,230 L280,240 L230,220 L230,170 Z',
    center: { x: 295, y: 200 },
    neighbors: ['MT', 'SD', 'NE', 'CO', 'UT', 'ID'],
    region: 'west'
  },
  {
    id: 'CO',
    name: 'Colorado',
    abbreviation: 'CO',
    path: 'M280,250 L400,240 L410,310 L290,320 L280,250 Z',
    center: { x: 340, y: 280 },
    neighbors: ['WY', 'NE', 'KS', 'OK', 'NM', 'UT'],
    region: 'west'
  },
  {
    id: 'UT',
    name: 'Utah',
    abbreviation: 'UT',
    path: 'M200,230 L280,240 L285,320 L220,340 L200,290 L200,230 Z',
    center: { x: 240, y: 285 },
    neighbors: ['WY', 'CO', 'NM', 'AZ', 'NV', 'ID'],
    region: 'west'
  },
  {
    id: 'ID',
    name: 'Idaho',
    abbreviation: 'ID',
    path: 'M170,100 L210,70 L240,100 L230,160 L200,200 L160,180 L170,100 Z',
    center: { x: 200, y: 140 },
    neighbors: ['MT', 'WY', 'UT', 'NV', 'OR', 'WA'],
    region: 'northwest'
  },

  // West Coast
  {
    id: 'WA',
    name: 'Washington',
    abbreviation: 'WA',
    path: 'M100,60 L170,50 L185,100 L150,120 L100,110 L100,60 Z',
    center: { x: 140, y: 85 },
    neighbors: ['ID', 'OR'],
    region: 'northwest'
  },
  {
    id: 'OR',
    name: 'Oregon',
    abbreviation: 'OR',
    path: 'M90,120 L170,110 L180,200 L130,210 L80,190 L90,120 Z',
    center: { x: 130, y: 160 },
    neighbors: ['WA', 'ID', 'NV', 'CA'],
    region: 'west'
  },
  {
    id: 'CA',
    name: 'California',
    abbreviation: 'CA',
    path: 'M80,200 L150,190 L200,250 L220,350 L200,450 L140,480 L100,420 L80,300 L80,200 Z',
    center: { x: 145, y: 330 },
    neighbors: ['OR', 'NV', 'AZ'],
    region: 'west'
  },
  {
    id: 'NV',
    name: 'Nevada',
    abbreviation: 'NV',
    path: 'M150,200 L200,200 L215,290 L200,370 L160,380 L140,300 L150,200 Z',
    center: { x: 175, y: 290 },
    neighbors: ['OR', 'ID', 'UT', 'AZ', 'CA'],
    region: 'west'
  },

  // Arkansas
  {
    id: 'AR',
    name: 'Arkansas',
    abbreviation: 'AR',
    path: 'M540,340 L590,330 L600,390 L575,420 L530,410 L540,340 Z',
    center: { x: 565, y: 375 },
    neighbors: ['MO', 'TN', 'MS', 'LA', 'TX', 'OK'],
    region: 'south'
  }
];

// Create a lookup map for quick access
export const STATE_MAP: Record<string, StateTerritory> = US_STATES.reduce((acc, state) => {
  acc[state.id] = state;
  return acc;
}, {} as Record<string, StateTerritory>);

// Get neighbors for a state
export function getNeighbors(stateId: string): string[] {
  return STATE_MAP[stateId]?.neighbors || [];
}

// Check if two states are adjacent
export function areAdjacent(stateId1: string, stateId2: string): boolean {
  const neighbors = getNeighbors(stateId1);
  return neighbors.includes(stateId2);
}

// Get all states in a region
export function getStatesByRegion(region: string): StateTerritory[] {
  return US_STATES.filter(state => state.region === region);
}

// Calculate distance between two states (for AI decisions)
export function getStateDistance(stateId1: string, stateId2: string): number {
  const state1 = STATE_MAP[stateId1];
  const state2 = STATE_MAP[stateId2];
  if (!state1 || !state2) return Infinity;
  
  const dx = state1.center.x - state2.center.x;
  const dy = state1.center.y - state2.center.y;
  return Math.sqrt(dx * dx + dy * dy);
}

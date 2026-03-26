'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TeamId, TerritoryState, TEAM_COLORS, TEAM_NAMES } from '@/lib/game/types';
import { STATE_MAP, US_STATES } from '@/lib/game/states';
import StateTerritory from './StateTerritory';

interface USMapProps {
  territories: Record<string, TerritoryState>;
  currentTeamId: TeamId;
  selectedTerritory: string | null;
  onTerritorySelect: (stateId: string | null) => void;
  attackOrigins?: Set<string>;
  attackTargets?: Set<string>;
  supportTargets?: Set<string>;
}

export default function USMap({
  territories,
  currentTeamId,
  selectedTerritory,
  onTerritorySelect,
  attackOrigins = new Set<string>(),
  attackTargets = new Set<string>(),
  supportTargets = new Set<string>(),
}: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const hoveredInfo = useMemo(() => {
    if (!hoveredState) {
      return null;
    }

    const stateData = STATE_MAP[hoveredState];
    const territory = territories[hoveredState];
    if (!stateData || !territory) {
      return null;
    }

    const ownerId = territory.ownerId;
    return {
      ...stateData,
      ownerId,
      ownerLabel: ownerId ? TEAM_NAMES[ownerId] : 'Neutral',
      ownerColors: ownerId ? TEAM_COLORS[ownerId] : null,
      troops: territory.troops,
      isBase: territory.isBase,
    };
  }, [hoveredState, territories]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 p-2">
      <svg viewBox="0 0 960 600" className="h-auto w-full">
        <rect x="0" y="0" width="960" height="600" fill="#020617" rx="20" />

        <g>
          {US_STATES.map((state) => {
            const territory = territories[state.id];
            if (!territory) {
              return null;
            }

            return (
              <StateTerritory
                key={state.id}
                stateData={state}
                territoryState={territory}
                isSelected={selectedTerritory === state.id}
                isAttackTarget={attackTargets.has(state.id)}
                isAttackOrigin={attackOrigins.has(state.id)}
                isSupportTarget={supportTargets.has(state.id)}
                isHovered={hoveredState === state.id}
                onClick={() => onTerritorySelect(state.id)}
                onHover={setHoveredState}
              />
            );
          })}
        </g>

        {selectedTerritory && attackTargets.size > 0 && (
          <g>
            {Array.from(attackTargets).map((targetId) => {
              const origin = STATE_MAP[selectedTerritory];
              const target = STATE_MAP[targetId];
              if (!origin || !target) {
                return null;
              }

              return (
                <motion.line
                  key={`line-${targetId}`}
                  x1={origin.center.x}
                  y1={origin.center.y}
                  x2={target.center.x}
                  y2={target.center.y}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </g>
        )}
      </svg>

      {hoveredInfo && (
        <motion.div
          className="pointer-events-none absolute left-4 top-4 rounded-lg border border-gray-700 bg-black/90 p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="font-bold text-white">{hoveredInfo.name}</span>
            <span className="text-gray-400">({hoveredInfo.abbreviation})</span>
            {hoveredInfo.isBase && <span className="text-xs text-yellow-400">★ BASE</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Owner:</span>
              <span
                className="rounded px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: hoveredInfo.ownerColors ? `${hoveredInfo.ownerColors.primary}30` : 'rgba(107,114,128,0.2)',
                  color: hoveredInfo.ownerColors?.primary || '#d1d5db',
                }}
              >
                {hoveredInfo.ownerLabel}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Troops:</span>
              <span className="font-medium text-white">{hoveredInfo.troops.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-4 rounded-lg border border-gray-700 bg-black/80 p-3">
        <div className="mb-2 text-xs text-gray-400">TEAM LEGEND</div>
        <div className="flex flex-wrap gap-4">
          {(['red', 'blue', 'green'] as TeamId[]).map((teamId) => {
            const colors = TEAM_COLORS[teamId];
            const territoriesCount = Object.values(territories).filter((territory) => territory.ownerId === teamId).length;

            return (
              <div key={teamId} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.primary }} />
                <span className={`text-xs ${teamId === currentTeamId ? 'font-semibold text-white' : 'text-white'}`}>{TEAM_NAMES[teamId]}</span>
                <span className="text-xs text-gray-500">({territoriesCount})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

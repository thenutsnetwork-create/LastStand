'use client';

import { motion } from 'framer-motion';
import { StateTerritory as StateTerritoryType, TerritoryState, TEAM_COLORS } from '@/lib/game/types';
import { cn } from '@/lib/utils';

interface StateTerritoryProps {
  stateData: StateTerritoryType;
  territoryState: TerritoryState;
  isSelected?: boolean;
  isAttackTarget?: boolean;
  isAttackOrigin?: boolean;
  isSupportTarget?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onHover?: (stateId: string | null) => void;
  showLabels?: boolean;
}

export default function StateTerritory({
  stateData,
  territoryState,
  isSelected = false,
  isAttackTarget = false,
  isAttackOrigin = false,
  isSupportTarget = false,
  isHovered = false,
  onClick,
  onHover,
  showLabels = true,
}: StateTerritoryProps) {
  const teamColors = territoryState.ownerId ? TEAM_COLORS[territoryState.ownerId] : null;

  const getFillColor = () => {
    if (!territoryState.ownerId) {
      return '#1f2937';
    }
    return teamColors?.primary || '#1f2937';
  };

  const getStrokeColor = () => {
    if (isSelected) {
      return '#ffffff';
    }
    if (isAttackTarget) {
      return '#ef4444';
    }
    if (isSupportTarget) {
      return '#60a5fa';
    }
    if (isAttackOrigin) {
      return '#fbbf24';
    }
    if (isHovered) {
      return '#9ca3af';
    }
    return '#374151';
  };

  const getStrokeWidth = () => {
    if (isSelected) {
      return 3;
    }
    if (isAttackTarget || isAttackOrigin || isSupportTarget) {
      return 2.5;
    }
    if (isHovered) {
      return 2;
    }
    return 1;
  };

  const formatTroops = (troops: number) => {
    if (troops >= 1000) {
      return `${(troops / 1000).toFixed(1)}k`;
    }
    return troops.toString();
  };

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => onHover?.(stateData.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {(isSelected || isAttackTarget || isAttackOrigin || isSupportTarget) && (
        <motion.path
          d={stateData.path}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={getStrokeWidth() + 4}
          opacity={0.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <motion.path
        d={stateData.path}
        fill={getFillColor()}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: isHovered ? 1.02 : 1 }}
        whileHover={{ fill: teamColors?.secondary || '#374151' }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: `${stateData.center.x}px ${stateData.center.y}px` }}
      />

      {territoryState.isBase && (
        <>
          <motion.circle
            cx={stateData.center.x}
            cy={stateData.center.y}
            r={12}
            fill={teamColors?.glow || 'rgba(255,255,255,0.2)'}
            animate={{ r: [10, 14, 10] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <circle
            cx={stateData.center.x}
            cy={stateData.center.y}
            r={6}
            fill={teamColors?.primary || '#ffffff'}
            stroke="#ffffff"
            strokeWidth={2}
          />
          <text
            x={stateData.center.x}
            y={stateData.center.y + 4}
            textAnchor="middle"
            fontSize="8"
            fill="#ffffff"
            fontWeight="bold"
          >
            ★
          </text>
        </>
      )}

      {showLabels && (
        <g>
          <rect
            x={stateData.center.x - 10}
            y={stateData.center.y - 8}
            width={20}
            height={16}
            fill="rgba(0,0,0,0.6)"
            rx={3}
            className={cn('transition-opacity duration-200', isHovered || isSelected ? 'opacity-100' : 'opacity-70')}
          />
          <text
            x={stateData.center.x}
            y={stateData.center.y - 2}
            textAnchor="middle"
            fontSize="8"
            fill="#ffffff"
            fontWeight="bold"
            className="pointer-events-none select-none"
          >
            {stateData.abbreviation}
          </text>
          <text
            x={stateData.center.x}
            y={stateData.center.y + 6}
            textAnchor="middle"
            fontSize="6"
            fill="#9ca3af"
            className="pointer-events-none select-none"
          >
            {formatTroops(territoryState.troops)}
          </text>
        </g>
      )}

      {isAttackTarget && (
        <motion.g>
          <motion.circle
            cx={stateData.center.x}
            cy={stateData.center.y}
            r={20}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="4 2"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${stateData.center.x}px ${stateData.center.y}px` }}
          />
        </motion.g>
      )}

      {isSupportTarget && (
        <motion.g>
          <motion.circle
            cx={stateData.center.x}
            cy={stateData.center.y}
            r={18}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={2}
            strokeDasharray="3 3"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${stateData.center.x}px ${stateData.center.y}px` }}
          />
        </motion.g>
      )}
    </g>
  );
}

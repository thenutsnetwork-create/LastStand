'use client';

import { motion } from 'framer-motion';
import { Team, TeamId, TEAM_COLORS, TEAM_NAMES } from '@/lib/game/types';
import { cn } from '@/lib/utils';
import { Users, MapPin, Layers, Crown, Skull, Loader2 } from 'lucide-react';

interface TeamPanelProps {
  team: Team;
  teamId: TeamId;
  isCurrentTurn: boolean;
  territoriesCount: number;
  totalTroops: number;
  isWinner?: boolean;
  isLoser?: boolean;
}

export default function TeamPanel({
  team,
  teamId,
  isCurrentTurn,
  territoriesCount,
  totalTroops,
  isWinner = false,
  isLoser = false
}: TeamPanelProps) {
  const colors = TEAM_COLORS[teamId];

  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all duration-300',
        isCurrentTurn
          ? 'ring-2 ring-white/50 shadow-lg'
          : '',
        isWinner
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500'
          : isLoser
          ? 'opacity-50 grayscale border-gray-700'
          : 'bg-gray-900/80'
      )}
      style={{
        borderColor: isWinner ? '#fbbf24' : isLoser ? '#374151' : colors.primary,
        boxShadow: isCurrentTurn ? `0 0 30px ${colors.glow}` : 'none'
      }}
      animate={{
        scale: isCurrentTurn ? 1.02 : 1
      }}
    >
      {/* Turn indicator */}
      {isCurrentTurn && (
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: colors.primary }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          CURRENT TURN
        </motion.div>
      )}

      {/* Winner crown */}
      {isWinner && (
        <motion.div
          className="absolute -top-3 -right-3"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </motion.div>
      )}

      {/* Loser skull */}
      {isLoser && (
        <div className="absolute -top-3 -right-3">
          <Skull className="w-6 h-6 text-gray-500" />
        </div>
      )}

      {/* Team header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-white font-bold text-lg uppercase">
            {teamId.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-white">{TEAM_NAMES[teamId]}</h3>
          <p className="text-xs text-gray-400">
            {team.isAI ? '🤖 AI Player' : '👤 Human Player'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-black/30">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
            <MapPin className="w-3 h-3" />
            <span>Territories</span>
          </div>
          <p className="text-lg font-bold text-white">{territoriesCount}</p>
        </div>

        <div className="text-center p-2 rounded-lg bg-black/30">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
            <Users className="w-3 h-3" />
            <span>Troops</span>
          </div>
          <p className="text-lg font-bold text-white">
            {totalTroops.toLocaleString()}
          </p>
        </div>

        <div className="text-center p-2 rounded-lg bg-black/30">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
            <Layers className="w-3 h-3" />
            <span>Cards</span>
          </div>
          <p className="text-lg font-bold text-white">{team.cards.length}</p>
        </div>
      </div>

      {/* AI thinking indicator */}
      {isCurrentTurn && team.isAI && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          <span className="text-sm text-purple-300">AI is thinking...</span>
        </motion.div>
      )}

      {/* Active status */}
      <div className={cn(
        'mt-3 py-1.5 px-3 rounded-full text-center text-xs font-medium',
        team.isActive
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      )}>
        {team.isActive ? '● Active' : '○ Eliminated'}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Team, TeamId } from '@/lib/game/types';
import { calculateTerritoryCount, calculateTotalTroops, formatTime } from '@/lib/game/gameLogic';
import TeamPanel from './TeamPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HelpCircle, Layers, Swords, Timer } from 'lucide-react';

interface GameHUDProps {
  teams: Record<TeamId, Team>;
  currentTeamId: TeamId;
  turnNumber: number;
  maxTurns: number;
  timeRemaining: number;
  territories: Record<string, { ownerId: TeamId | null; troops: number }>;
  deckCount: number;
  turnAction: 'attack' | 'play' | 'draw' | null;
  onDrawCard: () => void;
  onEndTurn: () => void;
  onHelp: () => void;
  canAttack: boolean;
}

export default function GameHUD({
  teams,
  currentTeamId,
  turnNumber,
  maxTurns,
  timeRemaining,
  territories,
  deckCount,
  turnAction,
  onDrawCard,
  onEndTurn,
  onHelp,
  canAttack,
}: GameHUDProps) {
  const currentTeam = teams[currentTeamId];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/90 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-black/20 p-3">
            <Swords className="h-5 w-5 text-orange-400" />
            <div>
              <div className="text-xs text-gray-400">Turn</div>
              <div className="text-xl font-bold text-white">
                {turnNumber} <span className="text-sm text-gray-500">/ {maxTurns}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-black/20 p-3">
            <Timer className={cn('h-5 w-5', timeRemaining < 60 ? 'animate-pulse text-red-400' : 'text-blue-400')} />
            <div>
              <div className="text-xs text-gray-400">Turn Timer</div>
              <div className={cn('text-xl font-bold', timeRemaining < 60 ? 'text-red-400' : 'text-white')}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-black/20 p-3">
            <Layers className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">Deck</div>
              <div className="text-xl font-bold text-white">{deckCount}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {turnAction && (
            <motion.div
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium',
                turnAction === 'attack' && 'border-red-500/30 bg-red-500/20 text-red-400',
                turnAction === 'play' && 'border-blue-500/30 bg-blue-500/20 text-blue-400',
                turnAction === 'draw' && 'border-green-500/30 bg-green-500/20 text-green-400',
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {turnAction === 'attack' && '⚔️ Attack resolved'}
              {turnAction === 'play' && '🧠 Support card used'}
              {turnAction === 'draw' && '📥 Card drawn'}
            </motion.div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onHelp}
            className="border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onEndTurn}
            disabled={!turnAction}
            className="border-orange-600 text-orange-400 hover:bg-orange-600/20 disabled:opacity-50"
          >
            End Turn
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(['red', 'blue', 'green'] as TeamId[]).map((teamId) => {
          const team = teams[teamId];
          if (!team) {
            return null;
          }

          return (
            <TeamPanel
              key={teamId}
              team={team}
              teamId={teamId}
              isCurrentTurn={currentTeamId === teamId}
              territoriesCount={calculateTerritoryCount(territories, teamId)}
              totalTroops={calculateTotalTroops(territories, teamId)}
              isLoser={!team.isActive}
            />
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/90 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="mb-1 text-lg font-bold text-white">{currentTeam.name}&apos;s Turn</h3>
            <p className="text-sm text-gray-400">
              {canAttack
                ? 'Select an attack card or play a support card. Drawing a card uses your action, then end the turn.'
                : 'No valid attacks right now. You can still play support cards or draw.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onDrawCard}
              disabled={turnAction !== null}
              className="border-purple-600 text-purple-400 hover:bg-purple-600/20 disabled:opacity-50"
            >
              <Layers className="mr-2 h-4 w-4" />
              Draw Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

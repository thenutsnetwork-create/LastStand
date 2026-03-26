'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CombatResult, TeamId, TEAM_COLORS, TEAM_NAMES } from '@/lib/game/types';
import DiceDisplay from './DiceDisplay';
import CardComponent from './Card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Sword, Shield, Trophy, Skull, Target } from 'lucide-react';

interface CombatModalProps {
  result: CombatResult;
  attackerTeamId: TeamId;
  defenderTeamId?: TeamId;
  attackerTerritoryName?: string;
  defenderTerritoryName?: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function CombatModal({
  result,
  attackerTeamId,
  defenderTeamId,
  attackerTerritoryName,
  defenderTerritoryName,
  onClose,
  isOpen
}: CombatModalProps) {
  const attackerColors = TEAM_COLORS[attackerTeamId];
  const defenderColors = defenderTeamId ? TEAM_COLORS[defenderTeamId] : null;
  const attackerName = TEAM_NAMES[attackerTeamId];
  const defenderName = defenderTeamId ? TEAM_NAMES[defenderTeamId] : 'Neutral';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl mx-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="relative px-8 py-6 border-b border-gray-800">
              <div className="flex items-center justify-center gap-4">
                <Sword className="w-8 h-8 text-red-400" />
                <h2 className="text-3xl font-bold text-white">COMBAT RESULT</h2>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              
              {/* Winner announcement */}
              <motion.div
                className={cn(
                  'absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'px-6 py-2 rounded-full font-bold text-lg',
                  result.winner === 'attacker'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : result.winner === 'defender'
                    ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                    : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                )}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {result.winner === 'attacker' && (
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> {attackerName} Wins!
                  </span>
                )}
                {result.winner === 'defender' && (
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" /> {defenderName} Defends!
                  </span>
                )}
                {result.winner === 'tie' && (
                  <span>Draw - Defender Holds</span>
                )}
              </motion.div>
            </div>

            {/* Combat content */}
            <div className="p-8 pt-12">
              {/* Teams */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                {/* Attacker */}
                <div className="text-center">
                  <div
                    className="inline-block px-4 py-2 rounded-lg mb-3"
                    style={{ backgroundColor: attackerColors.primary + '30', borderColor: attackerColors.primary, borderWidth: 2 }}
                  >
                    <span className="text-white font-bold">{attackerName}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Attacking from</p>
                  <p className="text-white font-medium">{attackerTerritoryName}</p>
                </div>

                {/* VS */}
                <div className="flex items-center justify-center">
                  <motion.div
                    className="text-4xl font-black text-gray-600"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    VS
                  </motion.div>
                </div>

                {/* Defender */}
                <div className="text-center">
                  <div
                    className="inline-block px-4 py-2 rounded-lg mb-3"
                    style={{
                      backgroundColor: defenderColors ? `${defenderColors.primary}30` : '#374151',
                      borderColor: defenderColors?.primary || '#6b7280',
                      borderWidth: 2
                    }}
                  >
                    <span className="text-white font-bold">{defenderName}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Defending</p>
                  <p className="text-white font-medium">{defenderTerritoryName}</p>
                </div>
              </div>

              {/* Dice rolls */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <DiceDisplay
                    dice={result.attackerRoll}
                    modifier={result.attackerCard?.attackModifier || 0}
                    total={result.attackerTotal}
                    isWinner={result.winner === 'attacker'}
                    label="Attacker Roll"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <DiceDisplay
                    dice={result.defenderRoll}
                    modifier={result.defenderCard?.defenseModifier || 0}
                    total={result.defenderTotal}
                    isWinner={result.winner === 'defender'}
                    label="Defender Roll"
                  />
                </div>
              </div>

              {/* Cards played */}
              {(result.attackerCard || result.defenderCard) && (
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {result.attackerCard && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-400 mb-2">Card Played</p>
                      <CardComponent card={result.attackerCard} size="small" isPlayable={false} />
                    </div>
                  )}
                  {result.defenderCard && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-400 mb-2">Card Played</p>
                      <CardComponent card={result.defenderCard} size="small" isPlayable={false} />
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Attacker losses */}
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <Skull className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Attacker Losses</p>
                  <p className="text-2xl font-bold text-red-400">-{result.attackerLosses}</p>
                </div>

                {/* Defender losses */}
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <Skull className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Defender Losses</p>
                  <p className="text-2xl font-bold text-blue-400">-{result.defenderLosses}</p>
                </div>

                {/* Territory status */}
                <div className={cn(
                  'text-center p-4 rounded-lg border',
                  result.territoryCaptured
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-500/10 border-gray-500/30'
                )}>
                  <Target className={cn(
                    'w-6 h-6 mx-auto mb-2',
                    result.territoryCaptured ? 'text-green-400' : 'text-gray-400'
                  )} />
                  <p className="text-gray-400 text-sm">Territory</p>
                  <p className={cn(
                    'text-lg font-bold',
                    result.territoryCaptured ? 'text-green-400' : 'text-gray-400'
                  )}>
                    {result.territoryCaptured ? 'CAPTURED!' : 'Held'}
                  </p>
                </div>
              </div>

              {/* Continue button */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={onClose}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-8"
                >
                  Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

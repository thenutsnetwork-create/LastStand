'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers3, MapPin, Rocket, Swords, Timer, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEAM_COLORS, TEAM_NAMES, TeamId } from '@/lib/game/types';

interface VictoryScreenProps {
  winnerId: TeamId;
  turnNumber: number;
  stats: {
    territories: number;
    troops: number;
    cardsPlayed: number;
  };
  onRestart: () => void;
}

export default function VictoryScreen({ winnerId, turnNumber, stats, onRestart }: VictoryScreenProps) {
  const winnerColors = TEAM_COLORS[winnerId];
  const winnerName = TEAM_NAMES[winnerId];

  const confetti = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        rotate: Math.random() > 0.5 ? 360 : -360,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 5,
        color: ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#a855f7'][index % 5],
      })),
    [],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 sm:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute h-3 w-3 rounded-sm"
            style={{ left: piece.left, top: '-5%', backgroundColor: piece.color }}
            animate={{ y: ['0vh', '110vh'], rotate: [0, piece.rotate], opacity: [1, 0] }}
            transition={{ duration: piece.duration, repeat: Infinity, delay: piece.delay, ease: 'linear' }}
          />
        ))}

        <motion.div
          className="absolute -right-32 top-1/4 h-96 w-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #dc2626 0%, #991b1b 50%, #450a0a 100%)',
            boxShadow: '0 0 200px rgba(220, 38, 38, 0.5)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-4xl text-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-8"
          animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Trophy className="mx-auto h-28 w-28 fill-yellow-400 text-yellow-400 drop-shadow-lg sm:h-32 sm:w-32" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="mb-2 text-2xl text-gray-400">VICTORY BELONGS TO</h2>
          <h1
            className="mb-4 text-4xl font-black drop-shadow-lg sm:text-6xl"
            style={{ color: winnerColors.primary, textShadow: `0 0 30px ${winnerColors.glow}` }}
          >
            {winnerName}
          </h1>
          <p className="mb-8 text-lg text-gray-300 sm:text-xl">
            The {winnerId.toUpperCase()} faction secured humanity&apos;s best shot at Mars.
          </p>
        </motion.div>

        <motion.div
          className="mb-8 inline-block rounded-2xl px-8 py-4"
          style={{
            background: `linear-gradient(135deg, ${winnerColors.primary}40, ${winnerColors.secondary}40)`,
            border: `2px solid ${winnerColors.primary}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl font-black text-white" style={{ backgroundColor: winnerColors.primary }}>
              {winnerId.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-white">{winnerName}</div>
              <div className="text-sm text-gray-300">Champion of the Exodus</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-orange-400" />
            <div className="text-3xl font-bold text-white">{stats.territories}</div>
            <div className="text-sm text-gray-400">Territories</div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
            <Users className="mx-auto mb-2 h-8 w-8 text-green-400" />
            <div className="text-3xl font-bold text-white">{stats.troops.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Troops</div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
            <Timer className="mx-auto mb-2 h-8 w-8 text-blue-400" />
            <div className="text-3xl font-bold text-white">{turnNumber}</div>
            <div className="text-sm text-gray-400">Turns</div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
            <Layers3 className="mx-auto mb-2 h-8 w-8 text-purple-400" />
            <div className="text-3xl font-bold text-white">{stats.cardsPlayed}</div>
            <div className="text-sm text-gray-400">Cards Played</div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Rocket className="mx-auto mb-4 h-8 w-8 text-orange-400" />
          <p className="leading-relaxed text-gray-300">
            The <strong style={{ color: winnerColors.primary }}>{winnerName}</strong> survived the collapse, dominated the final battlefield,
            and now launches toward the red planet while the defeated factions fade into the ash of the old world.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Button
            size="lg"
            onClick={onRestart}
            className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-12 py-6 text-xl font-bold text-white hover:from-orange-500 hover:to-red-500"
          >
            <Swords className="mr-3 h-6 w-6" />
            PLAY AGAIN
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

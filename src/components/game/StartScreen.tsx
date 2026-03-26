'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Rocket, Swords, Timer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameConfig } from '@/lib/game/types';
import { cn } from '@/lib/utils';

interface StartScreenProps {
  onStart: (config: GameConfig) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [playerCount, setPlayerCount] = useState(1);
  const [aiOpponents, setAiOpponents] = useState(2);
  const [maxTurns, setMaxTurns] = useState(50);
  const [turnTimeLimit, setTurnTimeLimit] = useState(900);

  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    [],
  );

  const handleStart = () => {
    onStart({
      playerCount,
      aiOpponents,
      maxTurns,
      turnTimeLimit,
    });
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} min`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 sm:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{ left: star.left, top: star.top }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}

        <motion.div
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #dc2626 0%, #991b1b 50%, #450a0a 100%)',
            boxShadow: '0 0 100px rgba(220, 38, 38, 0.3)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-10 text-center">
          <motion.div
            className="mb-6 inline-flex items-center gap-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket className="h-14 w-14 text-orange-500 sm:h-16 sm:w-16" />
          </motion.div>

          <h1 className="mb-4 text-4xl font-black text-transparent sm:text-6xl bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
            LAST STAND
          </h1>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">MARS EXODUS</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-xl">
            In the aftermath of World War 3, rival factions battle across America for the final seats on the exodus fleet to Mars.
          </p>
        </div>

        <motion.div
          className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/80 p-6 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
            <Users className="h-6 w-6 text-orange-400" />
            Game Setup
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="text-lg text-white">Human Players</Label>
              <div className="flex gap-3">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setPlayerCount(count);
                      setAiOpponents(Math.max(0, Math.min(2, 3 - count)));
                    }}
                    className={cn(
                      'flex-1 rounded-lg py-3 font-bold transition-all',
                      playerCount === count ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">How many human commanders will participate.</p>
            </div>

            <div className="space-y-4">
              <Label className="text-lg text-white">AI Opponents</Label>
              <div className="flex gap-3">
                {[0, 1, 2].map((count) => {
                  const valid = playerCount + count >= 2 && playerCount + count <= 3;
                  return (
                    <button
                      key={count}
                      onClick={() => valid && setAiOpponents(count)}
                      disabled={!valid}
                      className={cn(
                        'flex-1 rounded-lg py-3 font-bold transition-all',
                        aiOpponents === count && valid ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
                        !valid && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500">Computer-controlled commanders.</p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-lg text-white">
                <Map className="h-4 w-4" />
                Max Turns: {maxTurns}
              </Label>
              <Slider value={[maxTurns]} onValueChange={([value]) => setMaxTurns(value)} min={20} max={100} step={10} className="w-full" />
              <p className="text-sm text-gray-500">After the turn cap, the territory leader wins.</p>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-lg text-white">
                <Timer className="h-4 w-4" />
                Turn Timer: {formatTime(turnTimeLimit)}
              </Label>
              <Slider value={[turnTimeLimit]} onValueChange={([value]) => setTurnTimeLimit(value)} min={300} max={1800} step={300} className="w-full" />
              <p className="text-sm text-gray-500">Each side gets this much time per turn.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 font-bold text-white">R</div>
              <span className="font-bold text-white">New Federation</span>
            </div>
            <p className="text-xs text-gray-400">Starts in Connecticut (Northeast)</p>
            <p className="mt-1 text-xs text-red-400">👤 Human</p>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white">B</div>
              <span className="font-bold text-white">Resistance</span>
            </div>
            <p className="text-xs text-gray-400">Starts in California (West)</p>
            <p className="mt-1 text-xs text-blue-400">{playerCount >= 2 ? '👤 Human' : aiOpponents >= 1 ? '🤖 AI' : 'Inactive'}</p>
          </div>

          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600 font-bold text-white">G</div>
              <span className="font-bold text-white">Unity Coalition</span>
            </div>
            <p className="text-xs text-gray-400">Starts in Texas (South)</p>
            <p className="mt-1 text-xs text-green-400">{playerCount >= 3 ? '👤 Human' : aiOpponents >= 2 ? '🤖 AI' : 'Inactive'}</p>
          </div>
        </motion.div>

        <motion.div
          className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <Swords className="h-5 w-5 text-orange-400" />
            How to Play
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-300 md:grid-cols-2">
            <div className="flex gap-3"><span className="font-bold text-orange-400">1.</span><span>Each turn, attack with a card, play a support card, or draw.</span></div>
            <div className="flex gap-3"><span className="font-bold text-orange-400">2.</span><span>Only attack-capable cards can launch battles.</span></div>
            <div className="flex gap-3"><span className="font-bold text-orange-400">3.</span><span>Support cards can heal, reinforce, damage, or buff defense.</span></div>
            <div className="flex gap-3"><span className="font-bold text-orange-400">4.</span><span>Capture territories by winning attacks or using legendary effects.</span></div>
            <div className="flex gap-3"><span className="font-bold text-orange-400">5.</span><span>Control 30 states, outlast everyone, or trigger Mars Beacon to win.</span></div>
            <div className="flex gap-3"><span className="font-bold text-orange-400">6.</span><span>If the match times out, the player with the most territory wins.</span></div>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={handleStart}
            className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-12 py-6 text-xl font-bold text-white shadow-lg shadow-orange-500/30 hover:from-orange-500 hover:to-red-500"
          >
            <Rocket className="mr-3 h-6 w-6" />
            BEGIN EXODUS
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            {playerCount + aiOpponents} players total • {maxTurns} turns max • {formatTime(turnTimeLimit)} turn timer
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

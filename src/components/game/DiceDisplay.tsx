'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface DiceDisplayProps {
  dice: number[];
  isRolling?: boolean;
  label?: string;
  modifier?: number;
  total?: number;
  isWinner?: boolean;
}

function Die({ value }: { value: number }) {
  const dotPositions: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
  };

  const dots = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const hasDot = dotPositions[value]?.some(
        ([r, c]) => r === row && c === col
      );
      dots.push(
        <div
          key={`${row}-${col}`}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-200',
            hasDot ? 'bg-gray-900' : 'bg-transparent'
          )}
        />
      );
    }
  }

  return (
    <div
      className={cn(
        'w-16 h-16 bg-white rounded-xl shadow-lg',
        'grid grid-cols-3 grid-rows-3 gap-1 p-2',
        'border-2 border-gray-300'
      )}
    >
      {dots}
    </div>
  );
}

function RollingDie({ delay = 0 }: { delay?: number }) {
  const randomValue = useMemo(() => Math.floor(Math.random() * 6) + 1, []);
  
  return (
    <motion.div
      animate={{
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 360, 720, 1080],
      }}
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        ease: 'easeOut'
      }}
    >
      <Die value={randomValue} />
    </motion.div>
  );
}

function DiceInner({ dice, isRolling }: { dice: number[]; isRolling: boolean }) {
  if (isRolling) {
    return (
      <>
        {dice.map((_, index) => (
          <motion.div
            key={`rolling-${index}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, delay: index * 0.1 }}
          >
            <RollingDie delay={index * 100} />
          </motion.div>
        ))}
      </>
    );
  }

  return (
    <>
      {dice.map((die, index) => (
        <motion.div
          key={`final-${index}-${die}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30, delay: index * 0.1 }}
        >
          <Die value={die} />
        </motion.div>
      ))}
    </>
  );
}

export default function DiceDisplay({
  dice,
  isRolling = false,
  label,
  modifier = 0,
  total,
  isWinner = false
}: DiceDisplayProps) {
  const calculatedTotal = total ?? (dice.reduce((a, b) => a + b, 0) * (1 + modifier));

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <div className={cn(
          'text-sm font-bold uppercase tracking-wider',
          isWinner ? 'text-green-400' : 'text-gray-400'
        )}>
          {label}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          <DiceInner dice={dice} isRolling={isRolling} />
        </AnimatePresence>
      </div>

      <motion.div
        className={cn(
          'text-2xl font-bold px-4 py-1 rounded-lg',
          isWinner
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-gray-800 text-white border border-gray-700'
        )}
        initial={{ scale: 0 }}
        animate={{ scale: isRolling ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isRolling ? (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        ) : (
          <span>
            {dice.join(' + ')} = {dice.reduce((a, b) => a + b, 0)}
            {modifier !== 0 && (
              <span className="text-yellow-400 ml-1">
                ×{1 + modifier}
              </span>
            )}
            <span className="ml-2">= {Math.round(calculatedTotal)}</span>
          </span>
        )}
      </motion.div>
    </div>
  );
}

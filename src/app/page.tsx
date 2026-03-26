'use client';

import StartScreen from '@/components/game/StartScreen';
import GameBoard from '@/components/game/GameBoard';
import VictoryScreen from '@/components/game/VictoryScreen';
import { calculateTerritoryCount, calculateTotalTroops } from '@/lib/game/gameLogic';
import { useGameStore } from '@/lib/game/store';
import { GameConfig } from '@/lib/game/types';

export default function Home() {
  const { phase, initializeGame, startGame, resetGame, winner, territories, turnNumber, cardsPlayedByTeam } = useGameStore();

  const handleStart = (config: GameConfig) => {
    initializeGame(config);
    startGame();
  };

  if (phase === 'victory' && winner) {
    return (
      <VictoryScreen
        winnerId={winner}
        turnNumber={turnNumber}
        stats={{
          territories: calculateTerritoryCount(territories, winner),
          troops: calculateTotalTroops(territories, winner),
          cardsPlayed: cardsPlayedByTeam[winner],
        }}
        onRestart={resetGame}
      />
    );
  }

  if (phase === 'playing') {
    return <GameBoard />;
  }

  return <StartScreen onStart={handleStart} />;
}

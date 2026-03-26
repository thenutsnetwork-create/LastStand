'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Swords, Target, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGameStore } from '@/lib/game/store';
import {
  calculateTerritoryCount,
  calculateTotalTroops,
  canAttack,
  cardCanAttack,
  cardCanPlayAsSupport,
  cardRequiresTarget,
  cardTargetsEnemyTerritory,
  getAttackOrigins,
  getAttackTargets,
  getPlayableSupportTargets,
} from '@/lib/game/gameLogic';
import { GameState, TEAM_IDS } from '@/lib/game/types';
import { STATE_MAP } from '@/lib/game/states';
import USMap from './USMap';
import CardHand from './CardHand';
import GameHUD from './GameHUD';
import CombatModal from './CombatModal';

type InteractionMode = 'attack-origin' | 'attack-target' | 'support-target' | null;

export default function GameBoard() {
  const {
    phase,
    teams,
    territories,
    currentTeamId,
    turnNumber,
    maxTurns,
    timeRemaining,
    turnAction,
    selectedTerritory,
    selectedCard,
    combatResult,
    winner,
    deck,
    discardPile,
    showCombatModal,
    aiThinking,
    espionageActive,
    extraAttacksRemaining,
    cardsPlayedByTeam,
    teamDefenseBuffs,
    selectTerritory,
    selectCard,
    playCard,
    executeAttack,
    resolveCombat,
    closeCombatModal,
    drawCardAction,
    nextTurn,
  } = useGameStore();

  const { toast } = useToast();
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(null);
  const [attackOrigin, setAttackOrigin] = useState<string | null>(null);
  const [timer, setTimer] = useState(timeRemaining);

  const currentTeam = teams[currentTeamId];

  const gameState = useMemo<GameState>(
    () => ({
      phase,
      teams,
      territories,
      currentTeamId,
      turnNumber,
      maxTurns,
      timeRemaining,
      turnAction,
      selectedTerritory,
      selectedCard,
      combatResult,
      winner,
      deck,
      discardPile,
      showCombatModal,
      aiThinking,
      espionageActive,
      cardsPlayedByTeam,
      extraAttacksRemaining,
      teamDefenseBuffs,
    }),
    [
      aiThinking,
      cardsPlayedByTeam,
      combatResult,
      currentTeamId,
      deck,
      discardPile,
      espionageActive,
      extraAttacksRemaining,
      maxTurns,
      phase,
      selectedCard,
      selectedTerritory,
      showCombatModal,
      teamDefenseBuffs,
      teams,
      territories,
      timeRemaining,
      turnAction,
      turnNumber,
      winner,
    ],
  );

  const canAttackNow = useMemo(() => canAttack(gameState), [gameState]);

  const attackOrigins = useMemo(() => new Set(getAttackOrigins(gameState)), [gameState]);

  const attackTargets = useMemo(
    () => (attackOrigin ? new Set(getAttackTargets(gameState, attackOrigin)) : new Set<string>()),
    [attackOrigin, gameState],
  );

  const supportTargets = useMemo(
    () => (selectedCard ? new Set(getPlayableSupportTargets(gameState, selectedCard)) : new Set<string>()),
    [gameState, selectedCard],
  );

  const selectedCardCanAttack = selectedCard ? cardCanAttack(selectedCard) : false;
  const selectedCardCanSupport = selectedCard ? cardCanPlayAsSupport(selectedCard) : false;
  const selectedCardNeedsTarget = selectedCard ? cardRequiresTarget(selectedCard) : false;

  const resetLocalSelection = useCallback(() => {
    setInteractionMode(null);
    setAttackOrigin(null);
    selectTerritory(null);
    selectCard(null);
  }, [selectCard, selectTerritory]);

  const handleEndTurn = useCallback(() => {
    resetLocalSelection();
    setTimer(timeRemaining);
    nextTurn();
  }, [nextTurn, resetLocalSelection, timeRemaining]);

  const handleDrawCard = useCallback(() => {
    if (turnAction || currentTeam.isAI) {
      return;
    }
    drawCardAction();
  }, [currentTeam.isAI, drawCardAction, turnAction]);

  const handleCombatClose = useCallback(() => {
    if (combatResult) {
      resolveCombat(combatResult);
    }
    closeCombatModal();
    setTimer(timeRemaining);
  }, [closeCombatModal, combatResult, resolveCombat, timeRemaining]);

  const handleShowHelp = useCallback(() => {
    toast({
      title: 'How turns work',
      description:
        'Attack with an attack card, play a support card, or draw once and then end your turn. Control 30 states or lead the map when the turn cap hits to win.',
    });
  }, [toast]);

  useEffect(() => {
    setTimer(timeRemaining);
  }, [timeRemaining, currentTeamId, turnNumber]);

  useEffect(() => {
    if (phase !== 'playing' || showCombatModal || currentTeam.isAI) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          handleEndTurn();
          return timeRemaining;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTeam.isAI, handleEndTurn, phase, showCombatModal, timeRemaining]);

  const handleCardSelect = useCallback(
    (card: typeof selectedCard) => {
      if (!card || currentTeam.isAI) {
        return;
      }

      if (turnAction && extraAttacksRemaining <= 0) {
        return;
      }

      if (selectedCard?.id === card.id) {
        resetLocalSelection();
        return;
      }

      selectCard(card);
      selectTerritory(null);
      setAttackOrigin(null);

      if (cardCanAttack(card) && !cardCanPlayAsSupport(card)) {
        setInteractionMode('attack-origin');
        return;
      }

      if (!cardCanAttack(card) && cardCanPlayAsSupport(card) && cardRequiresTarget(card)) {
        setInteractionMode('support-target');
        return;
      }

      setInteractionMode(null);
    },
    [currentTeam.isAI, extraAttacksRemaining, resetLocalSelection, selectCard, selectTerritory, selectedCard?.id, turnAction],
  );

  const handleTerritorySelect = useCallback(
    (stateId: string | null) => {
      if (!stateId) {
        selectTerritory(null);
        setInteractionMode(null);
        setAttackOrigin(null);
        return;
      }

      if (interactionMode === 'attack-origin') {
        if (territories[stateId]?.ownerId === currentTeamId && attackOrigins.has(stateId)) {
          setAttackOrigin(stateId);
          selectTerritory(stateId);
          setInteractionMode('attack-target');
        }
        return;
      }

      if (interactionMode === 'attack-target') {
        if (attackOrigin && selectedCard && attackTargets.has(stateId)) {
          executeAttack(attackOrigin, stateId, selectedCard);
          setInteractionMode(null);
          setAttackOrigin(null);
        }
        return;
      }

      if (interactionMode === 'support-target') {
        if (selectedCard && supportTargets.has(stateId)) {
          const played = playCard(stateId);
          if (played && selectedCard.specialEffect?.type !== 'double_attack') {
            setInteractionMode(null);
          }
          if (played) {
            setAttackOrigin(null);
          }
        }
        return;
      }

      selectTerritory(stateId);
    },
    [
      attackOrigin,
      attackOrigins,
      attackTargets,
      currentTeamId,
      executeAttack,
      interactionMode,
      playCard,
      selectTerritory,
      selectedCard,
      supportTargets,
      territories,
    ],
  );

  const handleAttackClick = useCallback(() => {
    if (!selectedCard || !selectedCardCanAttack || !canAttackNow) {
      return;
    }
    setInteractionMode('attack-origin');
    setAttackOrigin(null);
    selectTerritory(null);
  }, [canAttackNow, selectTerritory, selectedCard, selectedCardCanAttack]);

  const handlePlayCardClick = useCallback(() => {
    if (!selectedCard || !selectedCardCanSupport) {
      return;
    }

    if (selectedCardNeedsTarget) {
      setInteractionMode('support-target');
      return;
    }

    const played = playCard();
    if (played && selectedCard.specialEffect?.type !== 'double_attack') {
      setInteractionMode(null);
    }
  }, [playCard, selectedCard, selectedCardCanSupport, selectedCardNeedsTarget]);

  const espionageCards = espionageActive.targetTeamId && espionageActive.remainingTurns > 0
    ? teams[espionageActive.targetTeamId]?.cards
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] space-y-4">
        <GameHUD
          teams={teams}
          currentTeamId={currentTeamId}
          turnNumber={turnNumber}
          maxTurns={maxTurns}
          timeRemaining={timer}
          territories={territories}
          deckCount={deck.length}
          turnAction={turnAction}
          onDrawCard={handleDrawCard}
          onEndTurn={handleEndTurn}
          onHelp={handleShowHelp}
          canAttack={canAttackNow}
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <motion.div
            className="rounded-xl border border-gray-800 bg-gray-900/60 p-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {interactionMode && (
              <motion.div
                className="mb-4 flex items-center justify-between rounded-lg border p-3"
                style={{
                  backgroundColor:
                    interactionMode === 'attack-origin'
                      ? 'rgba(251, 191, 36, 0.1)'
                      : interactionMode === 'attack-target'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                  borderColor:
                    interactionMode === 'attack-origin'
                      ? 'rgba(251, 191, 36, 0.3)'
                      : interactionMode === 'attack-target'
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(59, 130, 246, 0.3)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2">
                  {interactionMode === 'attack-origin' && (
                    <>
                      <Target className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400">Select one of your frontier territories.</span>
                    </>
                  )}
                  {interactionMode === 'attack-target' && (
                    <>
                      <Swords className="h-5 w-5 text-red-400" />
                      <span className="text-red-400">Select an adjacent enemy territory to attack.</span>
                    </>
                  )}
                  {interactionMode === 'support-target' && (
                    <>
                      <Wand2 className="h-5 w-5 text-blue-400" />
                      <span className="text-blue-400">
                        {selectedCard && cardTargetsEnemyTerritory(selectedCard)
                          ? 'Select an enemy territory for this card.'
                          : 'Select one of your territories for this card.'}
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetLocalSelection}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {selectedCard && (
              <motion.div
                className="mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="font-medium text-purple-400">Selected Card: </span>
                    <span className="text-white">{selectedCard.name}</span>
                    {selectedCard.attackModifier > 0 && (
                      <span className="ml-2 text-red-400">+{Math.round(selectedCard.attackModifier * 100)}% Attack</span>
                    )}
                    {selectedCard.defenseModifier > 0 && (
                      <span className="ml-2 text-blue-400">+{Math.round(selectedCard.defenseModifier * 100)}% Defense</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCardCanAttack && (
                      <Button size="sm" onClick={handleAttackClick} className="bg-red-600 hover:bg-red-500">
                        Attack With Card
                      </Button>
                    )}
                    {selectedCardCanSupport && (
                      <Button size="sm" variant="outline" onClick={handlePlayCardClick} className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10">
                        Play Card
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={resetLocalSelection} className="text-gray-300 hover:text-white">
                      Clear
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            <USMap
              territories={territories}
              currentTeamId={currentTeamId}
              selectedTerritory={interactionMode === 'attack-target' ? attackOrigin : selectedTerritory}
              onTerritorySelect={handleTerritorySelect}
              attackOrigins={interactionMode === 'attack-origin' ? attackOrigins : new Set<string>()}
              attackTargets={interactionMode === 'attack-target' ? attackTargets : new Set<string>()}
              supportTargets={interactionMode === 'support-target' ? supportTargets : new Set<string>()}
            />
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
              <h3 className="mb-3 text-lg font-bold text-white">Battlefield Status</h3>
              <div className="space-y-2">
                {TEAM_IDS.map((teamId) => {
                  const team = teams[teamId];
                  if (!team.isActive) {
                    return null;
                  }

                  return (
                    <div key={teamId} className="rounded-lg border border-gray-800 bg-black/20 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">{team.name}</span>
                        <span className="text-xs text-gray-400">{team.isAI ? 'AI' : 'Human'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                        <div>States: {calculateTerritoryCount(territories, teamId)}</div>
                        <div>Troops: {calculateTotalTroops(territories, teamId).toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
              <h3 className="mb-3 text-lg font-bold text-white">Turn Notes</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Attack cards consume a card and open combat.</p>
                <p>• Support cards can heal, reinforce, buff defense, or trigger legendary effects.</p>
                <p>• Draw a card if you need better options, then end the turn.</p>
                {extraAttacksRemaining > 0 && (
                  <p className="text-yellow-400">• Bonus attack stored: {extraAttacksRemaining}</p>
                )}
              </div>
              <div className="mt-3 rounded border border-yellow-500/30 bg-yellow-500/10 p-2">
                <p className="flex items-center gap-1 text-xs text-yellow-400">
                  <AlertTriangle className="h-3 w-3" />
                  Attacks require an attack-capable card. Support cards can be played directly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/60 p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-white">Your Hand</h3>
            <div className="text-sm text-gray-400">
              {currentTeam.cards.length} cards • {currentTeamId.toUpperCase()} turn
            </div>
          </div>
          <CardHand
            cards={currentTeam.cards}
            selectedCardId={selectedCard?.id}
            onCardSelect={handleCardSelect}
            isCurrentTurn={!currentTeam.isAI && (!turnAction || extraAttacksRemaining > 0)}
            espionageCards={espionageCards}
          />
        </motion.div>
      </div>

      {combatResult && (
        <CombatModal
          result={combatResult}
          attackerTeamId={currentTeamId}
          defenderTeamId={territories[combatResult.defenderTerritoryId]?.ownerId || undefined}
          attackerTerritoryName={STATE_MAP[combatResult.attackerTerritoryId]?.name}
          defenderTerritoryName={STATE_MAP[combatResult.defenderTerritoryId]?.name}
          isOpen={showCombatModal}
          onClose={handleCombatClose}
        />
      )}
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '@/lib/game/types';
import CardComponent from './Card';

interface CardHandProps {
  cards: CardType[];
  selectedCardId?: string | null;
  onCardSelect?: (card: CardType) => void;
  maxCards?: number;
  isCurrentTurn?: boolean;
  espionageCards?: CardType[] | null;
}

export default function CardHand({
  cards,
  selectedCardId,
  onCardSelect,
  maxCards = 10,
  isCurrentTurn = true,
  espionageCards,
}: CardHandProps) {
  const visibleCards = cards.slice(0, maxCards);
  const overflow = cards.length - maxCards;

  const horizontalSpacing = visibleCards.length >= 9 ? 28 : visibleCards.length >= 7 ? 32 : 40;
  const cardSize = visibleCards.length >= 9 ? 'small' : 'medium';
  const handHeight = cardSize === 'small' ? 'h-40 sm:h-44' : 'h-44 sm:h-48';

  return (
    <div className="relative w-full">
      <div className={`relative ${handHeight} overflow-x-clip`}>
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end justify-center">
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, index) => {
              const isSelected = selectedCardId === card.id;
              const totalCards = visibleCards.length;
              const centerIndex = (totalCards - 1) / 2;
              const offset = index - centerIndex;
              const rotation = offset * (cardSize === 'small' ? 4 : 5);
              const translateX = offset * horizontalSpacing;
              const translateY = Math.abs(offset) * (cardSize === 'small' ? 4 : 5);
              const zIndex = isSelected ? 100 : totalCards - Math.abs(offset);

              return (
                <motion.div
                  key={card.id}
                  className="absolute origin-bottom"
                  style={{ left: '50%', zIndex }}
                  initial={{ opacity: 0, y: 50, rotate: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    y: translateY,
                    x: translateX - (cardSize === 'small' ? 40 : 64),
                    rotate: rotation,
                    scale: isSelected ? 1.12 : 1,
                  }}
                  exit={{ opacity: 0, y: 100, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  whileHover={{ y: translateY - 16, scale: isSelected ? 1.12 : 1.08, zIndex: 100 }}
                  onClick={() => isCurrentTurn && onCardSelect?.(card)}
                >
                  <CardComponent
                    card={card}
                    isSelected={isSelected}
                    isPlayable={isCurrentTurn}
                    size={cardSize}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {overflow > 0 && (
        <div className="absolute bottom-2 right-4 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          +{overflow} more
        </div>
      )}

      <div className="absolute bottom-2 left-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white">
        <span className="text-gray-400">Hand:</span> {cards.length} cards
      </div>

      {espionageCards && espionageCards.length > 0 && (
        <motion.div
          className="mb-4 overflow-x-auto rounded-lg border border-purple-500 bg-purple-900/90 p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-2 flex items-center gap-1 text-xs text-purple-300">
            <span className="animate-pulse">👁</span> Enemy Hand Revealed
          </div>
          <div className="flex min-w-max gap-2">
            {espionageCards.slice(0, 5).map((card) => (
              <CardComponent key={card.id} card={card} size="small" isPlayable={false} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

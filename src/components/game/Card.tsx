'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, RARITY_COLORS } from '@/lib/game/types';
import { getRarityDisplayName, getTypeDisplayName } from '@/lib/game/gameLogic';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayable?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Eye: Icons.Eye,
  Shield: Icons.Shield,
  Heart: Icons.Heart,
  Package: Icons.Package,
  Radio: Icons.Radio,
  Hammer: Icons.Hammer,
  UserX: Icons.UserX,
  Medal: Icons.Medal,
  Tank: Icons.Car,
  Castle: Icons.Castle,
  Plane: Icons.Plane,
  Users: Icons.Users,
  Crosshair: Icons.Crosshair,
  Target: Icons.Target,
  Truck: Icons.Truck,
  Atom: Icons.Atom,
  ShieldCheck: Icons.ShieldCheck,
  Zap: Icons.Zap,
  Megaphone: Icons.Megaphone,
  Wifi: Icons.Wifi,
  AlertTriangle: Icons.AlertTriangle,
  Flame: Icons.Flame,
  Bomb: Icons.Bomb,
  Rocket: Icons.Rocket,
  Satellite: Icons.Satellite,
};

const sizeClasses = {
  small: 'w-20 h-28',
  medium: 'w-32 h-44',
  large: 'w-40 h-56'
};

const iconSizes = {
  small: 'w-6 h-6',
  medium: 'w-10 h-10',
  large: 'w-14 h-14'
};

export default function Card({
  card,
  isSelected = false,
  isPlayable = true,
  isRevealed = true,
  onClick,
  size = 'medium',
  showDetails = false
}: CardProps) {
  const IconComponent = iconMap[card.icon] || Icons.HelpCircle;
  const rarityColors = RARITY_COLORS[card.rarity];

  if (!isRevealed) {
    return (
      <motion.div
        className={cn(
          sizeClasses[size],
          'rounded-lg border-2 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900',
          'flex items-center justify-center cursor-pointer',
          'shadow-lg shadow-black/30'
        )}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <div className="relative">
          <Icons.EyeOff className={cn(iconSizes[size], 'text-gray-600')} />
          <div className="absolute inset-0 animate-pulse">
            <Icons.EyeOff className={cn(iconSizes[size], 'text-gray-500 opacity-50')} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        'rounded-lg border-2 cursor-pointer relative overflow-hidden',
        'transition-all duration-300',
        isSelected && 'ring-4 ring-white ring-opacity-80',
        !isPlayable && 'opacity-50 grayscale cursor-not-allowed'
      )}
      style={{
        borderColor: rarityColors.border,
        boxShadow: isSelected
          ? `0 0 30px ${rarityColors.glow}`
          : `0 0 15px ${rarityColors.glow}`
      }}
      whileHover={isPlayable ? { scale: 1.08, y: -10 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      onClick={isPlayable ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Card Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: rarityColors.bg }}
      />

      {/* Legendary shimmer effect */}
      {card.rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}

      {/* Card Content */}
      <div className="relative h-full flex flex-col p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            'text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
            'bg-black/30 text-white'
          )}>
            {getTypeDisplayName(card.type)}
          </span>
          <span className={cn(
            'text-[8px] font-bold uppercase',
            size === 'small' && 'text-[6px]'
          )}>
            {getRarityDisplayName(card.rarity)}
          </span>
        </div>

        {/* Icon */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={isSelected ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <IconComponent
              className={cn(
                iconSizes[size],
                'text-white drop-shadow-lg'
              )}
            />
          </motion.div>
        </div>

        {/* Card Name */}
        <div className="text-center">
          <h3 className={cn(
            'font-bold text-white leading-tight drop-shadow-md',
            size === 'small' ? 'text-[8px]' : 'text-xs'
          )}>
            {card.name}
          </h3>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-1 text-[8px]">
          {card.attackModifier > 0 && (
            <div className="flex items-center gap-0.5 text-red-400">
              <Icons.Sword className="w-2.5 h-2.5" />
              <span>+{Math.round(card.attackModifier * 100)}%</span>
            </div>
          )}
          {card.defenseModifier > 0 && (
            <div className="flex items-center gap-0.5 text-blue-400">
              <Icons.Shield className="w-2.5 h-2.5" />
              <span>+{Math.round(card.defenseModifier * 100)}%</span>
            </div>
          )}
        </div>

        {/* Special Effect Indicator */}
        {card.specialEffect && (
          <div className="absolute top-1 right-1">
            <Icons.Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>

      {/* Hover Details */}
      {showDetails && (
        <motion.div
          className="absolute left-0 right-0 bottom-full mb-2 p-3 rounded-lg bg-black/95 text-white text-xs z-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <h4 className="font-bold mb-1">{card.name}</h4>
          <p className="text-gray-300 text-[10px] leading-tight">{card.description}</p>
          {card.specialEffect && (
            <div className="mt-2 pt-2 border-t border-gray-700 text-yellow-400 text-[10px]">
              ✦ Special Effect Active
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

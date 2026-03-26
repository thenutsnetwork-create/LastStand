<div align="center">

# 🚀 Last Stand: Mars Exodus
### A cinematic turn-based territory strategy game built with **Next.js**, **React**, **Tailwind**, **Framer Motion**, and **Zustand**

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-Animated-black?style=for-the-badge&logo=framer" />
</p>

**America is collapsing.** Three factions race across the map, burn cards for tactical advantages, and fight for the final launch window off Earth.

</div>

---

## ⚔️ What this is

**Last Stand: Mars Exodus** is a fast, readable, map-driven strategy game where every turn is a meaningful choice:

- **attack** with a card
- **play** a support card
- **draw** and regroup

The goal is simple: **dominate the United States before the exodus fleet leaves for Mars**.

---

## ✨ Highlights

### Strategic card combat
- Dice-based battles with attack modifiers
- Support cards for healing, reinforcements, defense buffs, espionage, instant captures, and win-condition plays
- Legendary cards that can swing the whole board

### Territory control gameplay
- 48-state contiguous U.S. battle map
- Adjacency-based attacks
- Base states for each faction
- Territory-count and troop-count driven momentum

### Strong presentation layer
- Animated turn HUD
- Glowing faction colors
- Card fan hand display
- Combat result modal
- Cinematic start and victory screens

### Cleaner rules engine
This repo has already been cleaned up and corrected from the earlier prototype state. The underlying game flow now has:

- fresh resets
- synced team ownership data
- fixed capture troop transfers
- real timeout winner logic
- real support-card flow in the UI
- corrected hover/tooltip behavior
- cleaned dependency surface

---

## 🧠 Core rules

### Win conditions
You win by any of these:

1. **Control 30 states**
2. **Be the last faction with territory**
3. **Play Mars Beacon while holding enough territory**
4. **Lead the map when the max turn limit is reached**

### Turn flow
On your turn, you can:

- **Attack** using an attack-capable card
- **Play** a support card
- **Draw** one card, then end the turn

### Card behavior
Cards now split cleanly into two gameplay roles:

- **Attack cards**: used to launch battles
- **Support cards**: used for buffs, healing, direct damage, reinforcements, espionage, and special faction effects

---

## 🛠 Tech stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion**
- **Zustand**
- **Radix UI primitives**

---

## 📁 Project structure

```text
src/
├─ app/
│  ├─ api/route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ game/
│  │  ├─ Card.tsx
│  │  ├─ CardHand.tsx
│  │  ├─ CombatModal.tsx
│  │  ├─ DiceDisplay.tsx
│  │  ├─ GameBoard.tsx
│  │  ├─ GameHUD.tsx
│  │  ├─ StartScreen.tsx
│  │  ├─ StateTerritory.tsx
│  │  ├─ TeamPanel.tsx
│  │  ├─ USMap.tsx
│  │  └─ VictoryScreen.tsx
│  └─ ui/
│     ├─ button.tsx
│     ├─ label.tsx
│     ├─ slider.tsx
│     ├─ toast.tsx
│     └─ toaster.tsx
├─ hooks/
│  └─ use-toast.ts
└─ lib/
   ├─ game/
   │  ├─ cards.ts
   │  ├─ gameLogic.ts
   │  ├─ states.ts
   │  ├─ store.ts
   │  └─ types.ts
   └─ utils.ts
```

---

## 🚀 Local setup

### Requirements
- **Node.js 20+**
- **npm**

### Install
```bash
npm install
```

### Run in development
```bash
npm run dev
```

Then open:
```text
http://localhost:3000
```

### Production build
```bash
npm run build
npm run start
```

### Optional checks
```bash
npm run typecheck
npm run lint
```

---

## 🎮 Gameplay notes

- **Red** starts in Connecticut
- **Blue** starts in California
- **Green** starts in Texas
- The map initializes with faction bases plus neutral states
- Neutral-state troops are randomized on new game creation
- AI can attack, use certain support cards, and evaluate better targets than the earlier prototype

---

## ✅ Major fixes already applied

This repo was manually reviewed and cleaned up with a focus on **game correctness**, **state consistency**, and **repo hygiene**.

### Gameplay / state fixes
- Fixed support cards not being playable from the UI
- Fixed attacker cards incorrectly boosting defenders
- Implemented missing `double_attack` and `double_defense` effects
- Fixed troop duplication on territory capture
- Fixed territory ownership arrays drifting out of sync with the map
- Fixed resurrection/capture ownership inconsistencies
- Fixed timeout victory selecting the wrong winner
- Fixed reset state reusing stale setup data
- Added stronger attack validation in the store
- Fixed hover state typing and tooltip rendering
- Fixed timer reset logic to respect configured values
- Removed fake / misleading rules text from the interface
- Wired real card usage stats into the victory screen

### Project / codebase cleanup
- Removed unused scaffolded UI components
- Removed Bun-specific startup assumptions
- Removed dead Prisma/db scaffold
- Restored strict TypeScript-friendly project structure
- Replaced build-error suppression config
- Re-enabled React strict mode
- Added a proper `tsconfig.json` with `@/*` path alias support
- Simplified the dependency list to match the real app surface

---

## 🧪 Manual review philosophy

This version was cleaned up through a **manual code review pass**, not browser automation.

That means the focus was on:
- rules correctness
- state transitions
- edge-case logic
- type/config hygiene
- repo cleanup for easier handoff

---

## 🌌 Future ideas

Good next upgrades for this project:

- Better AI heuristics and personality differences
- Sound design and music
- Match history / combat log
- Save/load persistence
- Multiplayer / async turns
- Additional cards, factions, and alternate maps
- Mobile-specific hand layout polish

---

## 📡 API

A tiny status endpoint is included for local checks:

```text
GET /api
```

Example response:

```json
{
  "name": "Last Stand: Mars Exodus",
  "status": "ok",
  "mode": "local-dev"
}
```

---

## 📦 GitHub upload

This repo is already structured so you can:

1. unzip it
2. drag it into a fresh GitHub repo
3. push it normally

No extra cleanup should be needed first.

---

## 🪐 Final pitch

If you want a strategy prototype that **looks much better than a debug build** and now has a much more trustworthy rules layer underneath it, this is a solid base to keep building on.

**Mars is waiting.**

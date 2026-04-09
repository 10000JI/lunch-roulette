---
phase: 02-core-interaction
plan: 02
subsystem: roulette-wheel
tags: [react, canvas, animation, hooks]
dependency_graph:
  requires: [01-01, 02-01]
  provides: [RouletteWheel, useRoulette]
  affects: [02-03]
tech_stack:
  added: []
  patterns: [requestAnimationFrame-loop, useRef-for-animation, HiDPI-canvas]
key_files:
  created:
    - src/hooks/useRoulette.ts
    - src/components/RouletteWheel.tsx
  modified: []
decisions:
  - Max 10 segments limit for canvas performance (T-02-03 mitigation)
  - Refs for animation values, useState only for UI-affecting state
  - 500ms delay before onComplete callback for highlight visibility
metrics:
  duration: 95s
  completed: "2026-04-09T02:04:06Z"
---

# Phase 2 Plan 2: Roulette Wheel and Spin Physics Summary

Canvas-based spinning wheel with pastel segments, emoji+name labels, exponential deceleration (0.985 friction), HiDPI rendering, and winner detection with highlight effect.

## What Was Built

### useRoulette Hook (`src/hooks/useRoulette.ts`)
- Manages spin animation via requestAnimationFrame loop
- Exponential deceleration: velocity *= 0.985 per frame (5-8 second spin duration)
- HiDPI canvas rendering with devicePixelRatio scaling
- 8-color pastel palette cycling across segments
- Category emoji + truncated restaurant name labels on each segment
- Top-center red pointer triangle drawn on top of wheel
- Winner calculation from final angle (accounts for clockwise rotation + top pointer)
- Winner segment highlight effect with brightened color, 500ms delay before callback
- Animation refs (angle, velocity, animFrame) to avoid stale closures
- Max 10 segments enforced for performance (threat T-02-03 mitigation)
- Cleanup: cancelAnimationFrame on unmount

### RouletteWheel Component (`src/components/RouletteWheel.tsx`)
- Wraps useRoulette hook with responsive canvas element
- Canvas sized via Tailwind (max-w-[340px] aspect-square), pixel dimensions handled by hook
- touch-action: none to prevent mobile scroll interference during spin
- Large blue "돌리기!" button disabled during spinning or when no restaurants
- Empty state: "카테고리를 선택해주세요" when no restaurants available
- Resets wheel when restaurant list changes (new category selected)

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Max 10 segments | Prevents canvas performance issues with too many draw calls (T-02-03) |
| useRef for animation values | Avoids React re-renders during 60fps animation loop (Architecture anti-pattern #2) |
| 500ms highlight delay | Lets user see the winning segment before modal appears |
| Pastel 8-color palette | Enough variety for 10 segments while maintaining minimal aesthetic |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 92debb7 | Create useRoulette spin physics hook with HiDPI canvas rendering |
| 2 | f897c75 | Create RouletteWheel component with canvas and spin button |

## Verification

- TypeScript compilation: PASSED (both tasks, zero errors)
- All acceptance criteria grep checks: PASSED
- Both files ready for App.tsx integration in Plan 03

## Self-Check: PASSED

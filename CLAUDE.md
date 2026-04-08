# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Lunch Roulette (점심 룰렛)** - 회사 주변 식당을 자동으로 찾아 룰렛으로 랜덤 선택해주는 웹 앱. 바이브코딩 라이브 데모용 미니 프로젝트.

## 기술 스택

- React + Vite + TypeScript
- Tailwind CSS
- Google Places API (New)

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 실행 (Vite)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
```

## 환경변수

- `VITE_GOOGLE_PLACES_API_KEY` — Google Places API 키 (.env 파일에 설정)
- API 키 없이도 mock 데이터 fallback으로 동작해야 함

## 아키텍처 핵심 사항

- 브라우저 Geolocation API로 현재 위치 감지 → Google Places API로 주변 식당 조회
- 카테고리 필터 지원: 한식, 중식, 일식, 양식 등
- 룰렛 UI: Canvas 또는 CSS 기반 스피닝 휠 애니메이션 (부드러운 감속 효과 필수)
- 모바일 반응형 필수, 다크모드 지원 보너스

## 개발 방법론

- GSD 스펙 기반 개발: `/gsd-new-project` → `/gsd-plan-phase` → `/gsd-execute-phase`
- 코드 리뷰: `/gsd-code-review`
- 브라우저 테스트: Playwright MCP 서버 연동

## 제약사항

- 30~40분 내 완성 가능한 범위로 스코프 유지
- mock 데이터 fallback 필수 (API 키 없어도 동작)

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Lunch Roulette (점심 룰렛)**

회사 주변 식당을 위치 기반으로 자동 검색하고, 카테고리별로 분류한 뒤 룰렛으로 랜덤 선택해주는 웹 앱. 점심 메뉴 고민을 재미있게 해결하는 바이브코딩 라이브 데모용 미니 프로젝트.

**Core Value:** 카테고리를 선택하면 주변 식당으로 구성된 룰렛이 돌아가서 오늘의 점심 식당을 골라주는 것.

### Constraints

- **Tech Stack**: React + Vite + TypeScript + Tailwind CSS — PROJECT_BRIEF에서 확정
- **Timeline**: 30~40분 내 완성 가능한 범위 — 라이브 데모용
- **API**: Google Places API (New) — 환경변수 관리, mock fallback 필수
- **Design**: 미니멀 + 깨끗한 UI — 사용자 선호
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI framework | Confirmed in project constraints. React 19 is stable with improved performance and excellent ecosystem. |
| Vite | 8.0.7 | Build tool / dev server | Confirmed in constraints. Near-instant HMR, native ESM, zero-config for React+TS. Vite 8 is current stable. |
| TypeScript | 6.0.2 | Type safety | Confirmed in constraints. TS 6.x is current stable, catches bugs at compile time. |
| Tailwind CSS | 4.2.2 | Utility-first CSS | Confirmed in constraints. v4 uses CSS-first config (no tailwind.config.js), faster builds, native @theme directive. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitejs/plugin-react | 6.0.1 | Vite React integration | Always -- required for JSX transform and React Fast Refresh. |
| @tailwindcss/vite | 4.2.2 | Tailwind CSS Vite plugin | Always -- Tailwind v4 integrates via Vite plugin instead of PostCSS. |
| canvas-confetti | 1.9.4 | Confetti celebration effect | On roulette result -- lightweight (< 5KB gzipped), zero-dependency. |
### Google Places API Integration
- `POST https://places.googleapis.com/v1/places:searchNearby` -- find restaurants by location + type
- Fields: places.displayName, places.rating, places.priceLevel, places.location, places.formattedAddress
### Spinning Wheel (Roulette)
| Approach | Recommendation | Why |
|----------|---------------|-----|
| Custom Canvas implementation | **RECOMMENDED** | Full control over appearance, animation, easing. ~150-200 lines. |
| spin-wheel (5.0.2) | Acceptable alternative | Well-maintained. Use if time is very tight. |
| react-custom-roulette (1.4.1) | DO NOT USE | Abandoned since April 2023. No React 19 support. |
## Installation
### Vite Config
### Tailwind v4 Setup
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-custom-roulette | Abandoned since April 2023 | Custom Canvas wheel or spin-wheel v5 |
| Google Maps JavaScript API (full map rendering) | 200KB+ bundle for map rendering not needed | importLibrary('places') for Places API only (CORS-safe, lightweight) |
| PostCSS + autoprefixer | Tailwind v4 uses @tailwindcss/vite plugin directly | @tailwindcss/vite plugin |
| Create React App (CRA) | Officially deprecated | Vite with react-ts template |
| Axios | 13KB for calls fetch handles natively | Native fetch API |
| Redux/Zustand/Jotai | Overkill. ~3 pieces of state total | React useState + prop drilling |
## Stack Patterns by Variant
## Sources
- npm registry (direct npm view queries) -- all versions verified 2026-04-08
- Google Places API (New) documentation
- Tailwind CSS v4 release documentation
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

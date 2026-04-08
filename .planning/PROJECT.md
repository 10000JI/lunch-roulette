# Lunch Roulette (점심 룰렛)

## What This Is

회사 주변 식당을 위치 기반으로 자동 검색하고, 카테고리별로 분류한 뒤 룰렛으로 랜덤 선택해주는 웹 앱. 점심 메뉴 고민을 재미있게 해결하는 바이브코딩 라이브 데모용 미니 프로젝트.

## Core Value

카테고리를 선택하면 주변 식당으로 구성된 룰렛이 돌아가서 오늘의 점심 식당을 골라주는 것.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 브라우저 Geolocation API로 현재 위치 자동 감지
- [ ] 카테고리 필터 선택 (한식, 중식, 일식, 양식 등)
- [ ] 선택한 카테고리의 주변 식당 목록 표시 (가까운 순 정렬)
- [ ] 식당 카드에 식당명, 평점, 거리, 가격대 표시
- [ ] 스피닝 휠 룰렛 애니메이션 (부드러운 감속 효과)
- [ ] 당첨 시 효과 (하이라이트)
- [ ] 결과 카드에 식당 상세 정보 표시
- [ ] Google Places API (New)로 주변 식당 실제 데이터 조회
- [ ] API 키 없을 때 mock 데이터 fallback (총 10개 내외)
- [ ] 모바일 반응형 UI

### Out of Scope

- 사용자 인증/로그인 — 데모용 미니 프로젝트, 불필요
- 식당 즐겨찾기/히스토리 저장 — 30~40분 범위 초과
- 다크모드 — 보너스이나 v1 범위 밖
- 지도 연동 표시 — 결과 카드에 지도 링크 불필요 (사용자 선택)
- 메뉴판/대표 메뉴 표시 — v1에서는 기본 정보(이름, 평점, 거리, 가격대)에 집중

## Context

- 바이브코딩 라이브 데모용으로 30~40분 내 완성이 목표
- Google Places API (New) 사용, 환경변수 `VITE_GOOGLE_PLACES_API_KEY`로 관리
- `.env` 파일에 API 키 저장 (git 제외)
- 깨끗하고 미니멀한 디자인 지향

## Constraints

- **Tech Stack**: React + Vite + TypeScript + Tailwind CSS — PROJECT_BRIEF에서 확정
- **Timeline**: 30~40분 내 완성 가능한 범위 — 라이브 데모용
- **API**: Google Places API (New) — 환경변수 관리, mock fallback 필수
- **Design**: 미니멀 + 깨끗한 UI — 사용자 선호

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 카테고리 선택 후 룰렛 구성 | 사용자가 원하는 음식 종류를 먼저 좁힌 뒤 랜덤 선택 | — Pending |
| 결과 카드: 식당명+평점+거리+가격대 | 사진/메뉴 없이 핵심 정보만으로 미니멀하게 | — Pending |
| Canvas 기반 스피닝 휠 | CSS보다 부드러운 애니메이션과 커스터마이징 가능 | — Pending |
| Mock 데이터 총 10개 내외 | 데모에 충분한 최소 규모 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-08 after initialization*

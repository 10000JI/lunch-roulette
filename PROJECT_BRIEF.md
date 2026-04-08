# Lunch Roulette - 점심 룰렛

## 프로젝트 개요
회사 주변 식당을 자동으로 찾아 룰렛으로 랜덤 선택해주는 웹 앱.
바이브코딩 라이브 데모용 미니 프로젝트.

## 핵심 기능

### 1. 위치 기반 식당 검색
- 브라우저 Geolocation API로 현재 위치 자동 감지
- Google Places API (New)로 주변 식당 조회
- 카테고리 필터: 한식, 중식, 일식, 양식 등

### 2. 식당 리스트 뷰
- 카테고리 선택 후 해당 카테고리의 주변 식당 목록 표시
- 현재 위치에서 가까운 순으로 정렬
- 식당별 기본 정보 (식당명, 평점, 거리, 가격대) 카드 형태로 표시

### 3. 룰렛 UI
- 스피닝 휠 애니메이션 (Canvas 또는 CSS)
- 부드러운 감속 효과
- 당첨 시 효과 (confetti, 하이라이트 등)

### 4. 결과 카드
- 식당명
- 카테고리 (한식/중식/일식/양식 등)
- 메뉴판 / 대표 메뉴
- 가격대
- 평점 (별점)
- 거리
- 식당 사진 (있으면)

## 기술 스택
- **프론트엔드**: React + Vite + TypeScript
- **스타일링**: Tailwind CSS
- **API**: Google Places API (New)
- **배포**: 로컬 개발 서버 (데모용)

## API 설정
- Google Places API Key: 환경변수 `VITE_GOOGLE_PLACES_API_KEY`로 관리
- `.env` 파일에 저장 (git 제외)

## 개발 방법론
- **GSD (Get Shit Done)** 스펙 기반 개발
- `/gsd-new-project` → `/gsd-plan-phase` → `/gsd-execute-phase` 흐름
- 1차 리뷰: `/gsd-code-review`
- 2차 리뷰: Codex CLI (별도 터미널)
- 테스트: Chrome 연동 (`/chrome`)으로 실제 브라우저 시연

## 멀티 세션 구성
- 터미널 1: Claude Code - 메인 개발
- 터미널 2: Claude Code - Chrome 브라우저 테스트
- 터미널 3: Codex CLI - 2차 코드 리뷰

## 디자인 요구사항
- 모바일 대응 (반응형)
- 애니메이션이 핵심 — 룰렛 돌아가는 게 이뻐야 함
- 심플하고 직관적인 UI
- 다크모드 지원하면 보너스

## 제약사항
- 30~40분 내 완성 가능한 범위
- 커밋 불필요 (데모 후 정리만)
- mock 데이터 fallback 지원 (API 키 없어도 동작)

# 🎰 점심 룰렛 (Lunch Roulette)

회사 주변 식당을 자동으로 찾아 룰렛으로 랜덤 선택해주는 웹 앱.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-cyan)

## 주요 기능

- **위치 기반 식당 검색** — 브라우저 GPS로 현재 위치 자동 감지, Google Places API로 주변 식당 조회
- **카테고리 필터** — 한식, 중식, 일식, 양식, 기타 중 선택
- **룰렛 스피닝 휠** — Canvas 기반 파스텔 배색 룰렛, 지수 감속 애니메이션
- **정렬 옵션** — 인기순 / 거리순 토글
- **반경 선택** — 100m, 200m, 500m, 1km 거리별 필터
- **결과 모달** — 당첨 식당 정보 (이름, 평점, 거리) + Google Maps 링크
- **식당 리스트** — 룰렛 아래 카드 목록, 클릭 시 Google Maps 이동
- **모바일 반응형** — 모바일 우선 레이아웃, dvh 뷰포트
- **Mock 데이터 fallback** — API 키 없이도 동작

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경변수

```bash
# .env 파일 생성
cp .env.example .env

# Google Places API 키 입력
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
```

API 키 없이도 mock 데이터로 동작합니다.

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 프레임워크 |
| Vite | 8 | 빌드 도구 / 개발 서버 |
| TypeScript | 6 | 타입 안정성 |
| Tailwind CSS | 4 | 스타일링 |
| Google Places API | - | 주변 식당 검색 |
| Canvas API | - | 룰렛 휠 렌더링 |

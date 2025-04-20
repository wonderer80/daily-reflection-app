# 📘 데일리 리플렉션 앱 PRD (Product Requirements Document)

## 1. 개요

이 앱은 사용자가 매일 자신의 컨디션과 심리 상태를 스스로 점검하고 간단한 저널을 작성함으로써, 삶의 만족도와 심리적 흐름을 꾸준히 관리할 수 있도록 돕는 웹 기반 도구입니다.

---

## 2. 목표

- 매일 자기 상태를 짧은 시간 안에 점검할 수 있게 한다.
- ORS (Outcome Rating Scale) 4가지 지표를 통해 주관적인 삶의 만족도를 수치화한다.
- 날짜별 입력된 데이터를 저장하고, 다시 불러올 수 있게 한다.

---

## 3. 주요 기능 (MVP)

### 3.1 ORS 점수 기록
- **4개의 항목**: Self, Interpersonal, Social, Overall
- 각각 0~10까지의 슬라이더 입력

### 3.2 저널 입력
- 짧은 텍스트를 자유롭게 작성할 수 있는 멀티라인 입력칸

### 3.3 날짜 선택 및 자동 로딩
- 오늘 날짜 기준으로 자동 입력 시작
- 다른 날짜 선택 시, 해당 날짜의 기존 데이터가 있으면 자동으로 불러옴

### 3.4 저장 기능
- 저장 시 Firebase Firestore에 해당 데이터를 추가로 기록
- 중복 날짜 선택 시에도 덮어쓰기 대신 신규 document로 저장됨

---

## 4. 기술 스택

- **Frontend**: React + TypeScript
- **스타일링**: TailwindCSS
- **DB**: Firebase Firestore
- **호스팅 예정**: Firebase Hosting, Netlify 또는 Vercel

---

## 5. Firestore 데이터 구조

컬렉션: `entries`

```ts
{
  date: Timestamp,          // 선택된 날짜
  self: number,             // ORS 점수: Self
  interpersonal: number,    // ORS 점수: Interpersonal
  social: number,           // ORS 점수: Social
  overall: number,          // ORS 점수: Overall
  journal: string,          // 일기
  createdAt: Timestamp      // 저장 시각
}
```

날짜 기준으로 검색 시, `date >= 당일 00:00` && `date <= 당일 23:59` 범위로 쿼리 수행

---

## 6. 사용자 경험 기준

- 실행 시 바로 오늘 날짜에 대한 기록을 시작할 수 있어야 함
- 기록은 1분 이내로 끝낼 수 있는 간편한 경험
- 데이터 저장 후 사용자에게 확인 메시지 제공 (alert)
- 모바일/데스크톱 모두 대응하는 반응형 UI

---

## 7. 향후 기능 확장 아이디어

- 기록된 ORS의 주간/월간 그래프 시각화
- 로그인 기능 추가 (Google, 이메일 등)
- 매일 알림/푸시 기능 (PWA 또는 캘린더 연동)
- 데이터 CSV/PDF 내보내기 기능
- 사용자의 심리 흐름 분석 및 통계 제공

---

## 8. 성공 지표

- 최근 한달 중 20일 이상 기록을 한다
- 최근 한달동안 ORS 4개 항목의 합계가 40점 만점 중 평균 25점 이상인 날이 60% 이상일 경우가 유지된다

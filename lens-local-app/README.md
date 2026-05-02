# LENS — 로컬 MVP 데모

Skills.md 기반 투자 데이터 분석 대시보드 · DACON 해커톤 제출용 로컬 MVP

---

## 실행 방법

```bash
cd lens-local-app
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

빌드 검증:
```bash
npm run build
```

---

## 데모 흐름 (7단계)

```
업로드 → 컬럼 매핑 → 분석 목적 → 충분성 판정 → 대시보드 → AI 패널 → Skills Log
```

### Step 1: 업로드 (SCR-01)
- CSV / XLSX 파일을 드래그하거나 클릭하여 업로드
- 파일명, 행 수, 열 수 자동 표시

### Step 2: 컬럼 매핑 (SCR-02)
- 상위 5행 미리보기 테이블
- RULE-CM-001 기반 컬럼 범주 자동 추론
- 신뢰도 표시 (높음/보통/낮음)
- 보통/낮음 항목은 드롭다운으로 수동 수정 가능
- "매핑 확정" 버튼으로 확정

### Step 3: 분석 목적 (SCR-03)
- 자연어 텍스트 입력 또는 빠른 선택 카드
- 카드: 성과 분석 / 위험 분석 / 비중 분석 / 전체 진단
- 모호한 입력 감지 시 카드 선택 유도

### Step 4: 충분성 판정 (SCR-04)
- RULE-DS-001~006 기반 결정적 판정
- 항목별 가능 / 제한적 가능 / 불가 표시
- 불가 항목: 필요 컬럼 및 사유 명시
- "가능한 분석으로 진행" 버튼

### Step 5: 대시보드 (SCR-05)
- 좌측 패널: 대시보드 카드 + 차트
- 우측 패널: AI Analyst Panel (rule-based mock)
- 하단 토글: Skills Log 패널

---

## 샘플 데이터로 데모하기

### 샘플 1: `sample-data/daily_returns_sample.csv`

```
date,portfolio_return,benchmark_return
2024-01-02,0.0045,-0.0012
...
```

- 63 거래일 (2024-01-02 ~ 2024-03-29)
- 컬럼: date, portfolio_return, benchmark_return
- 가능한 분석: 누적 수익률, 구간 수익률, MDD, 연환산 변동성, 벤치마크 비교

**추천 데모 경로:**
1. `daily_returns_sample.csv` 업로드
2. 컬럼 매핑 확인 (date=날짜, portfolio_return=수익률, benchmark_return=벤치마크 수익률 자동 추론)
3. 분석 목적: "전체 진단" 선택
4. 충분성 판정: 5항목 가능, 비중 분석만 불가 (weight 컬럼 없음)
5. 대시보드에서 누적 수익률 차트 + 벤치마크 비교 확인
6. AI Analyst Panel에서 rule-based 해석 확인
7. 하단 Skills Log에서 RULE-CM-001, RULE-DS-001~006, RULE-AN-001~003 적용 확인

---

### 샘플 2: `sample-data/holdings_sample.csv`

```
date,ticker,name,weight,daily_return
2024-01-02,005930,삼성전자,0.35,0.0052
...
```

- 18 주간 스냅샷 × 5 종목 = 90행
- 컬럼: date, ticker, name, weight, daily_return
- 날짜당 여러 행 → 가중 평균 수익률로 자동 집계
- 가능한 분석: 누적 수익률, 구간 수익률, MDD, 연환산 변동성, 비중 분석

**추천 데모 경로:**
1. `holdings_sample.csv` 업로드
2. 컬럼 매핑: ticker=종목코드, name=종목명, weight=비중, daily_return=수익률 확인
3. 분석 목적: "비중 분석" 또는 "전체 진단"
4. 충분성 판정: 비중 분석 가능, 벤치마크 비교 불가 확인
5. 대시보드: 비중 파이 차트 + 누적 수익률 확인

---

## 구현 기능 요약

| 기능 | 상태 | Rule ID |
|------|------|---------|
| CSV 파싱 | ✓ 구현 | – |
| XLSX 파싱 | ✓ 구현 | – |
| 컬럼 매핑 추론 | ✓ rule-based heuristic | RULE-CM-001~003 |
| 데이터 충분성 판정 | ✓ 결정적 | RULE-DS-001~006 |
| 누적 수익률 계산 | ✓ 결정적 | RULE-AN-001 |
| MDD 계산 | ✓ 결정적 | RULE-AN-002 |
| 연환산 변동성 | ✓ 결정적 | RULE-AN-003 |
| 구간 수익률 (월별) | ✓ 결정적 | RULE-AN-001 |
| 비중 집계 | ✓ 결정적 | RULE-DS-005 |
| 벤치마크 비교 | ✓ 결정적 | RULE-DS-006 |
| 다중 행/날짜 집계 | ✓ 가중 평균 | – |
| Equity Curve 차트 | ✓ Recharts 선 차트 | RULE-VZ-001 |
| Drawdown 차트 | ✓ Recharts 영역 차트 | RULE-VZ-002 |
| 비중 파이 차트 | ✓ Recharts 파이 차트 | RULE-VZ-003 |
| 벤치마크 비교 차트 | ✓ Recharts 멀티시리즈 | RULE-VZ-004 |
| AI Analyst Panel | ✓ rule-based mock (LLM 없음) | RULE-IN-001~005 |
| 투자 권유 금지 | ✓ 템플릿 내 적용 | RULE-PO-001 |
| Skills Log 패널 | ✓ 5개 탭 | 전체 |
| StatusBar | ✓ 단계 표시 | – |

---

## Mock/미구현 항목 (P1 이상)

- LLM API 연동 (현재: rule-based template)
- Sharpe Ratio, Sortino Ratio
- HHI 집중도 분석
- 다중 파일 업로드
- 거래 내역 성과 계산
- 트리맵 시각화
- 대시보드 내보내기 (PDF/이미지)
- 실시간 시세 연동
- 사용자 인증/세션 저장

---

## 기술 스택

- Vite + React 18 + TypeScript
- Tailwind CSS
- Recharts 2.x
- papaparse (CSV 파싱)
- xlsx (Excel 파싱)
- Zustand (상태 관리)

---

## 프로젝트 구조

```
lens-local-app/
├── src/
│   ├── App.tsx               # 단계별 화면 라우팅
│   ├── store/appStore.ts     # Zustand 전역 상태
│   ├── types/index.ts        # TypeScript 타입 정의
│   ├── utils/
│   │   ├── columnMapping.ts  # RULE-CM-xxx: 컬럼 추론 heuristic
│   │   ├── financialCalc.ts  # RULE-AN-xxx: 결정적 수치 계산
│   │   ├── sufficiency.ts    # RULE-DS-xxx: 충분성 판정
│   │   └── insightRules.ts   # RULE-IN-xxx: rule-based 해석 생성
│   ├── screens/              # 5개 단계 화면
│   └── components/           # StatusBar, AnalystPanel, SkillsLogPanel
├── sample-data/
│   ├── daily_returns_sample.csv
│   └── holdings_sample.csv
└── README.md
```

---

## 다음 단계 제안 (P1)

1. **LLM 연동**: Analyst Panel의 rule-based 해석을 Claude API로 교체 (RULE-PO-001 가드레일 유지)
2. **Sharpe Ratio**: RULE-AN-004 추가 (무위험 수익률 입력 필요)
3. **다중 파일**: 포트폴리오 vs 기준 파일 비교
4. **내보내기**: 대시보드 PDF 캡처
5. **Skills.md 파일 직접 로드**: 런타임에 Skills.md 규칙 파일을 파싱하여 규칙 갱신 가능

---

*LENS — Skills.md 기반 투자 데이터 분석 · DACON 해커톤 로컬 MVP*

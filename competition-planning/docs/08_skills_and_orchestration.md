# 08. Skills.md 설계 및 AI 오케스트레이션 정의서 — Skillfolio

작성일: 2026-04-30
작성 기준: 00_strategy_memo.md, 02_product_concept.md, 03_prd.md, 04_use_cases.md, 05_user_flow.md, 06_screen_and_feature_spec.md, reviews/review_A_resolution.md, source/reference_index.md 전량 검토 완료

> **문서 규칙:** 이 문서는 Stage 8(Skills.md 설계)과 Stage 9(AI 오케스트레이션)를 통합한 압축 산출물이다. Skills.md 규칙 설계와 AI 모듈 협력 구조를 정의한다. P0 경계는 review_A_resolution.md의 확정 목록을 따른다. AI 관련 서술은 투자 권유, 미래 수익률 전망, 인과 관계 단정을 포함하지 않는다.

---

## 섹션 1. 문서 목적

이 문서는 다음 세 가지를 정의한다.

1. **Skills.md가 대시보드 생성을 어떻게 제어하는가** — 규칙 영역, 규칙 스키마, 구체적 규칙 예시
2. **AI 모듈(에이전트)이 어떻게 협력하는가** — 9개 모듈의 입력·출력·규칙 의존성·실패 처리
3. **결정적 처리와 AI 보조 처리의 경계는 어디인가** — 재현성 계약의 범위

Skills.md는 공모전 평가의 핵심 항목(Skills.md 설계, 25점)과 직접 대응한다. 이 문서는 "Skills.md가 실제로 대시보드를 제어했다"는 근거를 심사위원에게 제시하기 위한 설계 명세서다.

---

## 섹션 2. 왜 Skills.md가 핵심인가

Skills.md는 설명 문서가 아니다. 분석 파이프라인 전체의 판단 기준을 사전 정의하는 **규칙 명세서**다.

| 기존 도구의 한계 (기획 해석) | Skillfolio의 대응 |
|--------------------------|-----------------|
| 범용 AI 도구는 프롬프트마다 분석 방식이 달라질 수 있다 (Microsoft 공식 문서도 Copilot 출력의 비결정성을 명시) | Skills.md에 계산 공식·임계값·차트 선택 기준을 사전 정의 → 동일 입력에서 결정적 출력 |
| 기존 금융 서비스는 고정 스키마를 요구한다 | Skills.md 컬럼 매핑 규칙이 비정형 CSV 컬럼명을 분석 의미 단위로 추론 |
| 분석 근거가 사용자에게 노출되지 않는다 | Skills 로그가 규칙 ID·입출력·판정 근거를 기록하고 대시보드와 함께 표시 |

Skills 로그는 "Skills.md가 실제로 작동했다"는 공모전 제출 증거물이다.

---

## 섹션 3. Skills.md 역할 표

| 규칙 영역 | 목적 | 예시 | 연관 화면 | 연관 로그 |
|---------|------|------|---------|---------|
| 컬럼 매핑 규칙 | 비정형 컬럼명을 분석 의미 단위로 추론 | "수익률", "returns", "pnl" → return 범주 | SCR-02 | Column Mapping Log |
| 목적 명확화 규칙 | 모호한 목적 입력을 분석 가능 범주로 변환 | "포트폴리오 봐줘" → 성과·위험·비중 후보 제시 | SCR-03 | (직접 로그 없음, GC 흐름) |
| 데이터 충분성 규칙 | 분석 항목별 필요 컬럼·기간 조건 정의 | MDD 계산 → 일별 수익률 컬럼 필수, 기간 ≥30 거래일 | SCR-04 | Sufficiency Check Log |
| 지표 계산 규칙 | 각 지표의 계산 공식·거래일수 기준 명세 | 연환산 변동성 = std(일별 수익률) × √252 | SCR-05 | Metric Calculation Log |
| 시각화 선택 규칙 | 데이터 유형·분석 목적별 차트 유형 결정 | 시계열 수익률 → 선 차트, 비중 → 파이/바 차트 | SCR-05 | Visualization Rule Log |
| 인사이트 템플릿 규칙 | 위험 판정 임계값 및 해석문 템플릿 정의 | MDD < -20% → 위험 레이블 "주의", 해석 템플릿 참조 | SCR-06 | Insight Rule Log |
| 금지 표현 규칙 | AI 출력에서 허용되지 않는 표현 유형 정의 | 투자 권유·미래 수익 전망·인과 단정 금지 | SCR-06 | Insight Rule Log |
| 재현성 계약 규칙 | 결정적 출력 보장 조건 및 비결정 구간 명시 | 동일 파일+매핑+Skills.md → 수치 지표 재현 | SCR-05~07 전체 | Metric/Visualization Log |

---

## 섹션 4. Skills.md 구조 (제안 개요)

```
Skills.md
├── metadata
│   ├── version
│   ├── target_service: Skillfolio
│   └── last_updated
│
├── supported_input_types
│   ├── daily_returns      # 일별 수익률 CSV/XLSX
│   ├── daily_prices       # 일별 가격 CSV/XLSX
│   ├── holdings_weights   # 보유 종목 + 비중 (P1)
│   └── transaction_log    # 거래 내역 (P1: 목록·요약만)
│
├── column_mapping_rules   # RULE-CM-xxx
├── goal_clarification_rules  # RULE-GC-xxx
├── data_sufficiency_rules    # RULE-DS-xxx
├── metric_rules              # RULE-AN-xxx
├── visualization_rules       # RULE-VZ-xxx
├── insight_templates         # RULE-IN-xxx
├── prohibited_outputs        # RULE-PO-xxx
├── skills_log_schema         # 5개 유형 필드 명세
└── reproducibility_contract  # 결정적/비결정적 경계 명시
```

---

## 섹션 5. 규칙 예시 블록

각 규칙은 YAML 유사 형식으로 표현한다. 구현 코드가 아닌 명세 예시다.

**RULE-CM-001: 수익률 컬럼 추론**
```
rule_id: RULE-CM-001
rule_type: column_mapping
target_category: return
candidate_patterns: ["수익률", "returns", "pnl", "profit", "ret", "일별수익률"]
confidence_high: ≥0.8   # 자동 확정
confidence_mid: 0.5–0.8  # 사용자 팝업 확인
confidence_low: <0.5     # 수동 드롭다운 선택
```

**RULE-DS-001: MDD 계산 충분성 조건**
```
rule_id: RULE-DS-001
rule_type: data_sufficiency
analysis_target: mdd
required_columns: [return 또는 price]
required_period_min: 30거래일
verdict_if_met: 가능
verdict_if_short_period: 제한적 가능 (신뢰성 경고 포함)
verdict_if_missing: 불가 — excluded_analysis_reason: "return/price 컬럼 없음"
```

**RULE-AN-001: 누적 수익률 계산**
```
rule_id: RULE-AN-001
rule_type: metric_calculation
metric: cumulative_return
formula: ∏(1 + r_t) − 1   # r_t = t일 수익률
input_columns: [return]
output: 누적 수익률 (소수 또는 백분율)
deterministic: true
```

**RULE-AN-002: MDD 계산**
```
rule_id: RULE-AN-002
rule_type: metric_calculation
metric: mdd
formula: min((V_t − max(V_0…V_t)) / max(V_0…V_t))
input_columns: [return 또는 price]
output: MDD 수치, 드로다운 시계열
deterministic: true
```

**RULE-AN-003: 연환산 변동성 계산**
```
rule_id: RULE-AN-003
rule_type: metric_calculation
metric: annualized_volatility
formula: std(일별 수익률) × √거래일수_기준
trading_days_basis: 252  # 연간 거래일 기준
input_columns: [return]
output: 연환산 변동성 (%)
deterministic: true
note: CAGR은 거래일수 ≥252일 충족 시에만 참고용 표시, 핵심 지표 아님, 경고 레이블 필수
```

**RULE-VZ-001: 시계열 수익률 시각화 선택**
```
rule_id: RULE-VZ-001
rule_type: visualization_selection
analysis_type: cumulative_return
selected_chart: line_chart
chart_selection_reason: "시계열 추이 표현에 선 차트가 적합 (RULE-VZ-001)"
alternative_if_insufficient: "데이터 부족 상태 패널"
```

**RULE-IN-001: MDD 위험 판정 템플릿**
```
rule_id: RULE-IN-001
rule_type: insight_template
trigger_metric: mdd
threshold_warning: < -20%
threshold_caution: -10% ~ -20%
threshold_normal: ≥ -10%
template_warning: "[포트폴리오명]의 최대 낙폭은 [MDD값]으로, 기준 임계값(-20%)을 초과합니다. 이 수치는 분석 기간 내 최고점 대비 최저점의 하락폭이며, 투자 권유나 미래 수익 전망과 무관합니다."
ai_assist: true   # AI가 자연어 표현 보조 (금지 표현 검증 후 출력)
```

**RULE-PO-001: AI 출력 금지 표현**
```
rule_id: RULE-PO-001
rule_type: prohibited_output
prohibited_items:
  - 투자 권유 표현 ("매수", "매도", "보유 추천" 등)
  - 미래 수익률 전망 ("향후 수익", "상승 예상" 등)
  - 인과 관계 단정 ("A 때문에 B가 하락했다")
  - 업로드된 데이터 외부 시장 설명
enforcement: AI 출력 생성 후 금지 표현 검증 → 위반 시 해당 문장 제거 후 재출력
```

---

## 섹션 6. Skills 로그 스키마

| 로그 유형 | 트리거 시점 | 필수 필드 | 역할 |
|---------|----------|---------|------|
| Column Mapping Log | 매핑 확정 (SCR-02) | 원본 컬럼명, 추론 범주, 신뢰도, 사용자 확인 여부, 확정 시각 | 컬럼 해석의 투명성 증명 |
| Sufficiency Check Log | 충분성 판정 완료 (SCR-04) | 분석 항목명, 판정 결과(가능/제한적/불가), 부족 데이터, 참조 규칙 ID, `excluded_analysis_reason` | 어떤 분석이 왜 제외되었는지 추적 |
| Metric Calculation Log | 지표 계산 완료 (SCR-05) | 지표명, `calculation_formula`, `rule_input`, `rule_output`, 참조 규칙 ID | 수치 재현성 근거 |
| Visualization Rule Log | 차트 생성 (SCR-05) | 분석 유형, 선택된 차트 유형, `chart_selection_reason`, 참조 규칙 ID | 시각화 선택 근거 |
| Insight Rule Log | AI 패널 출력 (SCR-06) | 참조 수치 지표, 임계값 규칙, 위험 판정 결과, AI 보조 문장 여부 | 해석 근거와 AI 개입 범위 명시 |

---

## 섹션 7. 결정적 처리 vs AI 보조 처리 경계

| 처리 단계 | 결정적 여부 | 근거 | 제어 정책 |
|---------|-----------|------|---------|
| 파일 파싱 | 결정적 | 파서 규칙 고정 | Skills.md 지원 형식 목록 참조 |
| 컬럼 매핑 추론 (초기) | **비결정적** | AI 추론 기반 | 신뢰도 점수 표시, 사용자 확인 필수 |
| 컬럼 매핑 확정 (사용자 확인 후) | **결정적** | 사용자가 명시적으로 확인한 값 | Column Mapping Log에 확정 시각 기록 |
| 데이터 충분성 판정 | 결정적 | RULE-DS-xxx 규칙 기반 판정 | Sufficiency Check Log에 규칙 ID 기록 |
| 지표 계산 | 결정적 | RULE-AN-xxx 공식 고정 | Metric Calculation Log에 formula 기록 |
| 대시보드 레이아웃 선택 | 결정적 | RULE-VZ-xxx 규칙 기반 선택 | Visualization Rule Log에 선택 사유 기록 |
| AI 애널리스트 해석문 | **비결정적** | AI 자연어 생성 | 금지 표현 검증(RULE-PO-001) 후 출력 |
| Skills 로그 기록 | 결정적 | 각 처리 단계 완료 시 자동 기록 | 수정 불가 형태로 저장 |

**재현성 계약 요약:** 동일 파일 + 동일 사용자 확정 매핑 + 동일 Skills.md 버전 → 수치 지표(누적 수익률, 구간 수익률, MDD, 연환산 변동성) 및 시각화 구성이 재현된다. AI 해석문은 재현 범위에 포함되지 않는다.

---

## 섹션 8. AI 오케스트레이션 설계

9개 모듈이 순차 파이프라인으로 협력한다. 각 모듈은 독립적 역할을 가지며, 입력은 이전 단계의 확정 출력만 사용한다.

| 모듈 | 입력 | 출력 | 규칙 의존성 | 실패 처리 |
|------|------|------|----------|---------|
| **Data Profiler** | 업로드 파일 | 컬럼 목록, 행 수, 인코딩, 데이터 유형 요약 | 지원 형식 목록 | 형식 오류 → 오류 메시지 + 조치 안내 |
| **Column Mapper** | 컬럼 목록 | 컬럼-범주 매핑 후보 + 신뢰도 | RULE-CM-xxx | 전체 저신뢰도 → 수동 입력 유도 |
| **Goal Clarifier** | 사용자 목적 입력 | 확정된 분석 목적 범주 목록 | RULE-GC-xxx | 모호한 입력 → 후보 카드 제시 후 사용자 선택 |
| **Sufficiency Checker** | 확정 매핑 + 목적 범주 | 분석 항목별 판정(가능/제한/불가) + excluded_analysis_reason | RULE-DS-xxx | 전체 불가 → 업로드 파일 유형 변경 안내 |
| **Metric Engine** | 확정 매핑 + 가능 분석 목록 | 각 지표의 수치 계산 결과 + rule_input/output | RULE-AN-xxx | 계산 오류 → 해당 패널 "계산 오류" 표시, 다른 패널 유지 |
| **Dashboard Composer** | 지표 계산 결과 + 분석 유형 | 대시보드 카드 레이아웃 + 차트 유형 선택 | RULE-VZ-xxx | 규칙 미매칭 → 기본 선 차트 fallback + 로그 기록 |
| **Analyst Panel Generator** | 지표 계산 결과 + 인사이트 템플릿 | Skills.md 템플릿 해석문 초안 → AI 자연어 보조 서술 | RULE-IN-xxx | AI 오류 → 템플릿 문장만 표시 |
| **Skills Logger** | 각 단계 처리 결과 | 5개 유형 Skills 로그 기록 | 각 RULE ID | 로그 기록 실패 → 분석은 유지, 로그 부재 경고 표시 |
| **Critic/Guardrail Checker** | AI 해석문 초안 | 금지 표현 검증 통과 여부 + 정제된 해석문 | RULE-PO-xxx | 금지 표현 감지 → 해당 문장 제거 후 재출력, 재출력도 실패 시 템플릿 문장으로 대체 |

**파이프라인 순서:** Data Profiler → Column Mapper → Goal Clarifier → Sufficiency Checker → Metric Engine → Dashboard Composer → Analyst Panel Generator → Skills Logger → Critic/Guardrail Checker

---

## 섹션 9. 사람 개입 지점 (Human-in-the-loop)

P0 흐름에서 사용자 명시적 확인이 필요한 지점은 4곳이다.

| 지점 | 화면 | 내용 | 시스템 정책 |
|------|------|------|----------|
| 컬럼 매핑 확인 | SCR-02 | AI 추론 결과를 사용자가 확인·수정·확정 | 사용자 확인 없이 매핑 자동 확정 금지 |
| 분석 목적 명확화 | SCR-03 | 모호한 목적 입력 시 후보 카드 제시 → 선택 | 목적 일방 확정 금지 |
| 가능한 분석으로 진행 | SCR-04 | 불가 항목 포함 시 "가능한 분석만으로 진행" 확인 | 사용자 확인 없이 자동 진행 금지 |
| Skills 로그 열람 | SCR-07 | 대시보드 생성 후 로그 열람 (선택) | 강제 열람 아님; 로그는 항상 접근 가능 |

---

## 섹션 10. 가드레일

| 가드레일 | 적용 모듈 | 위반 시 처리 |
|---------|---------|-----------|
| 투자 권유 금지 | Critic/Guardrail Checker | 해당 문장 제거 후 재출력 |
| 미래 수익률 전망 금지 | Critic/Guardrail Checker | 해당 문장 제거 후 재출력 |
| 근거 없는 인과 단정 금지 | Critic/Guardrail Checker | 해당 문장 제거 후 재출력 |
| 업로드 데이터 외부 시장 설명 금지 | Critic/Guardrail Checker | 해당 문장 제거 후 재출력 |
| P0 범위 자동 확장 금지 | Sufficiency Checker + Dashboard Composer | P1/P2 기능 요청 시 SCR-08 확장 안내만 표시 |
| CAGR 무조건 표시 금지 | Metric Engine | 거래일수 ≥252일 미충족 시 CAGR 패널 표시 안 함 |

---

## 섹션 11. 공모전 평가 항목과의 대응

| 평가 항목 | 배점 | Skills.md 및 오케스트레이션 대응 |
|---------|-----|-------------------------------|
| 범용성 | 25점 | RULE-CM-xxx가 비정형 컬럼명을 추론 → 어떤 CSV든 진입 가능; 4개 데이터 유형(일별 수익률, 일별 가격, 보유 비중, 거래 내역) 지원 |
| Skills.md 설계 | 25점 | 8개 규칙 영역, 규칙 ID 체계, 예시 규칙 블록, Skills 로그 스키마 5개 유형이 심사위원이 확인 가능한 형태로 제출됨 |
| 대시보드 자동 생성 | 25점 | 9개 모듈이 파이프라인으로 자동 동작 → 수작업 없이 업로드에서 대시보드까지 완주; RULE-VZ-xxx가 차트 유형 자동 선택 |
| 바이브코딩 활용 | 15점 | Skills.md가 AI 코드 생성의 기준 문서로 작동 (Claude Code Subagents의 `skills` 필드 활용); Skills.md → 코드 생성 → 대시보드 결과의 연결 구조 시연 |
| 실용성 및 창의성 | 10점 | 데이터 충분성 검사 + 부분 분석 실행 + Skills 로그 가시화가 실제 업무 활용 가능성을 높임; "침묵 대신 부분 분석" 원칙이 차별점 |

---

## 섹션 12. 최종 기획서(Stage 12)에 인계할 핵심 강조 사항

`docs/99_final_planning_doc.md` 작성 시 다음 항목을 반드시 포함하고 강조해야 한다.

| 인계 항목 | 내용 | 근거 문서 |
|---------|------|---------|
| 핵심 thesis | "범용 대시보드도 범용 챗봇도 아니다. Skills.md에 정의된 규칙이 분석 흐름 전체를 제어한다" | 00_strategy_memo.md, 03_prd.md |
| 한 줄 피치 | "제각각인 투자 CSV를 전문가의 분석 규칙(Skills.md)으로 정렬하여, 30초 만에 재현 가능한 포트폴리오 대시보드를 생성하는 AI 금융 분석 서비스, Skillfolio" | 00_strategy_memo.md 섹션 7 |
| P0 데모 경로 | 파일 드롭 → 매핑 확인 → 목적 선택 → 충분성 판정 → 대시보드 → AI 패널 → Skills 로그 (단일 경로, 단일 강한 데모) | 05_user_flow.md, 06_screen_and_feature_spec.md |
| Skills.md 재현성 계약 | 동일 조건에서 수치 지표 재현 보장 범위 명시 (AI 해석문 제외) | 본 문서 섹션 7 |
| 데이터 충분성 설계 | 침묵·오류 대신 부분 분석 + "데이터 부족" 패널 표시 | 04_use_cases.md, 본 문서 섹션 8 |
| Skills 로그 5개 유형 | 심사위원이 규칙-결과 연결을 직접 확인할 수 있는 증거물 | 본 문서 섹션 6 |
| P0 경계 명시 | Sharpe·HHI·벤치마크·트리맵·내보내기·다중 파일·거래내역 성과 계산은 P1 이상 | review_A_resolution.md |
| 경쟁 서비스 포지셔닝 | (기획 해석) 비정형 CSV 직접 분석 + Skills.md 규칙 전면화는 공개 사용 흐름에서 전면 제시되지 않음 | 01_problem_definition.md, reference_index.md |

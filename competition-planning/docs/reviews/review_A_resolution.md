# Review A Resolution — Stage 1~3 Revision Log

작성일: 2026-04-30
검토 기반: codex_review_A_strategy_prd.md, gemini_review_A_judge_readability.md
수정 대상: docs/00_strategy_memo.md, docs/01_problem_definition.md, docs/02_product_concept.md, docs/03_prd.md

---

## 1. 채택된 수정 사항 (Adopted)

### 1.1 P0 데모 경로 고정

**근거:** Codex 2.1, Gemini 3
**수정 파일:** 00_strategy_memo.md (섹션 8), 03_prd.md (시나리오 1)

- 시나리오 1 step 6에서 집중도 분석(HHI), 샤프 지수를 P0 데모 경로에서 제거
- step 7을 "누적 수익률 선 차트, MDD 차트, 종목별 비중 파이차트, 연환산 변동성 테이블 (P0 확정 출력)"으로 고정
- step 10을 "Markdown 파일 다운로드"에서 "화면 내 리포트·Skills 로그 확인"으로 변경 (Markdown download는 P1)
- 00_strategy_memo.md 섹션 8 step 7을 "PDF/PNG 내보내기"에서 "화면 내 리포트 및 Skills 로그 확인"으로 변경

**P0 확정 기능 목록 (모든 문서 기준 통일):**
- 업로드 (CSV, XLSX) → 컬럼 매핑 확인 → 충분성 검사 → 성과·MDD·연환산 변동성·비중 분석 → 대시보드 자동 생성 → 화면 내 애널리스트 리포트 → Skills 로그 확인

**P0에서 명시적으로 제외된 기능 (P1 이상):**
- 거래내역 기반 성과 계산
- 샤프 지수
- 집중도/HHI
- 벤치마크 비교
- 트리맵
- Markdown 파일 다운로드
- PDF/PNG 내보내기
- 다중 파일 결합

### 1.2 거래내역 P1 격리

**근거:** Codex 2.2
**수정 파일:** 00_strategy_memo.md, 01_problem_definition.md (섹션 6.1), 02_product_concept.md (섹션 6.2), 03_prd.md (섹션 4.2)

- 거래내역을 "P1 — MVP(P0)에서는 거래 목록 표시 및 보유 내역 요약에 한정. 성과 계산에는 일별 수익률 또는 일별 가격 데이터가 별도로 필요"로 일관 표기
- Codex 3.5 제안(P0 데이터셋 2개: Dataset A = 일별 수익률, Dataset B = holdings + 평가금액)은 Stage 4 Use Case에서 채택 예정. 현 단계에서는 거래내역만 격리

### 1.3 AI 애널리스트 패널 템플릿 우선 원칙

**근거:** Codex 2.3, 사용자 Priority 3
**수정 파일:** 03_prd.md (F-AI-01)

- 설명 전면 재작성: Skills.md 정의 rule-triggered templates를 1차 생성 수단으로 명시
- AI는 템플릿 결과의 자연어 polishing에 한정
- 위험 요인 고지 및 데이터 한계 안내는 Skills.md 임계값 규칙에서 결정적으로 트리거
- 수용 기준에 명시적 금지 항목 추가: 투자 권유, 미래 수익률 전망, 데이터에 없는 외부 시장 설명, 인과 관계 단정 표현

### 1.4 Skills 로그 강화 — 5개 유형 + 필드 명세

**근거:** Codex 2.5, 사용자 Priority 4
**수정 파일:** 03_prd.md (F-SL-01)

F-SL-01 설명을 전면 재작성하여 다음 5개 로그 유형과 핵심 필드를 명세:
- **Column Mapping Log**: 원본 컬럼명, 추론 의미 범주, 신뢰도, 사용자 확인 여부, 확정 시각
- **Sufficiency Check Log**: 분석 항목명, 판정 결과, 부족 데이터, 규칙 ID, `excluded_analysis_reason`
- **Metric Calculation Log**: 지표명, `calculation_formula`, `rule_input`, `rule_output`, 규칙 ID
- **Visualization Rule Log**: 분석 유형, 차트 유형, `chart_selection_reason`, 규칙 ID
- **Insight Rule Log**: 참조 수치 지표, 임계값 규칙, 위험 판정, AI 보조 문장 여부

수용 기준에 "각 대시보드 카드 하단에 참조 규칙 ID 표시" 추가

### 1.5 경쟁 서비스 표현 완화

**근거:** Codex 2.6, 사용자 Priority 5
**수정 파일:** 00_strategy_memo.md (섹션 7), 01_problem_definition.md (섹션 1.1, 1.2)

- "고정된 입력 스키마를 전제로 설계되어 있고" → "티커 입력·브로커 연동 등 특정 입력 스키마를 주된 진입 경로로 설계하는 경향이 있으며"
- "기존 도구 어느 곳도 이 구조를 정면으로 구현하고 있지 않다" → "이 구조를 공개된 제품 사용 흐름에서 전면에 제시하는 서비스는 확인되지 않는다 (기획 해석)"
- 경쟁 서비스 한계는 "없다"가 아니라 "공개 사용 흐름에서 전면화되지 않는다"로 일관 표기

### 1.6 페르소나 A/B 우선순위 명시

**근거:** Codex 3.1
**수정 파일:** 01_problem_definition.md (섹션 2)

- 페르소나 A를 P0 데모의 1차 타깃으로 명시
- 페르소나 B는 2차 타깃으로 격하
- Use Case와 P0 데모 시나리오는 페르소나 A의 월간 리포트 자동화 흐름 중심으로 설계 명시

### 1.7 한 줄 피치 및 첫 10초 데모 장면 추가

**근거:** Gemini 7, Gemini 8
**수정 파일:** 00_strategy_memo.md (섹션 7, 섹션 8)

- 섹션 7 thesis 끝에 한 줄 피치 추가: "제각각인 투자 CSV를 전문가의 분석 규칙(Skills.md)으로 정렬하여, 30초 만에 재현 가능한 포트폴리오 대시보드를 생성하는 AI 금융 분석 서비스, Skillfolio"
- 섹션 8 랜딩 페이지 연결 원칙에 "하나의 강한 데모 원칙" 추가
- 섹션 8에 첫 10초 데모 오프닝 장면(4단계: 파일 드롭 → 매핑 확인 → 대시보드 생성 → Skills 로그 팝업) 추가

### 1.8 시나리오 4 P1 표기

**근거:** Codex 4.4
**수정 파일:** 03_prd.md (시나리오 4)

- 시나리오 4 제목에 "P1 시나리오" 표기
- "이 시나리오는 P1 기능(벤치마크 비교)을 포함하는 확장 사용 흐름이다. P0 데모 경로에 포함되지 않는다"라는 블록 추가

---

## 2. 부분 채택 사항 (Partially Adopted)

### 2.1 재현성 계약 테이블 (Reproducibility Contract)

**Codex 2.4 원 제안:** 별도 "Reproducibility Contract" 표 추가
**결정:** 부분 채택. 별도 섹션 추가보다 기존 섹션 9.1의 결정적 항목 표에 CAGR·샤프·HHI의 조건과 P1 표기를 추가하는 방식으로 반영 (이전 Stage 3 revision에서 처리). 완전한 Reproducibility Contract는 08_skills_md_design.md에서 정의할 예정.

### 2.2 Skills.md 명칭 평이화

**Gemini 6 원 제안:** 발표 시 "Standard Analysis Guide" 또는 "Expert Intelligence Specification" 등으로 대체 사용
**결정:** 부분 채택. 기술 문서(00~03)에서는 "Skills.md" 명칭 유지. 대중 투표 전략 섹션(00_strategy_memo.md 섹션 3.5, 섹션 8)에 "전문가의 분석 규칙(Skills.md)"처럼 괄호 보조 설명을 추가하여 비기술적 독자에 대응. 실제 발표 자료 명칭 변경은 Stage 10 이후 결정.

### 2.3 데이터셋 2개 준비 권장 (Codex 3.5)

**Codex 원 제안:** P0 데모 데이터셋 2개 준비 (Dataset A: 일별 수익률, Dataset B: holdings + 평가금액)
**결정:** 부분 채택. 방향은 수용하나 Stage 4 Use Case 설계 시 구체화. 현 Stage에서는 거래내역만 P1 격리 처리.

---

## 3. 거부된 수정 사항 (Rejected)

### 3.1 F-UP-03 (다중 파일 업로드) P0 제거

**Codex 4.4 원 제안:** F-UP-03이 P0라면 벤치마크 비교 P1과 충돌. P0에서 단일 파일로 제한하거나 축소.
**결정:** 거부. F-UP-03은 현재 이미 P1로 분류되어 있음 (PRD 섹션 4.2, F-UP-03 우선순위 P1). 충돌 없음. 추가 조치 불필요.

### 3.2 "AI가 모든 데이터를 분석한다" 과장 삭제

**Codex 2.6 원 표현 제안:** "우리가 유일하다" → "공모전 맥락에서 제출물로 보여주기 좋은 조합이다"
**결정:** 거부. 이 표현으로 전환하면 경쟁력이 지나치게 낮아 보임. 대신 "(기획 해석)" 레이블과 "공개 사용 흐름에서 전면화되지 않는다"는 표현으로 이미 충분히 완화됨. 논문-스타일의 약한 표현은 공모전 맥락에서 역효과.

### 3.3 PRD 상세도 축소 (Codex 3.4)

**Codex 원 제안:** PRD가 구현-heavy 직전. 이후 문서에서는 더 추상적으로.
**결정:** 거부. PRD의 Feature ID, 수용 기준, 엣지 케이스 수준은 공모전 제출용 기획서로 장점이 됨. 심사위원이 구체적 기능 동작을 확인할 수 있는 수준이 좋음. 축소하지 않음.

---

## 4. 수정된 파일 목록

| 파일 | 수정 내용 요약 |
|------|------------|
| docs/00_strategy_memo.md | 섹션 7 thesis 완화, 한 줄 피치 추가. 섹션 8 step 5·6·7 P0 출력 고정 및 PDF/PNG 제거. 랜딩 페이지 원칙에 "하나의 강한 데모" + 첫 10초 장면 추가 |
| docs/01_problem_definition.md | 섹션 1.1 "기존 도구 어느 곳도" 완화. 섹션 1.2 표 완화. 섹션 2 페르소나 A/B 우선순위 명시. 섹션 6.1 거래내역 P1 표기. 섹션 6.2 샤프·집중도·벤치마크 P1 표기 |
| docs/02_product_concept.md | 섹션 4 예외 흐름 수정 (집중도·샤프 P1 격리). 섹션 6.2 거래내역 P1 표기. 섹션 6.3 샤프·집중도·벤치마크 P1 표기. 섹션 9 범용성 설명 수정 |
| docs/03_prd.md | 시나리오 1 step 6 집중도 제거, step 10 리포트 다운로드 → 화면 내 확인. 시나리오 4 P1 표기. F-AI-01 수용 기준에 AI 금지 항목 추가. F-SL-01 전면 재작성 (5개 로그 유형, 핵심 필드) |

---

## 5. Stage 4 진입 전 잔여 리스크

| 리스크 | 수준 | 비고 |
|--------|------|------|
| P0 데모 데이터셋 미확정 | 중 | Stage 4 Use Case에서 구체적 샘플 CSV 구조 확정 필요 |
| Skills 로그 5개 유형의 UX 표현 방식 미결정 | 중 | Stage 6 Screen Spec에서 로그 패널 레이아웃 설계 필요 |
| AI 애널리스트 패널 템플릿 구체 내용 미정 | 중 | Stage 8 Skills.md 설계에서 해석 템플릿 예시 작성 필요 |
| 재현성 계약 테이블 미완성 | 낮음 | Stage 8 Skills.md 설계에서 Reproducibility Contract 정의 예정 |
| Persona B 사용 흐름 약화 | 낮음 | Persona B는 2차 타깃. Stage 4에서 B용 시나리오 1개 포함 여부 결정 필요 |
| Skills.md 비기술 설명 방식 미결정 | 낮음 | 발표용 명칭(분석 표준 가이드 등) Stage 10 이후 결정 |

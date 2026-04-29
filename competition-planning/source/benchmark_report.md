아래 조사는 사용자가 **금융·투자 데이터를 업로드/입력/연동 → 자동 분석·시각화·리포트화**하는 웹 기반 서비스를 기준으로 정리했다. 공모전 설명 전문은 현재 메시지에 생략되어 있으므로, 제공된 핵심 설명인 **“Skills.md 기반 투자 분석 규칙 설계 + 바이브코딩으로 금융 투자 대시보드 구현”**에 맞춰 평가했다.

---

# 금융 데이터 분석 대시보드 벤치마킹 리서치

## 1. 후보 서비스 1차 목록

| 구분 | 서비스                          |                유형 |               사용자 데이터 입력 구조 |        자동 분석/시각화 | 공모전 적합도 |
| -- | ---------------------------- | ----------------: | --------------------------: | ---------------: | ------: |
| 1  | Portfolio Visualizer         |    금융 특화 포트폴리오 분석 |                 포트폴리오 구성 입력 |  백테스트·최적화·리스크 분석 |      높음 |
| 2  | Sharesight                   |   금융 특화 포트폴리오 트래커 |          거래내역 스프레드시트·브로커 연동 |     성과·배당·세금 리포트 |      높음 |
| 3  | Koyfin                       |  금융 리서치/포트폴리오 플랫폼 |    포트폴리오 입력·PDF 브로커 명세서 업로드 |       성과·리스크·리포트 |      높음 |
| 4  | Simply Wall St               | 시각 중심 주식/포트폴리오 분석 |                 포트폴리오 입력·연동 |   밸류에이션·배당·분산 분석 |      높음 |
| 5  | Composer                     |      노코드/AI 전략 빌더 |                    전략 조건 입력 |        백테스트·자동매매 |      높음 |
| 6  | Microsoft Power BI + Copilot |             범용 BI |         Excel/CSV/DB 업로드·연동 |   AI 리포트 생성·질의응답 |      높음 |
| 7  | Julius AI                    |      범용 AI 데이터 분석 | Excel/CSV/Google Sheets 업로드 |     자연어 분석·차트·통계 |      높음 |
| 8  | Rows                         |         AI 스프레드시트 |    CSV/XLSX/PDF/API/은행 계좌 등 |    AI 분석·변환·대시보드 |      중상 |
| 9  | Tableau + Pulse/Ask Data     |             범용 BI |           DB/파일/클라우드 데이터 연결 |   AI 인사이트·자동 시각화 |      중상 |
| 10 | AlphaSense                   |      금융 리서치/문서 AI |            내부 문서·리서치 자료 업로드 | AI 요약·대시보드·문서 분석 |      중상 |
| 11 | Snowflake Cortex Analyst     | 데이터웨어하우스 기반 AI 분석 |           Snowflake 구조화 데이터 |    자연어 질의→SQL 분석 |      중상 |
| 12 | Datawrapper                  |        범용 데이터 시각화 | CSV/Excel/Google Sheets 업로드 |     차트·지도·테이블 생성 |      중간 |

1차 후보 중 최종 분석 대상으로는 **Portfolio Visualizer, Sharesight, Koyfin, Simply Wall St, Composer, Power BI Copilot, Julius AI**를 선별했다. 이유는 “금융 분석성”, “사용자 데이터 입력 구조”, “자동 분석/시각화”, “대시보드/리포트 결과물”, “Skills.md로 재현 가능한 규칙성”이 상대적으로 강하기 때문이다.

---

# 2. 선별 서비스 상세 분석

## 2.1 Portfolio Visualizer

### 1. 서비스명 / URL

**Portfolio Visualizer** ([포트폴리오 비주얼라이저][1])

### 2. 한 줄 정의

포트폴리오 백테스트, 자산배분, 최적화, 리스크 분석을 웹에서 수행하는 금융 특화 분석 도구.

### 3. 주요 사용자

개인 투자자, 자산배분 투자자, 퀀트 입문자, 투자전략 검증자.

### 4. 입력 데이터 방식

사용자가 자산 티커, 비중, 기간, 리밸런싱 조건 등을 입력해 포트폴리오를 구성한다. 공식 백테스트 도구는 mutual funds, ETFs, stocks 기반 포트폴리오 구성을 지원한다고 설명한다. ([포트폴리오 비주얼라이저][2])

### 5. 주요 분석 기능

포트폴리오 백테스트, 자산배분 분석, 최적화, 상관관계, 리스크/수익률 지표, 시나리오 비교.

### 6. 대시보드/시각화 특징

성과 곡선, drawdown, rolling return, asset allocation, risk-return 비교 등 “투자 분석 보고서형” 시각화가 강하다.

### 7. AI 또는 자동화 기능

LLM 기반 AI 분석보다는 사전에 정의된 금융 분석 모듈 중심이다. 즉, 자동화는 강하지만 “자연어 기반 분석”은 약하다.

### 8. 공모전과의 관련성

공모전의 핵심인 **분석 규칙 정의 → 결과 시각화 → 투자 판단 지원** 구조와 매우 잘 맞는다. 특히 Skills.md에 “포트폴리오 성과 분석 규칙”, “벤치마크 비교 규칙”, “리스크 지표 계산 규칙”을 명시하면 재현 가능하다.

### 9. 벤치마킹 포인트

성과 지표를 단순 수익률이 아니라 CAGR, volatility, max drawdown, Sharpe ratio, rolling metric 등으로 분해하는 구조.

### 10. 한계

사용자가 업로드한 임의의 금융 데이터 구조를 자동 해석하는 서비스라기보다는, 정해진 포트폴리오 분석 양식에 사용자를 맞추는 구조다.

### 11. 우리 서비스의 차별화 아이디어

Portfolio Visualizer의 정형 분석 체계를 가져오되, 사용자가 업로드한 **비정형 CSV/Excel 컬럼 구조를 Skills.md 규칙에 따라 자동 매핑**하도록 만들면 차별화된다.

---

## 2.2 Sharesight

### 1. 서비스명 / URL

**Sharesight** ([Sharesight][3])

### 2. 한 줄 정의

거래내역을 기반으로 포트폴리오 성과, 배당, 세금, 벤치마크를 추적하는 온라인 포트폴리오 리포팅 서비스.

### 3. 주요 사용자

개인 투자자, 장기 투자자, 세금·배당 관리가 필요한 투자자.

### 4. 입력 데이터 방식

브로커 거래내역을 이메일로 자동 가져오거나, 과거 매수·매도 거래내역을 스프레드시트로 bulk import할 수 있다. Sharesight 도움말은 거래내역 스프레드시트 업로드 시 필수 필드가 필요하다고 설명한다. ([Sharesight][4])

### 5. 주요 분석 기능

성과 추적, 배당 반영 수익률, 세금 리포트, 벤치마크 비교, holding label 기반 부분 포트폴리오 비교.

### 6. 대시보드/시각화 특징

Performance Report는 open/closed positions, label별 holdings 분석 등 포트폴리오 내부를 필터링해 보여준다. ([Sharesight][5])

### 7. AI 또는 자동화 기능

AI보다는 거래내역 import, 배당·corporate action 처리, 리포트 자동 계산이 핵심이다.

### 8. 공모전과의 관련성

공모전에서 “사용자가 투자 데이터를 넣으면 결과를 자동 해석해주는 서비스”를 만들 때 가장 직접적인 참고 모델이다.

### 9. 벤치마킹 포인트

입력 데이터 스키마를 엄격하게 정의하고, 그 위에서 성과·배당·세금·벤치마크 리포트를 안정적으로 생성하는 방식.

### 10. 한계

투자 아이디어 분석이나 전략 검증보다는 사후 포트폴리오 관리에 가깝다. 또한 데이터 입력 스키마가 사용자가 맞춰야 하는 구조다.

### 11. 우리 서비스의 차별화 아이디어

Sharesight식 “거래내역 기반 성과 리포트”를 기본으로 하되, AI가 사용자의 컬럼명을 해석해 `date`, `ticker`, `side`, `quantity`, `price`, `fee` 등으로 자동 매핑하는 기능을 넣을 수 있다.

---

## 2.3 Koyfin

### 1. 서비스명 / URL

**Koyfin** ([Koyfin][6])

### 2. 한 줄 정의

시장 데이터, 포트폴리오 분석, 대시보드, 리포트를 통합 제공하는 투자 분석 플랫폼.

### 3. 주요 사용자

투자자문사, 애널리스트, 개인 투자자, 자산관리 실무자.

### 4. 입력 데이터 방식

사용자가 포트폴리오를 직접 구성하고 holdings, purchase date, quantity, average cost, lot 단위 정보를 관리할 수 있다. Client Portfolios 기능은 Schwab 등 연동 또는 PDF brokerage statements 업로드를 통한 포트폴리오 생성도 언급한다. ([Koyfin][7])

### 5. 주요 분석 기능

시장 리서치, 포트폴리오 성과 분석, P/L breakdown, FX 효과 분석, holdings matrix, benchmark 비교, client-ready report 생성.

### 6. 대시보드/시각화 특징

Koyfin은 사용자 지정 dashboard를 만들 수 있고 watchlist, charts, news 등 여러 widget을 조합할 수 있다. ([Koyfin][8])

### 7. AI 또는 자동화 기능

AI 분석보다는 금융 데이터·포트폴리오·대시보드 구성 능력이 강하다. 다만 보고서 자동화와 PDF statement import는 공모전 관점에서 중요하다.

### 8. 공모전과의 관련성

“금융 기업이 다양한 투자 데이터를 빠르게 대시보드화해야 한다”는 문제의식과 가장 가깝다. 특히 client portfolio, allocation, performance, risk, report를 하나의 화면으로 묶는 방식이 유용하다.

### 9. 벤치마킹 포인트

투자 분석 화면을 “개별 종목 차트”가 아니라 **portfolio → account → holding → risk/performance** 계층으로 설계하는 점.

### 10. 한계

상용 금융 데이터 플랫폼에 가까워 해커톤 MVP로 그대로 구현하기에는 범위가 크다. 데이터 라이선스와 시장 데이터 커버리지 문제가 있다.

### 11. 우리 서비스의 차별화 아이디어

Koyfin의 dashboard widget 구조를 축소해, 사용자가 업로드한 CSV에 대해 자동으로 “성과 요약”, “비중 분석”, “리스크 요약”, “이상치/누락값 경고”, “투자 리포트” 탭을 생성하는 MVP가 가능하다.

---

## 2.4 Simply Wall St

### 1. 서비스명 / URL

**Simply Wall St** ([Simply Wall St][9])

### 2. 한 줄 정의

주식과 포트폴리오의 재무·밸류에이션·배당·분산 상태를 시각적으로 보여주는 투자 분석 서비스.

### 3. 주요 사용자

개인 장기투자자, 초중급 주식 투자자, 시각적 리포트를 선호하는 투자자.

### 4. 입력 데이터 방식

포트폴리오를 입력하거나 연동해 holdings, returns, dividends, valuation, diversification을 분석한다. 공식 페이지는 portfolio health, realized/unrealized gains, dividend payments, currency gains/losses, annualized return 등을 보여준다고 설명한다. ([Simply Wall St][9])

### 5. 주요 분석 기능

포트폴리오 성과, 배당 예측, valuation, diversification, 산업/지역 exposure 분석.

### 6. 대시보드/시각화 특징

Simply Wall St의 강점은 “Snowflake” 같은 직관적 시각화다. 공식 기능 페이지도 valuation, dividend benchmarking, diversification을 시각 차트로 단순화한다고 설명한다. ([Simply Wall St][10])

### 7. AI 또는 자동화 기능

완전한 대화형 AI보다는 자동 리포트와 시각적 진단이 강하다. 2026년에는 Portfolio Command Center로 end-to-end portfolio platform 성격을 강화했다고 공지되어 있다. ([support.simplywall.st][11])

### 8. 공모전과의 관련성

공모전 평가에서 “대시보드의 직관성”과 “사용자 친화적 해석”을 강조할 때 좋은 벤치마크다.

### 9. 벤치마킹 포인트

복잡한 재무지표를 그대로 나열하지 않고, 투자자가 바로 이해할 수 있는 visual scorecard로 변환하는 방식.

### 10. 한계

시각화가 강한 대신, 사용자가 업로드한 임의 데이터셋에 대해 분석 규칙을 자유롭게 정의하는 구조는 약하다.

### 11. 우리 서비스의 차별화 아이디어

Simply Wall St식 visual summary를 차용하되, 점수 산출식과 판단 기준을 Skills.md에 명시해 “왜 이런 진단이 나왔는지” 재현 가능하게 만들 수 있다.

---

## 2.5 Composer

### 1. 서비스명 / URL

**Composer** ([Composer][12])

### 2. 한 줄 정의

사용자가 투자 알고리즘을 노코드/AI 방식으로 만들고, 백테스트한 뒤 실행까지 할 수 있는 자동화 투자 플랫폼.

### 3. 주요 사용자

전략형 개인 투자자, 노코드 퀀트 투자자, 자동매매 관심 사용자.

### 4. 입력 데이터 방식

사용자는 자산, 비중, 조건, 필터, 그룹 등 전략 구성 요소를 조합한다. Product Hunt 설명은 visual editor로 전략을 만들고 backtest 후 execute할 수 있다고 요약한다. ([Product Hunt][13])

### 5. 주요 분석 기능

전략 빌딩, 조건부 리밸런싱, 백테스트, 성과 비교, 자동 실행.

### 6. 대시보드/시각화 특징

포트폴리오 전략을 “블록/노드” 구조로 구성하고 결과를 성과 중심으로 보여준다.

### 7. AI 또는 자동화 기능

공식 페이지는 AI로 trading algorithms를 build, backtest, execute할 수 있다고 설명한다. ([Composer][12])

### 8. 공모전과의 관련성

공모전의 Skills.md는 사실상 Composer의 블록 전략 규칙을 문서화한 형태로 볼 수 있다. 즉, **투자 아이디어 → 규칙 → 백테스트 → 대시보드** 흐름을 가장 잘 보여주는 사례다.

### 9. 벤치마킹 포인트

전략을 코드가 아니라 규칙 단위로 분해한다. 예를 들어 `condition`, `filter`, `rank`, `rebalance`, `weighting` 같은 primitive를 정의할 수 있다.

### 10. 한계

실제 매매 실행까지 포함하므로 규제·브로커 연동·리스크 고지 문제가 크다. 해커톤 MVP에서는 실행 기능까지 구현할 필요는 없다.

### 11. 우리 서비스의 차별화 아이디어

Composer처럼 전략을 자동 실행하지 말고, 사용자가 업로드한 투자 데이터에 대해 **분석 가이드 생성 + 대시보드 생성 + 리포트 생성**까지만 수행하면 공모전 범위에 적합하다.

---

## 2.6 Microsoft Power BI + Copilot

### 1. 서비스명 / URL

**Microsoft Power BI + Copilot** ([Microsoft Learn][14])

### 2. 한 줄 정의

Excel/CSV/DB 데이터를 불러와 대시보드를 만들고, Copilot으로 자연어 기반 리포트 생성과 분석을 지원하는 범용 BI 서비스.

### 3. 주요 사용자

기업 데이터 분석가, 현업 부서, BI 개발자, 리포트 작성자.

### 4. 입력 데이터 방식

Power BI는 CSV 파일을 workspace에서 업로드하거나 OneDrive/SharePoint에서 가져올 수 있으며, Excel workbook도 semantic model로 가져올 수 있다. Microsoft 문서는 CSV import와 Excel import 절차를 공식적으로 설명한다. ([Microsoft Learn][14])

### 5. 주요 분석 기능

대시보드 생성, semantic model 관리, DAX, 시각화, 리포트 공유, 자연어 질의응답.

### 6. 대시보드/시각화 특징

보고서 페이지, 시각화 패널, dashboard, semantic model을 중심으로 구성된다.

### 7. AI 또는 자동화 기능

Copilot은 자연어 prompt로 report page를 만들고 수정할 수 있으며, narrative summary도 생성할 수 있다. Microsoft 문서는 Copilot이 report page 생성, visual 분석, data question answering 등을 지원한다고 설명한다. ([Microsoft Learn][15])

### 8. 공모전과의 관련성

공모전의 “바이브코딩”과 가장 직접적으로 연결된다. 사용자가 데이터와 목적을 입력하면 AI가 대시보드 초안을 생성하고, 사용자는 이를 조정하는 흐름이다.

### 9. 벤치마킹 포인트

대시보드를 만들기 전에 semantic model을 준비해야 한다는 점. Power BI 문서도 Copilot이 데이터를 제대로 이해하려면 모델 소유자가 business context를 준비해야 한다고 설명한다. ([Microsoft Learn][16])

### 10. 한계

금융 도메인 지식은 기본 제공되지 않는다. “수익률 계산”, “벤치마크 비교”, “리밸런싱”, “drawdown” 같은 금융 규칙은 별도 정의해야 한다.

### 11. 우리 서비스의 차별화 아이디어

Power BI식 범용 대시보드 자동 생성에 금융 특화 Skills.md를 결합한다. 즉, “generic BI”가 아니라 “investment analytics BI”로 좁히는 것이 핵심이다.

---

## 2.7 Julius AI

### 1. 서비스명 / URL

**Julius AI** ([Julius AI | AI for Data Analysis][17])

### 2. 한 줄 정의

사용자가 Excel, CSV, Google Sheets 등을 업로드하면 자연어로 데이터 분석, 차트 생성, 통계 모델링을 수행하는 AI 데이터 분석 서비스.

### 3. 주요 사용자

비개발자 데이터 분석 사용자, 학생, 연구자, 비즈니스 분석가.

### 4. 입력 데이터 방식

Julius는 Excel sheets, Google Sheets, CSV 파일을 불러와 분석할 수 있다고 설명한다. ([Julius AI | AI for Data Analysis][18])

### 5. 주요 분석 기능

자연어 질의, 차트 생성, 공식 생성, 데이터 클리닝, 통계 모델링, CSV/Excel export.

### 6. 대시보드/시각화 특징

채팅형 인터페이스에서 분석 요청을 하고, 결과 차트와 테이블을 생성한다. Julius quickstart 문서는 결과를 CSV/Excel로 export하거나 chart를 copy/download할 수 있다고 설명한다. ([Julius AI | AI for Data Analysis][19])

### 7. AI 또는 자동화 기능

AI가 데이터 클리닝, 시각화, 질문 응답, 통계 분석을 수행한다.

### 8. 공모전과의 관련성

공모전의 “사용자가 데이터와 목적을 주면 AI가 분석한다”는 UX에 가장 가깝다. 다만 금융 도메인 특화성은 약하다.

### 9. 벤치마킹 포인트

초기 MVP에서 좌측 dashboard, 우측 chat panel 구조를 설계할 때 참고할 수 있다. 사용자는 “이 데이터에서 업종별 수익률 분해해줘”, “MDD가 큰 종목 찾아줘”처럼 자연어로 요청할 수 있다.

### 10. 한계

금융 분석 규칙의 일관성과 재현성이 약할 수 있다. 같은 데이터를 넣어도 prompt에 따라 결과가 달라질 수 있다.

### 11. 우리 서비스의 차별화 아이디어

Julius식 자연어 분석 UX를 유지하되, 분석은 Skills.md의 고정 규칙을 거치게 한다. 즉, LLM이 마음대로 분석하지 않고 **규칙 문서 → schema mapping → 분석 함수 → dashboard rendering** 순서로 제한한다.

---

# 3. 전체 비교표

| 서비스                      |     금융 특화 | 사용자 데이터 입력 | 자동 분석 | 자동 시각화 | 리포트/대시보드 | AI 기능 | Skills.md 재현성 | 우리 팀 참고 가치 |
| ------------------------ | --------: | ---------: | ----: | -----: | -------: | ----: | ------------: | ---------: |
| Portfolio Visualizer     |        높음 |         중간 |    높음 |     높음 |       높음 |    낮음 |            높음 |      매우 높음 |
| Sharesight               |        높음 |         높음 |    높음 |     중상 |       높음 |    낮음 |            높음 |      매우 높음 |
| Koyfin                   |        높음 |         높음 |    높음 |     높음 |       높음 |    중간 |            중상 |      매우 높음 |
| Simply Wall St           |        높음 |         중상 |    중상 |  매우 높음 |       높음 |    중간 |            중간 |         높음 |
| Composer                 |        높음 |         중상 | 매우 높음 |     중상 |       중상 |    높음 |         매우 높음 |      매우 높음 |
| Power BI Copilot         |     낮음/범용 |      매우 높음 |    높음 |  매우 높음 |    매우 높음 | 매우 높음 |            중상 |      매우 높음 |
| Julius AI                |     낮음/범용 |      매우 높음 |    높음 |     높음 |       중간 | 매우 높음 |            중간 |         높음 |
| Rows                     |        범용 |      매우 높음 |    높음 |     중상 |       중상 |    높음 |            중간 |         중상 |
| Tableau                  |        범용 |         높음 |    높음 |  매우 높음 |    매우 높음 |    높음 |            중상 |         중상 |
| AlphaSense               | 금융 리서치 특화 |         중상 |    높음 |     중상 |       높음 | 매우 높음 |            중간 |         중상 |
| Snowflake Cortex Analyst | 범용/엔터프라이즈 |      DB 기반 |    높음 |     낮음 |       낮음 | 매우 높음 |            높음 |         중간 |
| Datawrapper              |    범용 시각화 |         높음 |    낮음 |     높음 |       중간 |    낮음 |            중상 |         중간 |

---

# 4. 공모전 평가항목별 시사점

## 4.1 범용성

범용성을 너무 넓게 잡으면 Power BI, Tableau, Julius AI와 정면 경쟁하게 된다. 이 경우 해커톤 MVP는 “범용 AI 데이터 분석기”로 보일 위험이 크다. 반대로 금융 데이터만 다루되 입력 구조를 너무 좁히면 Portfolio Visualizer나 Sharesight의 축소판이 된다.

따라서 범위는 다음처럼 잡는 것이 적절하다.

> “임의의 투자 CSV/Excel을 입력받되, 분석 목적은 포트폴리오 성과·리스크·비중·벤치마크·이상치 진단으로 제한한다.”

이러면 범용성과 금융 특화성을 동시에 확보할 수 있다.

---

## 4.2 Skills.md 설계

벤치마킹 결과, 좋은 서비스들은 내부적으로 다음과 같은 규칙 체계를 가진다.

| 규칙 유형     | 예시                                                |
| --------- | ------------------------------------------------- |
| 입력 스키마 규칙 | 날짜, 티커, 수량, 가격, 평가금액, 수익률 컬럼 식별                   |
| 지표 계산 규칙  | 누적수익률, 변동성, MDD, Sharpe, turnover                 |
| 분류 규칙     | 자산군, 업종, 국가, 전략 태그                                |
| 시각화 규칙    | 성과는 line chart, 비중은 stacked/treemap, 리스크는 heatmap |
| 해석 규칙     | “MDD가 크다”, “업종 쏠림이 크다”, “벤치마크 대비 underperform”    |
| 리포트 규칙    | 요약 → 원인 분해 → 위험 요인 → 개선 제안                        |

공모전용 Skills.md는 단순 prompt가 아니라 **분석 엔진의 specification**이어야 한다.

---

## 4.3 대시보드 자동 생성

Power BI Copilot, Julius AI, Tableau류 서비스가 보여주는 핵심은 “사용자가 차트를 직접 고르는 것”보다 “AI가 데이터 구조와 목적에 맞는 초기 dashboard를 생성하는 것”이다.

우리 서비스의 dashboard 자동 생성은 다음 순서가 적합하다.

1. 데이터 업로드
2. 컬럼 의미 추론
3. 데이터 타입 검증
4. 분석 목적 선택 또는 자연어 입력
5. Skills.md에 따라 분석 template 선택
6. 지표 계산
7. dashboard layout 자동 생성
8. 리포트 문장 생성
9. 사용자 수정 요청 반영

---

## 4.4 바이브코딩 활용

바이브코딩의 핵심은 “그럴듯한 UI를 빠르게 만드는 것”이 아니라, **분석 규칙을 문서화하고 그 문서를 코드 생성·수정의 기준으로 삼는 것**이다.

추천 구조는 다음과 같다.

```text
Skills.md
 ├─ supported_data_types
 ├─ column_mapping_rules
 ├─ financial_metrics
 ├─ visualization_rules
 ├─ insight_generation_rules
 ├─ validation_rules
 └─ dashboard_templates
```

이 구조를 두면 LLM에게 “대시보드를 만들어줘”가 아니라 “이 Skills.md를 만족하는 dashboard component를 만들어줘”라고 지시할 수 있다.

---

## 4.5 실용성 및 창의성

기존 서비스의 실용성은 대체로 높지만, 공통적으로 다음 중 하나가 약하다.

| 기존 서비스 유형     | 강점            | 약점              |
| ------------- | ------------- | --------------- |
| 금융 특화 서비스     | 분석 품질, 지표 신뢰성 | 입력 유연성 부족       |
| 범용 BI 서비스     | 대시보드 생성력, 확장성 | 금융 도메인 규칙 부족    |
| AI 데이터 분석 서비스 | 자연어 UX, 빠른 분석 | 재현성·검증성 부족      |
| 리서치 AI 서비스    | 문서 요약, 근거 검색  | 수치형 포트폴리오 분석 약함 |

우리 팀의 창의성은 이 네 가지를 결합하는 데 있다.

> 금융 특화 분석 규칙 + 유연한 파일 입력 + AI 기반 컬럼 매핑 + 자동 dashboard/report 생성

---

# 5. 최종 결론

## 5.1 기존 서비스의 공통 패턴

첫째, 좋은 서비스는 **입력 → 정규화 → 분석 → 시각화 → 리포트**의 pipeline을 갖는다. Sharesight와 Koyfin은 거래내역과 holdings를 정규화한 뒤 성과와 리포트를 만든다. Power BI와 Julius AI는 파일을 받아 자동 분석과 시각화를 생성한다. Composer는 투자 아이디어를 규칙 단위로 구조화한 뒤 백테스트한다.

둘째, 성공적인 서비스는 사용자를 지표 계산의 세부 구현으로 끌고 가지 않는다. 대신 “성과가 어떤가?”, “위험이 어디에 있는가?”, “무엇이 기여했는가?”를 바로 보여준다.

셋째, 금융 분석 서비스는 단순 차트보다 **해석 가능한 지표 묶음**을 제공한다. 예를 들어 return, volatility, drawdown, allocation, dividend, FX effect, benchmark comparison이 함께 제시된다.

---

## 5.2 기존 서비스의 빈틈

첫째, 금융 특화 서비스는 입력 데이터 구조가 비교적 고정되어 있다. 사용자가 가진 CSV/Excel이 제각각이면 바로 분석하기 어렵다.

둘째, 범용 AI 분석 서비스는 분석 결과의 재현성이 약하다. 같은 데이터를 넣어도 prompt에 따라 차트와 해석이 달라질 수 있다.

셋째, 범용 BI는 금융 도메인 판단 기준이 부족하다. MDD, 리밸런싱, 벤치마크 초과수익, 업종 쏠림, concentration risk 같은 투자 분석 규칙을 별도로 설계해야 한다.

넷째, 대부분의 서비스는 “분석 규칙 문서”를 사용자에게 명시적으로 보여주지 않는다. 공모전의 Skills.md는 이 부분에서 차별화 포인트가 될 수 있다.

---

## 5.3 우리 서비스가 가져가야 할 핵심 엣지

우리 팀의 핵심 엣지는 다음 한 문장으로 정리된다.

> “사용자가 업로드한 제각각의 투자 데이터를 Skills.md에 정의된 금융 분석 규칙으로 정규화하고, 자동으로 대시보드와 투자 리포트를 생성하는 AI 투자 데이터 분석 서비스.”

구체적 엣지는 세 가지다.

첫째, **Schema-flexible**: CSV/Excel 컬럼명이 달라도 AI가 의미를 추론한다.
둘째, **Rule-grounded**: 분석과 해석은 Skills.md에 정의된 규칙을 따른다.
셋째, **Dashboard-first**: 결과는 채팅 답변이 아니라 즉시 사용 가능한 dashboard와 report로 나온다.

---

# 6. 우리 팀 MVP 방향 제안

## 6.1 MVP 컨셉

서비스 이름은 임시로 다음처럼 둘 수 있다.

> **InvestSkill Dashboard**
> 투자 CSV/Excel을 업로드하면, Skills.md 기반으로 포트폴리오 성과·리스크·비중·벤치마크 분석 대시보드를 자동 생성하는 서비스.

---

## 6.2 MVP 사용자 시나리오

```text
1. 사용자가 CSV/Excel 업로드
2. 사용자가 분석 목적 입력
   예: “내 포트폴리오의 성과와 리스크를 분석해줘”
3. AI가 컬럼 의미 추론
   date, ticker, weight, return, price, quantity 등
4. 부족한 컬럼 또는 애매한 컬럼 질문
5. Skills.md 규칙에 따라 분석 실행
6. 대시보드 자동 생성
7. 우측 패널에서 자연어 리포트 제공
8. 사용자가 “업종별로 더 쪼개줘”, “벤치마크 KOSPI로 바꿔줘” 요청
9. 대시보드 갱신
```

---

## 6.3 MVP 핵심 기능

| 기능               | 구현 우선순위 | 설명                                 |
| ---------------- | ------: | ---------------------------------- |
| 파일 업로드           |       1 | CSV/XLSX 지원                        |
| 컬럼 자동 매핑         |       1 | LLM 또는 rule-based + LLM hybrid     |
| 데이터 검증           |       1 | 결측치, 날짜 형식, 숫자 형식, 중복 확인           |
| 성과 분석            |       1 | 누적수익률, 기간수익률, 변동성                  |
| 리스크 분석           |       1 | MDD, drawdown chart, concentration |
| 비중 분석            |       1 | 종목별/업종별/자산군별 비중                    |
| 벤치마크 비교          |       2 | KOSPI, S&P500 등 선택                 |
| 자동 리포트           |       2 | 요약, 원인, 위험, 제안                     |
| 채팅형 수정           |       2 | “이 차트 추가해줘”                        |
| Skills.md export |       3 | 분석 규칙 문서 다운로드                      |

---

## 6.4 추천 화면 구조

```text
┌──────────────────────────────────────────────┐
│ Header: Dataset name / Analysis mode / Export │
├───────────────────────┬──────────────────────┤
│ Dashboard Area         │ AI Analyst Panel      │
│                       │                      │
│ 1. Portfolio Summary   │ - 데이터 인식 결과     │
│ 2. Performance Chart   │ - 핵심 해석            │
│ 3. Drawdown Chart      │ - 위험 요인            │
│ 4. Allocation View     │ - 수정 요청 입력       │
│ 5. Risk Table          │                      │
└───────────────────────┴──────────────────────┘
```

이 구조는 Koyfin/Power BI식 대시보드와 Julius식 채팅 분석 UX를 결합한다.

---

## 6.5 MVP에서 피해야 할 것

초기 MVP에서 실시간 시세, 자동매매, 고급 백테스트, 세금 계산, 전 세계 금융 데이터 커버리지는 제외하는 것이 좋다. 이들은 구현 난도가 높고 공모전 핵심인 “Skills.md 기반 분석 규칙 + 대시보드 생성”에서 벗어날 수 있다.

---

# 최종 제안

공모전 기획서에서는 기존 서비스를 다음처럼 포지셔닝하면 좋다.

| 참고 서비스               | 가져올 것                  | 버릴 것          |
| -------------------- | ---------------------- | ------------- |
| Portfolio Visualizer | 금융 지표 체계               | 고정 입력 구조      |
| Sharesight           | 거래내역 기반 리포트            | 세금 중심 복잡도     |
| Koyfin               | professional dashboard | 과도한 시장 데이터 범위 |
| Simply Wall St       | 직관적 visual summary     | 폐쇄적 점수 체계     |
| Composer             | 전략 규칙화 사고              | 자동매매 실행       |
| Power BI Copilot     | 자연어 기반 report 생성       | 범용 BI의 도메인 부족 |
| Julius AI            | chat with data UX      | 비재현적 분석       |

따라서 우리 팀 MVP는 **“금융 특화 Julius + 규칙 기반 Power BI + 간소화된 Portfolio Visualizer”**로 잡는 것이 가장 설득력 있다.

[1]: https://www.portfoliovisualizer.com/?utm_source=chatgpt.com "Portfolio Visualizer"
[2]: https://www.portfoliovisualizer.com/backtest-portfolio?utm_source=chatgpt.com "Backtest Portfolio Asset Allocation"
[3]: https://www.sharesight.com/?utm_source=chatgpt.com "Sharesight: Stock Portfolio Tracker"
[4]: https://www.sharesight.com/blog/automatically-import-trades-to-your-sharesight-portfolio-using-email/?utm_source=chatgpt.com "Automatically import trades to your portfolio using email"
[5]: https://help.sharesight.com/performance_report/?utm_source=chatgpt.com "Performance Report"
[6]: https://www.koyfin.com/?utm_source=chatgpt.com "Koyfin: Comprehensive financial data analysis"
[7]: https://www.koyfin.com/help/my-portfolios/?utm_source=chatgpt.com "My Portfolios"
[8]: https://www.koyfin.com/help/mydashboards-myd/?utm_source=chatgpt.com "Dashboard of stocks, securities, graphs widgets"
[9]: https://simplywall.st/?utm_source=chatgpt.com "Simply Wall St: Free Portfolio Tracker, Stock Insights and ..."
[10]: https://simplywall.st/features/portfolio?utm_source=chatgpt.com "Advanced Stock Portfolio Tracker"
[11]: https://support.simplywall.st/hc/en-us/articles/7894830045199-What-s-New?utm_source=chatgpt.com "What's New"
[12]: https://www.composer.trade/?utm_source=chatgpt.com "Composer – Trading. Built Better."
[13]: https://www.producthunt.com/products/composer-2?utm_source=chatgpt.com "Composer | Build, backtest and execute trading algorithms ..."
[14]: https://learn.microsoft.com/en-us/power-bi/connect-data/service-comma-separated-value-files?utm_source=chatgpt.com "Get data from comma separated value (CSV) files - Power BI"
[15]: https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-create-reports?utm_source=chatgpt.com "Create and Edit Power BI Reports with Copilot"
[16]: https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction?utm_source=chatgpt.com "Copilot for Power BI overview"
[17]: https://julius.ai/?utm_source=chatgpt.com "Julius AI: Chat with Your Data Using AI"
[18]: https://julius.ai/home/excel-ai?utm_source=chatgpt.com "Excel AI | Generate Formulas & Analyze Data with Julius"
[19]: https://julius.ai/docs/get-started/quickstart?utm_source=chatgpt.com "Getting Started - Julius"

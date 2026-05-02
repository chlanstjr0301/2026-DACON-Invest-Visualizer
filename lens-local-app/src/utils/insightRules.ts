import type { ComputedMetrics, SufficiencyItem, SkillLogEntry } from '../types';
import { fmtPct } from './financialCalc';

interface InsightResult {
  insights: string[];
  logs: Omit<SkillLogEntry, 'id' | 'timestamp'>[];
}

function isPossible(sufficiencyItems: SufficiencyItem[], id: string): boolean {
  return sufficiencyItems.find((s) => s.id === id)?.status !== 'impossible';
}

export function generateInsights(
  metrics: ComputedMetrics,
  sufficiencyItems: SufficiencyItem[],
  goalCategory: string | null,
): InsightResult {
  const insights: string[] = [];
  const logs: Omit<SkillLogEntry, 'id' | 'timestamp'>[] = [];

  const goal = goalCategory ?? 'full';

  // Header
  insights.push(`**분석 기간:** ${metrics.dataStartDate} ~ ${metrics.dataEndDate} (${metrics.tradingDays}거래일)`);
  insights.push(`**분석 목적:** ${
    { performance: '성과 분석', risk: '위험 분석', allocation: '비중 분석', full: '전체 진단' }[goal] ?? goal
  }`);
  insights.push('');
  insights.push('---');
  insights.push('');

  // Cumulative return — RULE-IN-001
  if (isPossible(sufficiencyItems, 'cumulative_return') && (goal === 'performance' || goal === 'full')) {
    const cr = metrics.cumulativeReturn;
    const label = cr > 0.2 ? '우수' : cr > 0.05 ? '양호' : cr >= 0 ? '보합' : '손실';

    insights.push(
      `**누적 수익률 (RULE-IN-001):** 분석 기간 전체 누적 수익률은 **${fmtPct(cr)}** (${label})입니다. ` +
      `이 값은 ∏(1+r_t)−1 (RULE-AN-001)으로 산출되었으며, 기간 내 일별 수익률의 복리 누적 결과입니다. ` +
      `해당 수치는 과거 데이터 기반이며 미래 수익률을 나타내지 않습니다.`,
    );
    insights.push('');

    logs.push({
      ruleId: 'RULE-IN-001',
      category: 'insight',
      input: `cumulative_return=${cr.toFixed(6)}, goal=${goal}`,
      output: `label=${label}, 해석문 생성`,
      reason: `누적 수익률 ${fmtPct(cr)} → 임계값 20%/5%/0% 기준 ${label} 판정. RULE-IN-001 템플릿 적용.`,
      deterministic: false,
    });
  }

  // MDD — RULE-IN-002
  if (isPossible(sufficiencyItems, 'drawdown_mdd') && (goal === 'risk' || goal === 'full')) {
    const mdd = metrics.mdd;
    const riskLabel = mdd < -0.2 ? '주의' : mdd < -0.1 ? '경계' : '양호';

    insights.push(
      `**최대 낙폭 MDD (RULE-IN-002):** 기간 내 최대 낙폭은 **${fmtPct(mdd)}** (위험 레이블: ${riskLabel})입니다. ` +
      `MDD는 min(V_t/max(V_0..V_t)−1) (RULE-AN-002)으로, 최고점 대비 최저점의 하락폭을 나타냅니다. ` +
      `이 수치는 투자 권유나 미래 예측과 무관합니다.`,
    );
    insights.push('');

    logs.push({
      ruleId: 'RULE-IN-002',
      category: 'insight',
      input: `mdd=${mdd.toFixed(6)}, goal=${goal}`,
      output: `riskLabel=${riskLabel}, 해석문 생성`,
      reason: `MDD ${fmtPct(mdd)} → 임계값 -20%/-10% 기준 ${riskLabel} 판정 (RULE-IN-002).`,
      deterministic: false,
    });
  }

  // Volatility — RULE-IN-003
  if (isPossible(sufficiencyItems, 'annualized_volatility') && (goal === 'risk' || goal === 'full')) {
    const vol = metrics.annualizedVolatility;
    const volLabel = vol > 0.3 ? '고변동성' : vol > 0.15 ? '중변동성' : '저변동성';

    insights.push(
      `**연환산 변동성 (RULE-IN-003):** 연환산 변동성은 **${fmtPct(vol)}** (${volLabel})입니다. ` +
      `std(일별수익률) × √252 (RULE-AN-003)으로 산출한 값으로, 수익률 분산의 연 단위 환산 지표입니다. ` +
      `변동성은 위험의 한 측면을 나타내며, 투자 적합성 판단의 단독 근거로 사용되어서는 안 됩니다.`,
    );
    insights.push('');

    logs.push({
      ruleId: 'RULE-IN-003',
      category: 'insight',
      input: `annualizedVolatility=${vol.toFixed(6)}, goal=${goal}`,
      output: `volLabel=${volLabel}, 해석문 생성`,
      reason: `연환산 변동성 ${fmtPct(vol)} → 임계값 30%/15% 기준 ${volLabel} 판정 (RULE-IN-003).`,
      deterministic: false,
    });
  }

  // Allocation — RULE-IN-004
  if (
    isPossible(sufficiencyItems, 'allocation_analysis') &&
    (goal === 'allocation' || goal === 'full') &&
    metrics.allocationData &&
    metrics.allocationData.length > 0
  ) {
    const top = [...metrics.allocationData].sort((a, b) => b.weight - a.weight)[0];
    insights.push(
      `**비중 분석 (RULE-IN-004):** 최대 비중 자산은 **${top.name}** (${fmtPct(top.weight / 100 > 1 ? top.weight / 100 : top.weight)})입니다. ` +
      `비중 데이터는 데이터 파일 내 최신 시점을 기준으로 표시합니다. ` +
      `집중도 평가는 HHI 등 별도 지표가 필요하며 현재 P0 범위 외입니다.`,
    );
    insights.push('');

    logs.push({
      ruleId: 'RULE-IN-004',
      category: 'insight',
      input: `top_asset=${top.name}, weight=${top.weight}`,
      output: `최대 비중 자산 기술, 집중도 상세 분석 제외`,
      reason: `비중 데이터 기술 서술. HHI 집중도 분석은 P1 범위로 제외 (RULE-IN-004).`,
      deterministic: false,
    });
  }

  // Benchmark — RULE-IN-005
  if (
    isPossible(sufficiencyItems, 'benchmark_comparison') &&
    metrics.benchmarkSeries &&
    metrics.benchmarkSeries.length > 0
  ) {
    const last = metrics.benchmarkSeries[metrics.benchmarkSeries.length - 1];
    const portR = last.portfolio - 1;
    const bmR = last.benchmark - 1;
    const diff = portR - bmR;

    insights.push(
      `**벤치마크 비교 (RULE-IN-005):** 포트폴리오 누적 수익률 ${fmtPct(portR)}, ` +
      `벤치마크 누적 수익률 ${fmtPct(bmR)}, 차이 ${fmtPct(diff)}입니다. ` +
      `이 비교는 제공된 데이터 기준이며 시장 지수와의 비교가 아닙니다. ` +
      `수익률 차이의 원인을 단정하거나 추론하지 않습니다 (인과관계 단정 금지, RULE-PO-001).`,
    );
    insights.push('');

    logs.push({
      ruleId: 'RULE-IN-005',
      category: 'insight',
      input: `portfolio=${portR.toFixed(4)}, benchmark=${bmR.toFixed(4)}`,
      output: `diff=${diff.toFixed(4)}, 해석문 생성`,
      reason: `포트폴리오-벤치마크 단순 산술 차이. 인과관계 단정 없음 (RULE-IN-005, RULE-PO-001).`,
      deterministic: false,
    });
  }

  // Visualization logs
  logs.push(
    { ruleId: 'RULE-VZ-001', category: 'visualization', input: 'analysis_type=cumulative_return', output: 'chart=line_chart', reason: '시계열 추이 → 선 차트 (RULE-VZ-001)', deterministic: true },
    { ruleId: 'RULE-VZ-002', category: 'visualization', input: 'analysis_type=drawdown', output: 'chart=area_chart', reason: '드로다운 음수 구간 강조 → 영역 차트 (RULE-VZ-002)', deterministic: true },
  );
  if (metrics.allocationData) {
    logs.push({ ruleId: 'RULE-VZ-003', category: 'visualization', input: 'analysis_type=allocation', output: 'chart=pie_chart', reason: '비중 구성 → 파이 차트 (RULE-VZ-003)', deterministic: true });
  }
  if (metrics.benchmarkSeries) {
    logs.push({ ruleId: 'RULE-VZ-004', category: 'visualization', input: 'analysis_type=benchmark', output: 'chart=multi_line_chart', reason: '포트폴리오-벤치마크 비교 → 멀티시리즈 선 차트 (RULE-VZ-004)', deterministic: true });
  }

  // Data limitations — RULE-PO-001
  insights.push('---');
  insights.push('');
  insights.push('**데이터 한계 고지 (RULE-PO-001)**');
  insights.push('');
  insights.push(
    '위 분석은 사용자가 업로드한 파일 데이터만을 사용합니다. ' +
    '수익률 출처, 수수료·세금 반영 여부, 포트폴리오 구성의 완전성은 확인되지 않습니다. ' +
    '모든 수치는 과거 데이터 기반이며, 미래 수익률을 예측하거나 투자를 권유하지 않습니다.',
  );

  return { insights, logs };
}

import type { ColumnMapping, SufficiencyItem, SufficiencyStatus } from '../types';

interface SufficiencyContext {
  hasReturn: boolean;
  hasPrice: boolean;
  hasDate: boolean;
  hasWeight: boolean;
  hasBenchmark: boolean;
  rowCount: number;
}

function getContext(mappings: ColumnMapping[], rowCount: number): SufficiencyContext {
  const cats = mappings.map((m) => m.category);
  return {
    hasReturn: cats.includes('return'),
    hasPrice: cats.includes('price'),
    hasDate: cats.includes('date'),
    hasWeight: cats.includes('weight'),
    hasBenchmark: cats.includes('benchmark_return'),
    rowCount,
  };
}

function item(
  id: string,
  name: string,
  ruleId: string,
  status: SufficiencyStatus,
  reason: string,
  requiredColumns?: string[],
): SufficiencyItem {
  return { id, name, ruleId, status, reason, requiredColumns };
}

export function checkSufficiency(mappings: ColumnMapping[], rowCount: number): SufficiencyItem[] {
  const ctx = getContext(mappings, rowCount);
  const hasData = ctx.hasReturn || ctx.hasPrice;

  const items: SufficiencyItem[] = [
    // RULE-DS-001: cumulative return
    hasData
      ? ctx.hasDate
        ? item('cumulative_return', '누적 수익률', 'RULE-DS-001', 'possible', '분석 가능합니다.')
        : item('cumulative_return', '누적 수익률', 'RULE-DS-001', 'limited',
            '날짜 컬럼이 없어 시계열 표시가 제한됩니다. 수치 계산은 가능합니다.')
      : item('cumulative_return', '누적 수익률', 'RULE-DS-001', 'impossible',
          'return 또는 price 컬럼이 필요합니다.', ['return 또는 price']),

    // RULE-DS-002: period return
    hasData
      ? ctx.rowCount < 5
        ? item('period_return', '구간 수익률', 'RULE-DS-002', 'limited',
            `데이터 ${ctx.rowCount}행 — 구간 분석 신뢰도 낮음 (권장: 30행 이상).`)
        : item('period_return', '구간 수익률', 'RULE-DS-002', 'possible', '분석 가능합니다.')
      : item('period_return', '구간 수익률', 'RULE-DS-002', 'impossible',
          'return 또는 price 컬럼이 필요합니다.', ['return 또는 price']),

    // RULE-DS-003: drawdown / MDD
    hasData
      ? !ctx.hasDate
        ? item('drawdown_mdd', 'Drawdown / MDD', 'RULE-DS-003', 'limited',
            '날짜 컬럼이 없어 드로다운 시계열 표시 제한. MDD 수치 계산은 가능합니다.')
        : ctx.rowCount < 30
          ? item('drawdown_mdd', 'Drawdown / MDD', 'RULE-DS-003', 'limited',
              `데이터 ${ctx.rowCount}행 — MDD 신뢰도 낮음 (권장: 30행 이상).`)
          : item('drawdown_mdd', 'Drawdown / MDD', 'RULE-DS-003', 'possible', '분석 가능합니다.')
      : item('drawdown_mdd', 'Drawdown / MDD', 'RULE-DS-003', 'impossible',
          'return 또는 price 컬럼이 필요합니다.', ['return 또는 price']),

    // RULE-DS-004: annualized volatility
    hasData
      ? ctx.rowCount < 10
        ? item('annualized_volatility', '연환산 변동성', 'RULE-DS-004', 'limited',
            `데이터 ${ctx.rowCount}행 — 변동성 추정 신뢰도 낮음 (권장: 30행 이상).`)
        : item('annualized_volatility', '연환산 변동성', 'RULE-DS-004', 'possible', '분석 가능합니다.')
      : item('annualized_volatility', '연환산 변동성', 'RULE-DS-004', 'impossible',
          'return 또는 price 컬럼이 필요합니다.', ['return 또는 price']),

    // RULE-DS-005: allocation analysis
    ctx.hasWeight
      ? item('allocation_analysis', '비중 분석', 'RULE-DS-005', 'possible',
          '비중 차트를 생성할 수 있습니다.')
      : item('allocation_analysis', '비중 분석', 'RULE-DS-005', 'impossible',
          'weight 컬럼이 필요합니다.', ['weight']),

    // RULE-DS-006: benchmark comparison
    ctx.hasBenchmark && hasData
      ? item('benchmark_comparison', '벤치마크 비교', 'RULE-DS-006', 'possible',
          '벤치마크 비교 차트를 생성할 수 있습니다.')
      : !ctx.hasBenchmark
        ? item('benchmark_comparison', '벤치마크 비교', 'RULE-DS-006', 'impossible',
            'benchmark_return 컬럼이 필요합니다. 해당 컬럼 없이 벤치마크 비교 불가.',
            ['benchmark_return'])
        : item('benchmark_comparison', '벤치마크 비교', 'RULE-DS-006', 'impossible',
            'return 또는 price 컬럼도 필요합니다.',
            ['return 또는 price', 'benchmark_return']),
  ];

  return items;
}

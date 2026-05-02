import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { checkSufficiency } from '../utils/sufficiency';
import { computeMetrics } from '../utils/financialCalc';
import type { SufficiencyStatus } from '../types';

function StatusBadge({ status }: { status: SufficiencyStatus }) {
  const map = {
    possible: 'bg-green-50 text-green-700 border-green-200',
    limited: 'bg-amber-50 text-amber-700 border-amber-200',
    impossible: 'bg-red-50 text-red-600 border-red-200',
  };
  const label = { possible: '✓ 가능', limited: '△ 제한적 가능', impossible: '✗ 불가' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default function SufficiencyScreen() {
  const {
    columnMappings,
    rawData,
    headers,
    rowCount,
    goalCategory,
    sufficiencyItems,
    setSufficiencyItems,
    setMetrics,
    addSkillLog,
    goToStep,
  } = useAppStore();

  useEffect(() => {
    const items = checkSufficiency(columnMappings, rowCount);
    setSufficiencyItems(items);

    // Log sufficiency checks
    items.forEach((item) => {
      addSkillLog({
        ruleId: item.ruleId,
        category: 'sufficiency',
        input: `analysis=${item.id}, rowCount=${rowCount}`,
        output: `status=${item.status}`,
        reason: item.reason,
        deterministic: true,
      });
    });

    // Pre-compute metrics
    if (rawData.length > 0) {
      const metrics = computeMetrics(rawData, headers, columnMappings);
      setMetrics(metrics);

      // Log metric calculations
      addSkillLog({
        ruleId: 'RULE-AN-001',
        category: 'metric',
        input: `rows=${rawData.length}, returnCol=${columnMappings.find(m=>m.category==='return')?.column ?? 'none'}, priceCol=${columnMappings.find(m=>m.category==='price')?.column ?? 'none'}`,
        output: `cumulativeReturn=${metrics.cumulativeReturn.toFixed(4)}, tradingDays=${metrics.tradingDays}`,
        reason: '누적 수익률: ∏(1+r_t)−1 (RULE-AN-001). 결정적 계산.',
        deterministic: true,
      });

      addSkillLog({
        ruleId: 'RULE-AN-002',
        category: 'metric',
        input: `equityCurve points=${metrics.equityCurve.length}`,
        output: `mdd=${metrics.mdd.toFixed(4)}`,
        reason: 'MDD: min(V_t/max(V_0..V_t)−1) (RULE-AN-002). 결정적 계산.',
        deterministic: true,
      });

      addSkillLog({
        ruleId: 'RULE-AN-003',
        category: 'metric',
        input: `tradingDays=${metrics.tradingDays}`,
        output: `annualizedVolatility=${metrics.annualizedVolatility.toFixed(4)}`,
        reason: '연환산 변동성: std(일별수익률)×√252 (RULE-AN-003). 결정적 계산.',
        deterministic: true,
      });
    }
  }, []);

  const possibleItems = sufficiencyItems.filter((i) => i.status !== 'impossible');
  const impossibleItems = sufficiencyItems.filter((i) => i.status === 'impossible');

  const goalLabel = goalCategory
    ? { performance: '성과 분석', risk: '위험 분석', allocation: '비중 분석', full: '전체 진단' }[goalCategory]
    : '전체 진단';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">Step 4/5</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">충분성 판정</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">데이터 충분성 판정</h1>
          <p className="text-sm text-gray-500 mt-1">
            분석 목적: <strong>{goalLabel}</strong> · 각 분석 항목의 실행 가능 여부를 판정했습니다.
          </p>
        </div>

        {/* Sufficiency table */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">분석 항목별 판정</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              RULE-DS-001 ~ RULE-DS-006 기반 결정적 판정
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {sufficiencyItems.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <span className="text-xs font-mono text-gray-400">{item.ruleId}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                  {item.requiredColumns && (
                    <p className="text-xs text-red-500 mt-0.5">
                      필요 컬럼: {item.requiredColumns.join(', ')}
                    </p>
                  )}
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {sufficiencyItems.filter((i) => i.status === 'possible').length}
            </div>
            <div className="text-xs text-green-600 mt-1">가능</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {sufficiencyItems.filter((i) => i.status === 'limited').length}
            </div>
            <div className="text-xs text-amber-600 mt-1">제한적 가능</div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {impossibleItems.length}
            </div>
            <div className="text-xs text-red-500 mt-1">불가</div>
          </div>
        </div>

        {/* Impossible items notice */}
        {impossibleItems.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">불가 항목 제외 고지</h3>
            <p className="text-xs text-gray-500 mb-2">
              아래 항목은 필요한 컬럼이 없어 대시보드에서 제외됩니다 (RULE-DS 판정).
            </p>
            <div className="space-y-1">
              {impossibleItems.map((item) => (
                <div key={item.id} className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span className="font-medium">{item.name}</span>
                  <span>— {item.requiredColumns?.join(', ') ?? '데이터 부족'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proceed notice */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-indigo-700">
            <strong>{possibleItems.length}개 분석 항목</strong>으로 대시보드를 생성합니다.
            불가 항목은 "데이터 부족" 패널로 표시됩니다.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => goToStep(3)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            ← 뒤로
          </button>
          <button
            onClick={() => goToStep(5)}
            disabled={possibleItems.length === 0}
            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            가능한 분석으로 대시보드 생성 →
          </button>
        </div>
      </div>
    </div>
  );
}

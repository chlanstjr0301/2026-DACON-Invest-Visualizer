import { useEffect, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { generateInsights } from '../utils/insightRules';
import { fmtPct } from '../utils/financialCalc';
import { analyzePortfolio, buildAnalyzeRequest } from '../api/analyzeClient';
import type { SkillLogCategory } from '../types';
import AnalystPanel from '../components/AnalystPanel';
import SkillsLogPanel from '../components/SkillsLogPanel';

type AddSkillLogFn = (entry: {
  ruleId: string; category: SkillLogCategory;
  input: string; output: string; reason: string; deterministic: boolean;
}) => void;

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

function RuleBadge({ ruleId }: { ruleId: string }) {
  return (
    <span className="font-mono text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
      {ruleId}
    </span>
  );
}

function MetricCard({ title, value, sub, color, ruleId }: {
  title: string; value: string; sub?: string; color: string; ruleId: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      <div className="mt-auto pt-2"><RuleBadge ruleId={ruleId} /></div>
    </div>
  );
}

function ChartCard({ title, ruleId, children }: {
  title: string; ruleId: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <RuleBadge ruleId={ruleId} />
      </div>
      {children}
    </div>
  );
}

function tickFormatter(dateStr: string): string {
  if (!dateStr || dateStr.startsWith('T+')) return dateStr;
  return dateStr.slice(5);
}

function pctEquityFormatter(val: number): string { return fmtPct(val - 1); }
function pctDirectFormatter(val: number): string { return fmtPct(val); }

// ── Visualization log helper ──────────────────────────────────────────────────

function logVizEntries(
  addSkillLog: AddSkillLogFn,
  hasAllocation: boolean,
  hasBenchmark: boolean,
) {
  addSkillLog({ ruleId: 'RULE-VZ-001', category: 'visualization', input: 'analysis_type=cumulative_return', output: 'chart=line_chart', reason: '시계열 추이 → 선 차트 (RULE-VZ-001)', deterministic: true });
  addSkillLog({ ruleId: 'RULE-VZ-002', category: 'visualization', input: 'analysis_type=drawdown', output: 'chart=area_chart', reason: '드로다운 음수 구간 강조 → 영역 차트 (RULE-VZ-002)', deterministic: true });
  if (hasAllocation) addSkillLog({ ruleId: 'RULE-VZ-003', category: 'visualization', input: 'analysis_type=allocation', output: 'chart=pie_chart', reason: '비중 구성 → 파이 차트 (RULE-VZ-003)', deterministic: true });
  if (hasBenchmark) addSkillLog({ ruleId: 'RULE-VZ-004', category: 'visualization', input: 'analysis_type=benchmark', output: 'chart=multi_line_chart', reason: '포트폴리오-벤치마크 → 멀티시리즈 선 차트 (RULE-VZ-004)', deterministic: true });
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const {
    metrics, sufficiencyItems, goalCategory,
    filename, skillLogs, addSkillLog, goToStep,
  } = useAppStore();

  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [aiModel, setAiModel] = useState<string | undefined>(undefined);
  const [logPanelOpen, setLogPanelOpen] = useState(false);

  useEffect(() => {
    if (!metrics) return;

    // Log visualization decisions (always deterministic)
    logVizEntries(
      addSkillLog,
      !!(metrics.allocationData && metrics.allocationData.length > 0),
      !!metrics.benchmarkSeries,
    );

    // Try AI API, fall back to rule-based
    setInsightsLoading(true);
    setInsightsError(null);

    const request = buildAnalyzeRequest(
      metrics, sufficiencyItems, goalCategory, filename, skillLogs,
    );

    analyzePortfolio(request)
      .then((res) => {
        setInsights(res.insights);
        setUsingFallback(false);
        setAiModel(res.model);
        // Log the AI analysis event
        addSkillLog({
          ruleId: 'RULE-IN-AI',
          category: 'insight',
          input: `goal=${goalCategory}, tradingDays=${metrics.tradingDays}`,
          output: `model=${res.model}, lines=${res.insights.length}`,
          reason: `OpenAI Responses API 호출 성공. RULE-PO-001 가드레일 적용된 system prompt 사용.`,
          deterministic: false,
        });
      })
      .catch((err: Error) => {
        console.warn('[LENS] API unavailable, using rule-based fallback:', err.message);
        // Graceful fallback to rule-based insights
        const { insights: ins, logs } = generateInsights(metrics, sufficiencyItems, goalCategory);
        setInsights(ins);
        setUsingFallback(true);
        setInsightsError(err.message);
        setAiModel(undefined);
        logs.forEach((log) => addSkillLog(log));
      })
      .finally(() => setInsightsLoading(false));
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">메트릭 데이터가 없습니다.</div>
      </div>
    );
  }

  const isPossible = (id: string) =>
    sufficiencyItems.find((s) => s.id === id)?.status !== 'impossible';

  const mddColor = metrics.mdd < -0.2 ? 'text-red-600' : metrics.mdd < -0.1 ? 'text-amber-600' : 'text-green-600';
  const cumRetColor = metrics.cumulativeReturn >= 0 ? 'text-green-600' : 'text-red-600';
  const volColor = metrics.annualizedVolatility > 0.3 ? 'text-red-500' : metrics.annualizedVolatility > 0.15 ? 'text-amber-500' : 'text-green-600';

  const maxPts = 80;
  const step = Math.max(1, Math.ceil(metrics.equityCurve.length / maxPts));
  const equityData = metrics.equityCurve.filter((_, i) => i % step === 0 || i === metrics.equityCurve.length - 1);
  const ddData = metrics.drawdownSeries.filter((_, i) => i % step === 0 || i === metrics.drawdownSeries.length - 1);
  const bmData = metrics.benchmarkSeries
    ? metrics.benchmarkSeries.filter((_, i) => i % step === 0 || i === metrics.benchmarkSeries!.length - 1)
    : null;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 40px)' }}>
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Dashboard canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">대시보드</h2>
              <p className="text-xs text-gray-400">
                {filename} · {metrics.dataStartDate} ~ {metrics.dataEndDate} · {metrics.tradingDays}거래일
              </p>
            </div>
            <button onClick={() => goToStep(4)} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1">
              ← 충분성 판정
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3">
            {isPossible('cumulative_return') && (
              <MetricCard title="누적 수익률" value={fmtPct(metrics.cumulativeReturn)}
                sub={`${metrics.dataStartDate} ~ ${metrics.dataEndDate}`} color={cumRetColor} ruleId="RULE-AN-001" />
            )}
            {isPossible('drawdown_mdd') && (
              <MetricCard title="최대 낙폭 (MDD)" value={fmtPct(metrics.mdd)}
                sub={metrics.mdd < -0.2 ? '⚠ 위험 주의' : metrics.mdd < -0.1 ? '△ 경계' : '✓ 양호'}
                color={mddColor} ruleId="RULE-AN-002" />
            )}
            {isPossible('annualized_volatility') && (
              <MetricCard title="연환산 변동성" value={fmtPct(metrics.annualizedVolatility)}
                sub={`std×√252 · ${metrics.tradingDays}일 기준`} color={volColor} ruleId="RULE-AN-003" />
            )}
          </div>

          {/* Equity curve */}
          {isPossible('cumulative_return') && equityData.length > 1 && (
            <ChartCard title="누적 수익률 (Equity Curve)" ruleId="RULE-VZ-001">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={tickFormatter} tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={pctEquityFormatter} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => [fmtPct(val - 1), '누적 수익률']} labelFormatter={(l) => `날짜: ${l}`} />
                  <Line type="monotone" dataKey="equity" stroke="#6366f1" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Drawdown */}
          {isPossible('drawdown_mdd') && ddData.length > 1 && (
            <ChartCard title="Drawdown 시계열" ruleId="RULE-VZ-002">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={ddData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={tickFormatter} tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={pctDirectFormatter} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => [fmtPct(val), 'Drawdown']} labelFormatter={(l) => `날짜: ${l}`} />
                  <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="#fee2e2" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Period returns */}
          {isPossible('period_return') && metrics.periodReturns.length > 0 && (
            <ChartCard title="구간 수익률" ruleId="RULE-AN-001">
              <div className="overflow-x-auto max-h-48 scrollbar-thin">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-500 font-medium">구간</th>
                      <th className="px-3 py-2 text-right text-gray-500 font-medium">수익률</th>
                      <th className="px-3 py-2 text-right text-gray-500 font-medium">방향</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {metrics.periodReturns.map((pr) => (
                      <tr key={pr.period} className="hover:bg-gray-50">
                        <td className="px-3 py-1.5 text-gray-700 font-medium">{pr.period}</td>
                        <td className={`px-3 py-1.5 text-right font-mono font-medium ${pr.return >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {fmtPct(pr.return)}
                        </td>
                        <td className="px-3 py-1.5 text-right">{pr.return >= 0 ? '▲' : '▼'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          )}

          {/* Allocation */}
          {isPossible('allocation_analysis') && metrics.allocationData && metrics.allocationData.length > 0 && (
            <ChartCard title="자산 비중 분포 (최신 시점)" ruleId="RULE-VZ-003">
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={metrics.allocationData} dataKey="weight" nameKey="name"
                      cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
                      labelLine={false}>
                      {metrics.allocationData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [val.toFixed(2), '비중']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {metrics.allocationData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-gray-700 flex-1">{item.name}</span>
                      <span className="font-mono text-gray-500">{item.weight.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          )}

          {/* Benchmark */}
          {isPossible('benchmark_comparison') && bmData && bmData.length > 1 && (
            <ChartCard title="포트폴리오 vs 벤치마크" ruleId="RULE-VZ-004">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bmData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={tickFormatter} tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={pctEquityFormatter} tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: number, name: string) => [fmtPct(val - 1), name === 'portfolio' ? '포트폴리오' : '벤치마크']}
                    labelFormatter={(l) => `날짜: ${l}`}
                  />
                  <Legend formatter={(v) => v === 'portfolio' ? '포트폴리오' : '벤치마크'} />
                  <Line type="monotone" dataKey="portfolio" stroke="#6366f1" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="benchmark" stroke="#10b981" dot={false} strokeWidth={2} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-1">※ 업로드 파일 기준. 시장 지수 비교 아님.</p>
            </ChartCard>
          )}

          {/* Impossible items */}
          {sufficiencyItems.filter((s) => s.status === 'impossible').length > 0 && (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2">데이터 부족 — 제외된 분석</h3>
              <div className="flex flex-wrap gap-2">
                {sufficiencyItems.filter((s) => s.status === 'impossible').map((s) => (
                  <span key={s.id} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    ✗ {s.name} ({s.ruleId})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Analyst Panel */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          <AnalystPanel
            insights={insights}
            loading={insightsLoading}
            error={insightsError}
            usingFallback={usingFallback}
            model={aiModel}
          />
        </div>
      </div>

      {/* BOTTOM: Skills Log */}
      <SkillsLogPanel isOpen={logPanelOpen} onToggle={() => setLogPanelOpen(!logPanelOpen)} />
    </div>
  );
}

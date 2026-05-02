/**
 * LENS API Client
 *
 * Frontend API client that calls the backend /api/analyze endpoint.
 * This module NEVER imports OpenAI SDK directly.
 * The OpenAI API key lives only in the backend .env file.
 */
import type { ComputedMetrics, SufficiencyItem, SkillLogEntry } from '../types';

// ── Request / Response types ─────────────────────────────────────────────────

export interface AnalyzeRequest {
  goal: string;
  datasetSummary: {
    filename: string;
    tradingDays: number;
    dataStartDate: string;
    dataEndDate: string;
    availableAnalyses: string[];
    impossibleAnalyses: string[];
  };
  metricSummary: {
    cumulativeReturn?: number;
    mdd?: number;
    annualizedVolatility?: number;
    periodReturns?: { period: string; return: number }[];
    allocationTop5?: { name: string; weight: number }[];
    benchmarkComparison?: {
      portfolioReturn: number;
      benchmarkReturn: number;
      diff: number;
    };
  };
  limitations: string[];
  skillsLog: { ruleId: string; category: string; input: string; output: string }[];
}

export interface AnalyzeResponse {
  insights: string[];
  model: string;
  usage?: { input_tokens: number; output_tokens: number };
}

// ── Request builder ───────────────────────────────────────────────────────────

/**
 * Build an AnalyzeRequest from the computed frontend state.
 * Only sends metric summaries — NOT the raw CSV data.
 */
export function buildAnalyzeRequest(
  metrics: ComputedMetrics,
  sufficiencyItems: SufficiencyItem[],
  goalCategory: string | null,
  filename: string,
  skillLogs: SkillLogEntry[],
): AnalyzeRequest {
  const isPossible = (id: string) =>
    sufficiencyItems.find((s) => s.id === id)?.status !== 'impossible';

  const availableAnalyses = sufficiencyItems
    .filter((s) => s.status !== 'impossible')
    .map((s) => s.name);

  const impossibleAnalyses = sufficiencyItems
    .filter((s) => s.status === 'impossible')
    .map((s) => `${s.name}: ${s.reason}`);

  const metricSummary: AnalyzeRequest['metricSummary'] = {};

  if (isPossible('cumulative_return')) {
    metricSummary.cumulativeReturn = metrics.cumulativeReturn;
  }
  if (isPossible('drawdown_mdd')) {
    metricSummary.mdd = metrics.mdd;
  }
  if (isPossible('annualized_volatility')) {
    metricSummary.annualizedVolatility = metrics.annualizedVolatility;
  }
  if (isPossible('period_return') && metrics.periodReturns.length > 0) {
    // Overall period + up to 12 monthly entries
    metricSummary.periodReturns = metrics.periodReturns.slice(0, 13);
  }
  if (isPossible('allocation_analysis') && metrics.allocationData) {
    metricSummary.allocationTop5 = [...metrics.allocationData]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }
  if (isPossible('benchmark_comparison') && metrics.benchmarkSeries) {
    const last = metrics.benchmarkSeries[metrics.benchmarkSeries.length - 1];
    const portR = last.portfolio - 1;
    const bmR = last.benchmark - 1;
    metricSummary.benchmarkComparison = {
      portfolioReturn: portR,
      benchmarkReturn: bmR,
      diff: portR - bmR,
    };
  }

  return {
    goal: goalCategory ?? 'full',
    datasetSummary: {
      filename,
      tradingDays: metrics.tradingDays,
      dataStartDate: metrics.dataStartDate,
      dataEndDate: metrics.dataEndDate,
      availableAnalyses,
      impossibleAnalyses,
    },
    metricSummary,
    limitations: impossibleAnalyses,
    // Only send non-insight, deterministic logs (max 20 entries)
    skillsLog: skillLogs
      .filter((l) => l.category !== 'insight' && l.category !== 'visualization')
      .slice(-20)
      .map((l) => ({
        ruleId: l.ruleId,
        category: l.category,
        input: l.input,
        output: l.output,
      })),
  };
}

// ── API call ──────────────────────────────────────────────────────────────────

export async function analyzePortfolio(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error((body as { error?: string }).error ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<AnalyzeResponse>;
}

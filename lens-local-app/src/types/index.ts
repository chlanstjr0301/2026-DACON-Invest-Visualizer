export type ColumnCategory =
  | 'date'
  | 'ticker'
  | 'asset_name'
  | 'return'
  | 'price'
  | 'weight'
  | 'benchmark_return'
  | 'unknown';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ColumnMapping {
  column: string;
  category: ColumnCategory;
  confidence: ConfidenceLevel;
  confirmed: boolean;
}

export type GoalCategoryId = 'performance' | 'risk' | 'allocation' | 'full';

export interface GoalOption {
  id: GoalCategoryId;
  label: string;
  description: string;
  keywords: string[];
}

export type SufficiencyStatus = 'possible' | 'limited' | 'impossible';

export interface SufficiencyItem {
  id: string;
  name: string;
  status: SufficiencyStatus;
  reason: string;
  requiredColumns?: string[];
  ruleId: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  cumulativeReturn: number;
}

export interface DrawdownPoint {
  date: string;
  drawdown: number;
}

export interface PeriodReturn {
  period: string;
  return: number;
}

export interface AllocationItem {
  name: string;
  weight: number;
  ticker?: string;
}

export interface BenchmarkPoint {
  date: string;
  portfolio: number;
  benchmark: number;
}

export interface ComputedMetrics {
  equityCurve: EquityPoint[];
  drawdownSeries: DrawdownPoint[];
  mdd: number;
  annualizedVolatility: number;
  cumulativeReturn: number;
  periodReturns: PeriodReturn[];
  allocationData: AllocationItem[] | null;
  benchmarkSeries: BenchmarkPoint[] | null;
  dataStartDate: string;
  dataEndDate: string;
  tradingDays: number;
}

export type SkillLogCategory =
  | 'column_mapping'
  | 'sufficiency'
  | 'metric'
  | 'visualization'
  | 'insight';

export interface SkillLogEntry {
  id: string;
  ruleId: string;
  category: SkillLogCategory;
  input: string;
  output: string;
  reason: string;
  deterministic: boolean;
  timestamp: string;
}

export type AppStep = 1 | 2 | 3 | 4 | 5;

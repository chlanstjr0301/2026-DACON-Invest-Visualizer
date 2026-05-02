import type {
  ColumnMapping,
  ComputedMetrics,
  EquityPoint,
  DrawdownPoint,
  PeriodReturn,
  AllocationItem,
  BenchmarkPoint,
} from '../types';

type RawRow = Record<string, string>;

function parseNumber(val: string | undefined): number | null {
  if (!val || val.trim() === '' || val.trim() === '-') return null;
  const n = parseFloat(val.replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

function parseDate(val: string | undefined): string {
  if (!val) return '';
  const s = val.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return s;
}

function getYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function getMappedColumn(mappings: ColumnMapping[], category: string): string | null {
  const m = mappings.find((m) => m.category === category && m.category !== 'unknown');
  return m ? m.column : null;
}

interface AggregatedRow {
  date: string;
  portfolioReturn: number;
  benchmarkReturn: number | null;
}

function aggregateRows(
  rows: RawRow[],
  dateCol: string | null,
  returnCol: string | null,
  weightCol: string | null,
  benchmarkCol: string | null,
): AggregatedRow[] {
  if (!returnCol) return [];

  // Detect multi-row-per-date (holdings format)
  const dateCounts: Record<string, number> = {};
  if (dateCol) {
    for (const row of rows) {
      const d = parseDate(row[dateCol]);
      if (d) dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
  }
  const isHoldings = Object.values(dateCounts).some((c) => c > 1);

  if (!isHoldings) {
    // Simple: one row per date — RULE-AN-000
    return rows
      .map((row) => {
        const ret = parseNumber(row[returnCol]);
        if (ret === null) return null;
        const bm = benchmarkCol ? parseNumber(row[benchmarkCol]) : null;
        return {
          date: dateCol ? parseDate(row[dateCol]) : '',
          portfolioReturn: ret,
          benchmarkReturn: bm,
        };
      })
      .filter((r): r is AggregatedRow => r !== null);
  }

  // Holdings: aggregate by date using weighted average
  const dateMap: Record<string, { returns: number[]; weights: number[] }> = {};
  for (const row of rows) {
    if (!dateCol) continue;
    const d = parseDate(row[dateCol]);
    const ret = parseNumber(row[returnCol]);
    const wgt = weightCol ? (parseNumber(row[weightCol]) ?? 1) : 1;
    if (ret === null || !d) continue;
    if (!dateMap[d]) dateMap[d] = { returns: [], weights: [] };
    dateMap[d].returns.push(ret);
    dateMap[d].weights.push(wgt);
  }

  return Object.entries(dateMap)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, { returns, weights }]) => {
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const weightedReturn =
        totalWeight > 0
          ? returns.reduce((acc, r, i) => acc + r * weights[i], 0) / totalWeight
          : returns.reduce((a, b) => a + b, 0) / returns.length;
      return { date, portfolioReturn: weightedReturn, benchmarkReturn: null };
    });
}

export function computeMetrics(
  rawData: string[][],
  headers: string[],
  mappings: ColumnMapping[],
): ComputedMetrics {
  const dateCol = getMappedColumn(mappings, 'date');
  const returnCol = getMappedColumn(mappings, 'return');
  const priceCol = getMappedColumn(mappings, 'price');
  const weightCol = getMappedColumn(mappings, 'weight');
  const benchmarkCol = getMappedColumn(mappings, 'benchmark_return');
  const nameCol = getMappedColumn(mappings, 'asset_name');
  const tickerCol = getMappedColumn(mappings, 'ticker');

  // Build row objects
  const rows: RawRow[] = rawData.map((row) => {
    const obj: RawRow = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
    return obj;
  });

  // Sort by date
  if (dateCol) {
    rows.sort((a, b) => {
      const da = parseDate(a[dateCol]);
      const db = parseDate(b[dateCol]);
      return da < db ? -1 : da > db ? 1 : 0;
    });
  }

  // Derive daily returns
  let aggregated: AggregatedRow[] = [];

  if (returnCol) {
    aggregated = aggregateRows(rows, dateCol, returnCol, weightCol, benchmarkCol);
  } else if (priceCol) {
    // Compute pct_change from price — RULE-AN-000
    const prices: { date: string; price: number }[] = [];
    for (const row of rows) {
      const p = parseNumber(row[priceCol]);
      if (p !== null && p > 0) {
        prices.push({ date: dateCol ? parseDate(row[dateCol]) : '', price: p });
      }
    }
    for (let i = 1; i < prices.length; i++) {
      aggregated.push({
        date: prices[i].date,
        portfolioReturn: (prices[i].price - prices[i - 1].price) / prices[i - 1].price,
        benchmarkReturn: null,
      });
    }
  }

  const dailyReturns = aggregated.map((r) => r.portfolioReturn);
  const dates = aggregated.map((r) => r.date);

  // Equity curve — RULE-AN-001
  const equityCurve: EquityPoint[] = [];
  const equityValues: number[] = [];
  let equity = 1.0;

  // Starting point
  equityCurve.push({ date: dates[0] ?? 'T+0', equity: 1.0, cumulativeReturn: 0 });
  equityValues.push(1.0);

  for (let i = 0; i < dailyReturns.length; i++) {
    equity = equity * (1 + dailyReturns[i]);
    equityValues.push(equity);
    equityCurve.push({
      date: dates[i] || `T+${i + 1}`,
      equity,
      cumulativeReturn: equity - 1,
    });
  }

  const cumulativeReturn = equity - 1;

  // Drawdown series — RULE-AN-002
  const drawdownSeries: DrawdownPoint[] = [];
  let runningMax = 1.0;
  for (let i = 0; i < equityValues.length; i++) {
    runningMax = Math.max(runningMax, equityValues[i]);
    drawdownSeries.push({
      date: equityCurve[i].date,
      drawdown: equityValues[i] / runningMax - 1,
    });
  }

  const mdd = drawdownSeries.length > 0 ? Math.min(...drawdownSeries.map((d) => d.drawdown)) : 0;

  // Annualized volatility — RULE-AN-003
  let annualizedVolatility = 0;
  if (dailyReturns.length >= 2) {
    const n = dailyReturns.length;
    const mean = dailyReturns.reduce((a, b) => a + b, 0) / n;
    const variance = dailyReturns.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1);
    annualizedVolatility = Math.sqrt(variance) * Math.sqrt(252);
  }

  // Period returns
  const monthlyMap: Record<string, number[]> = {};
  for (let i = 0; i < dailyReturns.length; i++) {
    const ym = getYearMonth(dates[i]);
    if (!monthlyMap[ym]) monthlyMap[ym] = [];
    monthlyMap[ym].push(dailyReturns[i]);
  }
  const periodReturns: PeriodReturn[] = [{ period: '전체 기간', return: cumulativeReturn }];
  for (const [ym, rs] of Object.entries(monthlyMap).sort()) {
    if (ym && ym !== 'undefined') {
      const mr = rs.reduce((acc, r) => acc * (1 + r), 1) - 1;
      periodReturns.push({ period: ym, return: mr });
    }
  }

  // Allocation data
  let allocationData: AllocationItem[] | null = null;
  if (weightCol) {
    const latestDate = dateCol
      ? rows.reduce((latest, row) => {
          const d = parseDate(row[dateCol]);
          return d > latest ? d : latest;
        }, '')
      : null;

    const targetRows = latestDate
      ? rows.filter((row) => parseDate(row[dateCol!]) === latestDate)
      : rows;

    const items = targetRows
      .map((row) => ({
        name: nameCol ? (row[nameCol] || '미분류') : tickerCol ? (row[tickerCol] || '미분류') : '미분류',
        weight: parseNumber(row[weightCol]) ?? 0,
        ticker: tickerCol ? row[tickerCol] : undefined,
      }))
      .filter((d) => d.weight > 0);

    if (items.length > 0) allocationData = items;
  }

  // Benchmark series
  let benchmarkSeries: BenchmarkPoint[] | null = null;
  if (benchmarkCol && aggregated.some((r) => r.benchmarkReturn !== null)) {
    let portEq = 1.0;
    let bmEq = 1.0;
    benchmarkSeries = [{ date: dates[0] ?? 'T+0', portfolio: 1.0, benchmark: 1.0 }];
    for (let i = 0; i < aggregated.length; i++) {
      portEq = portEq * (1 + aggregated[i].portfolioReturn);
      bmEq = bmEq * (1 + (aggregated[i].benchmarkReturn ?? 0));
      benchmarkSeries.push({ date: aggregated[i].date, portfolio: portEq, benchmark: bmEq });
    }
  }

  return {
    equityCurve,
    drawdownSeries,
    mdd,
    annualizedVolatility,
    cumulativeReturn,
    periodReturns,
    allocationData,
    benchmarkSeries,
    dataStartDate: dates[0] ?? '',
    dataEndDate: dates[dates.length - 1] ?? '',
    tradingDays: dailyReturns.length,
  };
}

export function fmtPct(n: number, decimals = 2): string {
  return (n * 100).toFixed(decimals) + '%';
}

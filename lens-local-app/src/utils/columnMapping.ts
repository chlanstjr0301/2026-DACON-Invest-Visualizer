import type { ColumnCategory, ColumnMapping, ConfidenceLevel } from '../types';

const MAPPING_PATTERNS: Record<Exclude<ColumnCategory, 'unknown'>, string[]> = {
  date: ['date', '날짜', '일자', '기준일', 'trade_date', 'trading_date', 'dt', 'timestamp', 'ymd'],
  return: [
    'return', 'returns', 'ret', '수익률', '일별수익률', 'pnl',
    'portfolio_return', 'daily_return', 'port_return', 'daily_ret',
  ],
  price: ['price', 'close', 'adj_close', 'nav', '종가', '수정주가', 'adjusted_close', 'adj_price'],
  weight: ['weight', '비중', 'allocation', 'w', 'wgt', 'port_weight'],
  ticker: ['ticker', 'symbol', 'code', '종목코드', 'isin'],
  asset_name: ['name', 'asset', '종목명', '자산명', 'asset_name', 'security_name'],
  benchmark_return: ['benchmark_return', 'bm_return', '벤치마크수익률', 'bench_return', 'index_return', 'bm'],
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_\-]/g, '');
}

export function inferColumnCategory(column: string): {
  category: ColumnCategory;
  confidence: ConfidenceLevel;
} {
  const norm = normalize(column);

  // Exact match → high confidence
  for (const [cat, patterns] of Object.entries(MAPPING_PATTERNS) as [Exclude<ColumnCategory, 'unknown'>, string[]][]) {
    for (const p of patterns) {
      if (norm === normalize(p)) {
        return { category: cat, confidence: 'high' };
      }
    }
  }

  // Contains match → medium confidence
  for (const [cat, patterns] of Object.entries(MAPPING_PATTERNS) as [Exclude<ColumnCategory, 'unknown'>, string[]][]) {
    for (const p of patterns) {
      const normP = normalize(p);
      if (norm.includes(normP) || normP.includes(norm)) {
        return { category: cat, confidence: 'medium' };
      }
    }
  }

  // Weak heuristics → low confidence
  if (/date|dt|day|month|year|time/.test(norm)) return { category: 'date', confidence: 'low' };
  if (/ret|rtn|return|profit|loss|pnl|yield/.test(norm)) return { category: 'return', confidence: 'low' };
  if (/price|close|nav|val/.test(norm)) return { category: 'price', confidence: 'low' };
  if (/weight|alloc|wgt/.test(norm)) return { category: 'weight', confidence: 'low' };

  return { category: 'unknown', confidence: 'low' };
}

export function inferColumnMappings(headers: string[]): ColumnMapping[] {
  return headers.map((col) => {
    const { category, confidence } = inferColumnCategory(col);
    return {
      column: col,
      category,
      confidence,
      confirmed: confidence === 'high',
    };
  });
}

export function getCategoryLabel(cat: ColumnCategory): string {
  const labels: Record<ColumnCategory, string> = {
    date: '날짜',
    return: '수익률',
    price: '가격',
    weight: '비중',
    ticker: '종목코드',
    asset_name: '종목명',
    benchmark_return: '벤치마크 수익률',
    unknown: '미분류',
  };
  return labels[cat];
}

export const COLUMN_CATEGORIES: ColumnCategory[] = [
  'date', 'return', 'price', 'weight', 'ticker', 'asset_name', 'benchmark_return', 'unknown',
];

export function getConfidenceLabel(c: ConfidenceLevel): string {
  return { high: '높음', medium: '보통', low: '낮음' }[c];
}

export function getConfidenceColor(c: ConfidenceLevel): string {
  return { high: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', low: 'text-red-600 bg-red-50' }[c];
}

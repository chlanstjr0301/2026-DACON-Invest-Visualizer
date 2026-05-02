interface Props {
  insights: string[];
  loading?: boolean;
  error?: string | null;
  usingFallback?: boolean;
  model?: string;
}

function renderLine(line: string, idx: number) {
  if (line === '') return <div key={idx} className="h-2" />;
  if (line === '---') return <hr key={idx} className="border-gray-200 my-2" />;

  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={idx} className="text-sm text-gray-700 leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-gray-900 font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export default function AnalystPanel({ insights, loading, error, usingFallback, model }: Props) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            AI Analyst Panel
          </span>
          {loading && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded animate-pulse">
              분석 중...
            </span>
          )}
          {!loading && usingFallback && (
            <span
              className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
              title={error ?? ''}
            >
              rule-based fallback
            </span>
          )}
          {!loading && !usingFallback && model && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {model}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {usingFallback
            ? 'RULE-IN-xxx 템플릿 기반 해석 · 투자 권유 없음 (RULE-PO-001)'
            : 'OpenAI Responses API · 투자 권유 없음 (RULE-PO-001)'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-xs">AI 분석 요청 중...</span>
            <span className="text-xs text-gray-300">백엔드 API 호출 중</span>
          </div>
        ) : insights.length === 0 ? (
          <p className="text-sm text-gray-400">분석 결과가 없습니다.</p>
        ) : (
          insights.map((line, i) => renderLine(line, i))
        )}
      </div>
    </div>
  );
}

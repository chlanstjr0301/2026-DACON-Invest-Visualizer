import { useAppStore } from '../store/appStore';
import {
  getCategoryLabel,
  getConfidenceLabel,
  getConfidenceColor,
  COLUMN_CATEGORIES,
} from '../utils/columnMapping';
import type { ColumnCategory } from '../types';

export default function ColumnMappingScreen() {
  const {
    rawData,
    headers,
    rowCount,
    filename,
    columnMappings,
    updateColumnMapping,
    confirmAllMappings,
    addSkillLog,
    goToStep,
  } = useAppStore();

  const previewRows = rawData.slice(0, 5);

  function handleCategoryChange(column: string, category: ColumnCategory) {
    updateColumnMapping(column, category);
    addSkillLog({
      ruleId: 'RULE-CM-002',
      category: 'column_mapping',
      input: `column="${column}", prev_category=auto`,
      output: `category=${category}`,
      reason: `사용자 수동 수정 (RULE-CM-002). 사용자 확인 > AI 추론 우선.`,
      deterministic: true,
    });
  }

  function handleConfirm() {
    confirmAllMappings();
    // Log confirmations
    columnMappings.forEach((m) => {
      addSkillLog({
        ruleId: 'RULE-CM-003',
        category: 'column_mapping',
        input: `column="${m.column}"`,
        output: `confirmed=true, category=${m.category}`,
        reason: `매핑 확정 (RULE-CM-003). confidence=${m.confidence}.`,
        deterministic: true,
      });
    });
    goToStep(3);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">Step 2/5</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">컬럼 매핑</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">컬럼 매핑 확인</h1>
          <p className="text-sm text-gray-500 mt-1">
            <strong>{filename}</strong> · {rowCount}행 · {headers.length}열 ·{' '}
            AI 추론 결과를 확인·수정 후 확정하세요.
          </p>
        </div>

        {/* Data preview */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">데이터 미리보기 (상위 5행)</h2>
            <span className="text-xs text-gray-400 font-mono">RULE-CM-001</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-gray-500 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {previewRows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {headers.map((h, j) => (
                      <td key={j} className="px-3 py-2 text-gray-600 whitespace-nowrap">
                        {row[j] ?? '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mapping table */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">컬럼 매핑 추론 결과</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="text-green-600 font-medium">높음</span> — 자동 확정 가능 ·{' '}
              <span className="text-amber-600 font-medium">보통/낮음</span> — 드롭다운으로 수정 가능
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">컬럼명</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">추론 범주</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">신뢰도</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">확정</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">수정</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {columnMappings.map((m) => (
                  <tr key={m.column} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono text-gray-800">{m.column}</td>
                    <td className="px-4 py-2.5">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-medium">
                        {getCategoryLabel(m.category)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${getConfidenceColor(m.confidence)}`}>
                        {getConfidenceLabel(m.confidence)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {m.confirmed ? (
                        <span className="text-green-600 text-xs">✓ 확정</span>
                      ) : (
                        <span className="text-gray-400 text-xs">미확정</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {m.confidence !== 'high' ? (
                        <select
                          value={m.category}
                          onChange={(e) => handleCategoryChange(m.column, e.target.value as ColumnCategory)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-700"
                        >
                          {COLUMN_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {getCategoryLabel(cat)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-gray-300">자동 확정</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mapping summary */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <h3 className="text-xs font-semibold text-indigo-700 mb-2">매핑 요약</h3>
          <div className="flex flex-wrap gap-2">
            {columnMappings
              .filter((m) => m.category !== 'unknown')
              .map((m) => (
                <span key={m.column} className="text-xs bg-white border border-indigo-200 rounded px-2 py-1 text-indigo-600">
                  <span className="text-gray-500">{m.column}</span> → {getCategoryLabel(m.category)}
                </span>
              ))}
            {columnMappings.filter((m) => m.category === 'unknown').length > 0 && (
              <span className="text-xs text-gray-400">
                + {columnMappings.filter((m) => m.category === 'unknown').length}개 미분류
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => goToStep(1)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            ← 뒤로
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            매핑 확정 →
          </button>
        </div>
      </div>
    </div>
  );
}

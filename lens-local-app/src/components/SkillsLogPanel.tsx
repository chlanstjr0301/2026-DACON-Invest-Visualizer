import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { SkillLogCategory } from '../types';

const TABS: { id: SkillLogCategory; label: string }[] = [
  { id: 'column_mapping', label: '컬럼 매핑' },
  { id: 'sufficiency', label: '충분성' },
  { id: 'metric', label: '지표 계산' },
  { id: 'visualization', label: '시각화' },
  { id: 'insight', label: '인사이트' },
];

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SkillsLogPanel({ isOpen, onToggle }: Props) {
  const { skillLogs } = useAppStore();
  const [activeTab, setActiveTab] = useState<SkillLogCategory>('column_mapping');

  const filtered = skillLogs.filter((l) => l.category === activeTab);

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Toggle header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 font-semibold">Skills Log</span>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">
            {skillLogs.length} 항목
          </span>
          <span className="text-xs text-gray-400">
            심사위원: Skills.md 규칙 적용 근거 확인
          </span>
        </div>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-4">
            {TABS.map((tab) => {
              const count = skillLogs.filter((l) => l.category === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1 text-gray-400">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Log table */}
          <div className="overflow-x-auto max-h-48 scrollbar-thin">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 px-4 py-3">이 탭에 해당하는 로그가 없습니다.</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-28">Rule ID</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-32">Input</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-32">Output</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium">Reason</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-20">결정적</th>
                    <th className="px-3 py-2 text-left text-gray-500 font-medium w-28">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <span className="font-mono text-indigo-600">{log.ruleId}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate" title={log.input}>
                        {log.input}
                      </td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate" title={log.output}>
                        {log.output}
                      </td>
                      <td className="px-3 py-2 text-gray-500 max-w-sm" title={log.reason}>
                        {log.reason}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          log.deterministic
                            ? 'bg-green-50 text-green-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {log.deterministic ? '✓ 결정적' : '~ AI 보조'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-400 font-mono">
                        {log.timestamp.slice(11, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { GoalCategoryId } from '../types';

const GOAL_CARDS: { id: GoalCategoryId; label: string; icon: string; description: string; keywords: string[] }[] = [
  {
    id: 'performance',
    label: '성과 분석',
    icon: '📈',
    description: '누적 수익률, 구간 수익률',
    keywords: ['성과', '수익', '수익률', 'return', 'performance', '얼마'],
  },
  {
    id: 'risk',
    label: '위험 분석',
    icon: '⚠️',
    description: 'MDD, 드로다운, 변동성',
    keywords: ['위험', '리스크', 'risk', 'mdd', '낙폭', '변동', 'drawdown', '손실'],
  },
  {
    id: 'allocation',
    label: '비중 분석',
    icon: '🥧',
    description: '자산 비중 분포',
    keywords: ['비중', 'allocation', '구성', '포트폴리오 구성', '자산', 'weight'],
  },
  {
    id: 'full',
    label: '전체 진단',
    icon: '🔍',
    description: '성과·위험·비중 통합 분석',
    keywords: ['전체', '전반', '모두', '다', '통합', '종합', '전체적', 'all', 'full'],
  },
];

function detectGoalFromText(text: string): GoalCategoryId | null {
  const lower = text.toLowerCase();
  for (const card of GOAL_CARDS) {
    if (card.keywords.some((kw) => lower.includes(kw))) return card.id;
  }
  return null;
}

export default function GoalInputScreen() {
  const { setGoal, addSkillLog, goToStep, columnMappings } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [suggested, setSuggested] = useState<GoalCategoryId | null>(null);
  const [ambiguous, setAmbiguous] = useState(false);
  const [selected, setSelected] = useState<GoalCategoryId | null>(null);

  const hasWeight = columnMappings.some((m) => m.category === 'weight');

  function handleInput(text: string) {
    setInputText(text);
    if (text.length > 3) {
      const detected = detectGoalFromText(text);
      setSuggested(detected);
      setAmbiguous(!detected);
    } else {
      setSuggested(null);
      setAmbiguous(false);
    }
  }

  function handleCardSelect(id: GoalCategoryId) {
    setSelected(id);
  }

  function handleConfirm() {
    const finalCategory = selected ?? suggested ?? 'full';
    const finalText = inputText || GOAL_CARDS.find((c) => c.id === finalCategory)?.label || '전체 진단';

    setGoal(finalText, finalCategory);

    addSkillLog({
      ruleId: 'RULE-GC-001',
      category: 'column_mapping', // closest available for goal clarification
      input: `text="${finalText}"`,
      output: `category=${finalCategory}`,
      reason: `목적 명확화 (RULE-GC-001). ${selected ? '사용자 카드 선택' : suggested ? '텍스트 자동 분류' : '기본값 전체 진단 적용'}.`,
      deterministic: false,
    });

    goToStep(4);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">Step 3/5</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">분석 목적</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">어떤 분석이 필요하신가요?</h1>
          <p className="text-sm text-gray-500 mt-1">
            자연어로 입력하거나 아래 카드에서 선택하세요.
          </p>
        </div>

        {/* Text input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">분석 목적 입력</label>
          <textarea
            value={inputText}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="예: 포트폴리오 성과와 위험을 분석해줘 / 수익률이 궁금해 / 비중이 어떻게 되는지 보고 싶어"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows={3}
          />
          {/* Auto-detected suggestion */}
          {suggested && !selected && (
            <div className="mt-2 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700">
              ✦ 자동 분류: <strong>{GOAL_CARDS.find((c) => c.id === suggested)?.label}</strong>으로 인식했습니다.
              아래 카드를 클릭해 변경할 수 있습니다.
            </div>
          )}
          {ambiguous && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
              ⚠ 입력이 모호합니다. 아래 카드에서 목적을 선택해주세요.
            </div>
          )}
        </div>

        {/* Quick select cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {GOAL_CARDS.map((card) => {
            const isDisabled = card.id === 'allocation' && !hasWeight;
            const isSelected = selected === card.id || (!selected && suggested === card.id);
            return (
              <button
                key={card.id}
                onClick={() => !isDisabled && handleCardSelect(card.id)}
                disabled={isDisabled}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : isDisabled
                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                }`}
              >
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-sm font-semibold text-gray-800">{card.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{card.description}</div>
                {isDisabled && (
                  <div className="text-xs text-gray-400 mt-1">weight 컬럼 필요</div>
                )}
                {isSelected && (
                  <div className="mt-2 text-xs text-indigo-600 font-medium">✓ 선택됨</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected summary */}
        {(selected || suggested) && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 text-sm text-green-700">
            분석 목적: <strong>{GOAL_CARDS.find((c) => c.id === (selected ?? suggested))?.label}</strong>
            {inputText && <span className="text-green-500"> ("{inputText.slice(0, 40)}{inputText.length > 40 ? '...' : ''}")</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={() => goToStep(2)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            ← 뒤로
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            분석 목적 확정 →
          </button>
        </div>
      </div>
    </div>
  );
}

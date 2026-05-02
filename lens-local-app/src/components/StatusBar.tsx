import { useAppStore } from '../store/appStore';

const STEPS = ['업로드', '컬럼 매핑', '분석 목적', '충분성 판정', '대시보드'];

export default function StatusBar() {
  const { step, filename, columnMappings, analysisGoal, goalCategory, reset } = useAppStore();

  const mappingStatus = columnMappings.length > 0
    ? `${columnMappings.filter((m) => m.category !== 'unknown').length}/${columnMappings.length} 매핑`
    : '–';

  const goalLabel = goalCategory
    ? { performance: '성과 분석', risk: '위험 분석', allocation: '비중 분석', full: '전체 진단' }[goalCategory]
    : analysisGoal || '–';

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4 text-sm">
      {/* Logo */}
      <span className="font-bold text-indigo-600 text-base tracking-wide">LENS</span>
      <span className="text-gray-300">|</span>

      {/* File info */}
      <span className="text-gray-600 truncate max-w-xs">
        {filename || '파일 없음'}
      </span>
      <span className="text-gray-300">|</span>

      {/* Mapping */}
      <span className="text-gray-500">매핑: <span className="text-gray-700">{mappingStatus}</span></span>
      <span className="text-gray-300">|</span>

      {/* Goal */}
      <span className="text-gray-500">목적: <span className="text-gray-700">{goalLabel}</span></span>
      <span className="text-gray-300">|</span>

      {/* Step indicator */}
      <div className="flex items-center gap-1 ml-auto">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isCurrent = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isDone
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
        <span className="ml-2 text-gray-500 text-xs">Step {step}/5</span>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
        title="처음부터 다시 시작"
      >
        초기화
      </button>
    </div>
  );
}

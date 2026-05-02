import { useRef, useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useAppStore } from '../store/appStore';
import { inferColumnMappings } from '../utils/columnMapping';

export default function UploadScreen() {
  const { setFileData, setColumnMappings, addSkillLog, goToStep } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ filename: string; rows: number; cols: number } | null>(null);

  function processData(filename: string, headers: string[], rows: string[][]) {
    setFileData(filename, rows, headers);

    const mappings = inferColumnMappings(headers);
    setColumnMappings(mappings);

    // Log column mapping inferences
    mappings.forEach((m) => {
      addSkillLog({
        ruleId: 'RULE-CM-001',
        category: 'column_mapping',
        input: `column="${m.column}"`,
        output: `category=${m.category}, confidence=${m.confidence}`,
        reason: `컬럼명 패턴 매칭 (RULE-CM-001). confidence=${m.confidence} → confirmed=${m.confirmed}`,
        deterministic: true,
      });
    });

    setPreview({ filename, rows: rows.length, cols: headers.length });
    goToStep(2);
  }

  function parseCSV(file: File) {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as string[][];
        if (data.length < 2) { setError('데이터가 너무 적습니다 (최소 2행 필요).'); return; }
        const headers = data[0].map((h) => String(h).trim());
        const rows = data.slice(1).map((row) => row.map((cell) => String(cell ?? '').trim()));
        processData(file.name, headers, rows);
      },
      error: () => setError('CSV 파싱 오류가 발생했습니다.'),
    });
  }

  function parseXLSX(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];
        if (raw.length < 2) { setError('데이터가 너무 적습니다 (최소 2행 필요).'); return; }
        const headers = (raw[0] as unknown[]).map((h) => String(h ?? '').trim());
        const rows = raw.slice(1).map((row) =>
          (row as unknown[]).map((cell) => String(cell ?? '').trim()),
        );
        processData(file.name, headers, rows);
      } catch {
        setError('XLSX 파싱 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleFile(file: File) {
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') parseCSV(file);
    else if (ext === 'xlsx' || ext === 'xls') parseXLSX(file);
    else setError('지원 형식: .csv, .xlsx, .xls');
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          <span className="text-indigo-600">LENS</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Skills.md 기반 투자 데이터 분석 · 로컬 MVP 데모
        </p>
      </div>

      {/* Upload area */}
      <div className="w-full max-w-xl">
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
          }`}
        >
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-700 font-medium">CSV 또는 XLSX 파일을 드래그하거나 클릭하여 업로드</p>
          <p className="text-gray-400 text-sm mt-2">지원 형식: .csv · .xlsx · .xls</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        {preview && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ {preview.filename} — {preview.rows}행 × {preview.cols}열 로드 완료
          </div>
        )}
      </div>

      {/* Sample data hint */}
      <div className="mt-8 w-full max-w-xl">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">샘플 데이터로 데모 실행하기</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-700">daily_returns_sample.csv</p>
              <p className="text-xs text-gray-500 mt-1">date, portfolio_return, benchmark_return</p>
              <p className="text-xs text-gray-400">63 거래일 · 성과+위험+벤치마크 분석</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-700">holdings_sample.csv</p>
              <p className="text-xs text-gray-500 mt-1">date, ticker, name, weight, daily_return</p>
              <p className="text-xs text-gray-400">5종목 × 20일 · 비중+성과 분석</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">파일 위치: <code className="bg-gray-100 px-1 rounded">lens-local-app/sample-data/</code></p>
        </div>
      </div>

      {/* Flow overview */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        {['업로드', '컬럼 매핑', '분석 목적', '충분성 판정', '대시보드 + AI 패널'].map((s, i, arr) => (
          <>
            <span key={s} className={i === 0 ? 'text-indigo-500 font-medium' : ''}>{s}</span>
            {i < arr.length - 1 && <span key={`→${i}`}>→</span>}
          </>
        ))}
      </div>
    </div>
  );
}

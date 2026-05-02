import { create } from 'zustand';
import type {
  AppStep,
  ColumnCategory,
  ColumnMapping,
  ComputedMetrics,
  GoalCategoryId,
  SkillLogCategory,
  SkillLogEntry,
  SufficiencyItem,
} from '../types';

let logIdCounter = 0;

interface AppState {
  step: AppStep;
  filename: string;
  rawData: string[][];
  headers: string[];
  rowCount: number;
  columnMappings: ColumnMapping[];
  analysisGoal: string;
  goalCategory: GoalCategoryId | null;
  sufficiencyItems: SufficiencyItem[];
  metrics: ComputedMetrics | null;
  skillLogs: SkillLogEntry[];

  goToStep: (step: AppStep) => void;
  setFileData: (filename: string, rawData: string[][], headers: string[]) => void;
  setColumnMappings: (mappings: ColumnMapping[]) => void;
  updateColumnMapping: (column: string, category: ColumnCategory) => void;
  confirmAllMappings: () => void;
  setGoal: (goal: string, category: GoalCategoryId) => void;
  setSufficiencyItems: (items: SufficiencyItem[]) => void;
  setMetrics: (metrics: ComputedMetrics) => void;
  addSkillLog: (entry: Omit<SkillLogEntry, 'id' | 'timestamp'> & { category: SkillLogCategory }) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  step: 1,
  filename: '',
  rawData: [],
  headers: [],
  rowCount: 0,
  columnMappings: [],
  analysisGoal: '',
  goalCategory: null,
  sufficiencyItems: [],
  metrics: null,
  skillLogs: [],

  goToStep: (step) => set({ step }),

  setFileData: (filename, rawData, headers) =>
    set({ filename, rawData, headers, rowCount: rawData.length }),

  setColumnMappings: (mappings) => set({ columnMappings: mappings }),

  updateColumnMapping: (column, category) =>
    set((state) => ({
      columnMappings: state.columnMappings.map((m) =>
        m.column === column ? { ...m, category, confirmed: true } : m,
      ),
    })),

  confirmAllMappings: () =>
    set((state) => ({
      columnMappings: state.columnMappings.map((m) => ({ ...m, confirmed: true })),
    })),

  setGoal: (goal, category) => set({ analysisGoal: goal, goalCategory: category }),

  setSufficiencyItems: (items) => set({ sufficiencyItems: items }),

  setMetrics: (metrics) => set({ metrics }),

  addSkillLog: (entry) =>
    set((state) => ({
      skillLogs: [
        ...state.skillLogs,
        {
          ...entry,
          id: `log-${++logIdCounter}`,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  reset: () =>
    set({
      step: 1,
      filename: '',
      rawData: [],
      headers: [],
      rowCount: 0,
      columnMappings: [],
      analysisGoal: '',
      goalCategory: null,
      sufficiencyItems: [],
      metrics: null,
      skillLogs: [],
    }),
}));

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { openai, MODEL, isConfigured } from '../lib/openai';
import { SYSTEM_PROMPT } from '../lib/prompts';

export const analyzeRouter = Router();

// ── Request schema ──────────────────────────────────────────────────────────

const AnalyzeBodySchema = z.object({
  goal: z.enum(['performance', 'risk', 'allocation', 'full']),
  datasetSummary: z.object({
    filename: z.string().max(255),
    tradingDays: z.number().int().min(0).max(10000),
    dataStartDate: z.string().max(30),
    dataEndDate: z.string().max(30),
    availableAnalyses: z.array(z.string().max(100)).max(20),
    impossibleAnalyses: z.array(z.string().max(200)).max(20),
  }),
  metricSummary: z.object({
    cumulativeReturn: z.number().optional(),
    mdd: z.number().optional(),
    annualizedVolatility: z.number().optional(),
    periodReturns: z
      .array(z.object({ period: z.string().max(20), return: z.number() }))
      .max(24)
      .optional(),
    allocationTop5: z
      .array(z.object({ name: z.string().max(100), weight: z.number() }))
      .max(10)
      .optional(),
    benchmarkComparison: z
      .object({
        portfolioReturn: z.number(),
        benchmarkReturn: z.number(),
        diff: z.number(),
      })
      .optional(),
  }),
  limitations: z.array(z.string().max(300)).max(20),
  skillsLog: z
    .array(
      z.object({
        ruleId: z.string().max(50),
        category: z.string().max(50),
        input: z.string().max(500),
        output: z.string().max(500),
      }),
    )
    .max(50),
});

type AnalyzeBody = z.infer<typeof AnalyzeBodySchema>;

// ── User message builder ─────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  performance: '성과 분석',
  risk: '위험 분석',
  allocation: '비중 분석',
  full: '전체 진단',
};

function fmt(n: number): string {
  return (n * 100).toFixed(2) + '%';
}

function buildUserMessage(body: AnalyzeBody): string {
  const lines: string[] = [
    `## 분석 요청`,
    `- 분석 목적: ${GOAL_LABELS[body.goal] ?? body.goal}`,
    '',
    `## 데이터셋 요약`,
    `- 파일명: ${body.datasetSummary.filename}`,
    `- 분석 기간: ${body.datasetSummary.dataStartDate} ~ ${body.datasetSummary.dataEndDate}`,
    `- 거래일 수: ${body.datasetSummary.tradingDays}일`,
    `- 가능한 분석 항목: ${body.datasetSummary.availableAnalyses.join(', ') || '없음'}`,
    '',
    `## 계산된 지표 (결정적 계산 결과, Skills.md 기반)`,
  ];

  const m = body.metricSummary;
  if (m.cumulativeReturn !== undefined)
    lines.push(`- 누적 수익률 (RULE-AN-001): ${fmt(m.cumulativeReturn)}`);
  if (m.mdd !== undefined)
    lines.push(`- 최대 낙폭 MDD (RULE-AN-002): ${fmt(m.mdd)}`);
  if (m.annualizedVolatility !== undefined)
    lines.push(`- 연환산 변동성 (RULE-AN-003): ${fmt(m.annualizedVolatility)}`);

  if (m.periodReturns && m.periodReturns.length > 0) {
    // Show overall + up to 6 most recent monthly periods
    const periods = m.periodReturns.slice(0, 1).concat(m.periodReturns.slice(-6));
    lines.push(
      `- 구간 수익률: ${periods.map((p) => `${p.period} ${fmt(p.return)}`).join(' | ')}`,
    );
  }

  if (m.allocationTop5 && m.allocationTop5.length > 0) {
    lines.push(
      `- 비중 상위 자산 (최신 시점): ${m.allocationTop5
        .map((a) => `${a.name} ${a.weight.toFixed(2)}`)
        .join(', ')}`,
    );
  }

  if (m.benchmarkComparison) {
    const bm = m.benchmarkComparison;
    lines.push(
      `- 벤치마크 비교: 포트폴리오 ${fmt(bm.portfolioReturn)}, 벤치마크 ${fmt(bm.benchmarkReturn)}, 초과/미달 ${fmt(bm.diff)}`,
    );
  }

  if (body.limitations.length > 0) {
    lines.push('', `## 데이터 부족으로 제외된 분석`);
    body.limitations.forEach((l) => lines.push(`- ${l}`));
  }

  lines.push(
    '',
    `## 요청 사항`,
    `위 계산 결과만을 근거로 분석 해석문을 작성하세요. ` +
      `제공된 수치와 RULE ID를 구체적으로 인용하고, ` +
      `업로드 데이터 외부의 시장 상황·원인·예측은 포함하지 마세요.`,
  );

  return lines.join('\n');
}

// ── Health check ─────────────────────────────────────────────────────────────

analyzeRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    model: MODEL,
    aiConfigured: isConfigured(),
  });
});

// ── POST /api/analyze ─────────────────────────────────────────────────────────

analyzeRouter.post('/analyze', async (req: Request, res: Response) => {
  // 1. AI not configured
  if (!isConfigured() || !openai) {
    res.status(503).json({
      error: 'AI analysis not configured',
      detail: 'OPENAI_API_KEY is not set in server environment. Use rule-based fallback.',
    });
    return;
  }

  // 2. Validate request body (Zod)
  const parsed = AnalyzeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid request body',
      detail: parsed.error.flatten(),
    });
    return;
  }

  const body = parsed.data;
  const userMessage = buildUserMessage(body);

  // 3. Call OpenAI Responses API
  try {
    // openai.responses is the Responses API (SDK v4.49+)
    const response = await (openai as any).responses.create({
      model: MODEL,
      instructions: SYSTEM_PROMPT,
      input: userMessage,
    });

    // output_text is a convenience accessor on the Responses API response
    const text: string =
      typeof response.output_text === 'string'
        ? response.output_text
        : response.output
            ?.flatMap((o: any) =>
              Array.isArray(o.content)
                ? o.content.filter((c: any) => c.type === 'output_text').map((c: any) => c.text)
                : [],
            )
            .join('') ?? '';

    const insights: string[] = text.split('\n');

    res.json({
      insights,
      model: MODEL,
      usage: response.usage
        ? {
            input_tokens: response.usage.input_tokens ?? response.usage.prompt_tokens,
            output_tokens: response.usage.output_tokens ?? response.usage.completion_tokens,
          }
        : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LENS API] OpenAI error:', message);
    res.status(502).json({
      error: 'OpenAI request failed',
      detail: message,
    });
  }
});

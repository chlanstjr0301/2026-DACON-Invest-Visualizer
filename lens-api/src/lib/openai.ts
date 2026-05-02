import OpenAI from 'openai';

/**
 * Lazily initialized OpenAI client.
 * API key is read from OPENAI_API_KEY environment variable only.
 * This module must never be imported in frontend code.
 */

export const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

function createClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim() === '' || key.startsWith('sk-...')) {
    return null;
  }
  return new OpenAI({ apiKey: key });
}

export const openai = createClient();

export function isConfigured(): boolean {
  return openai !== null;
}

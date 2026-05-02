import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { analyzeRouter } from './routes/analyze';
import { MODEL } from './lib/openai';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Nginx same-host)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

// ── Rate limiting: 30 req/min per IP on /api/* ────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait before retrying.' },
});
app.use('/api/', apiLimiter);

// ── Body parsing: max 512 KB ──────────────────────────────────────────────────
app.use(express.json({ limit: '512kb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', analyzeRouter);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[LENS API] Listening on http://localhost:${PORT}`);
  console.log(`[LENS API] Model: ${MODEL}`);
  console.log(`[LENS API] Allowed origins: ${allowedOrigins.join(', ')}`);
});

import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getConfigResult,
  getHealthResult,
  processChat,
  rateLimiter,
} from './httpApi';

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function sendResult(res: Response, result: { status: number; body: Record<string, unknown> }) {
  res.status(result.status).json(result.body);
}

app.post('/api/chat', async (req, res) => {
  sendResult(res, await processChat(req.body, getClientIp(req)));
});

app.get('/api/config', (_req, res) => {
  sendResult(res, getConfigResult());
});

app.get('/api/health', (_req, res) => {
  sendResult(res, getHealthResult());
});

if (!process.env.VERCEL) {
  const distPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) next();
      });
    });
  }

  setInterval(() => rateLimiter.prune(), 10 * 60 * 1000).unref();
}

export { app, rateLimiter };
export default app;

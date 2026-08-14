
**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure environment (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   # Add your DEEPSEEK_API_KEY to .env
   ```
3. Run locally:
   `npm run dev` — starts Vite (port 3000) + API server (port 3001)
4. Production:
   `npm run preview` — builds frontend and serves everything on port 3000

## API key security

Your DeepSeek API key stays **only on the server** in `.env`. The browser never sees it.

The `/api/chat` endpoint is protected with:

| Protection | Default limit |
|---|---|
| Per IP per minute | 6 requests |
| Per IP per day | 25 requests |
| Per session per hour | 12 requests |
| Global daily cap (all visitors) | 150 requests |
| Minimum interval between messages | 2 seconds |
| Max question length | 400 characters |
| Max answer length | 600 characters |
| Max response tokens | 300 |

Tune limits via env vars or edit `server/rateLimiter.ts`. Off-topic questions are blocked before any API call (no tokens spent). Answers are strictly limited to Deepak Koul's professional profile.

Without `DEEPSEEK_API_KEY`, the chat falls back to keyword-matched answers from resume data (no API calls).

Edit `data/resume.ts` to update your profile information.

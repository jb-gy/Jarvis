# Jarvis – Wallet-Native Personal Banking Copilot

Jarvis is a wallet-first personal banking experience that turns a connected MetaMask account into a living balance sheet. The project ships with a dark-mode React dashboard, an Express API, and a Gemini-powered copilot that surfaces allocation ideas, hedges, and playbooks tailored to the wallet in view. Everything runs locally, so you can experiment with AI-assisted portfolio coaching without handing over credentials.

---

## Overview
- **Audience** – Crypto-native investors and advisors who want a banking console that understands wallets instead of checking accounts.
- **Value** – Unified balances, interactive analytics, and an embedded AI analyst that stays useful even when Gemini is offline.
- **Stack** – React 19 + Vite frontend, Express + SQLite backend, Gemini 2.5 Flash for natural-language insights.

---

## Feature Tour
- **Wallet SSO** – MetaMask connection creates and restores profiles; no password reset hoops.
- **Portfolio Overview** – Snapshot cards for crypto, stablecoin, and fiat-equivalent holdings with growth deltas.
- **Analytics Studio** – Trendlines, allocation breakdowns, and comparison charts powered by Chart.js.
- **Transaction Ledger** – Clean history of deposits, swaps, and yield claims with placeholders for export tooling.
- **AI Copilot** – Gemini-backed chat with curated fallbacks; handles prompts, prefill summaries, and context blocks.
- **Health + Admin Hooks** – Health check endpoint and onboarding flows for quick status validation.

---

## Architecture at a Glance
```
jarvis/
├── backend/                      # Express API and services
│   ├── config/loadEnv.js         # Layered dotenv loader for backend/.env and project-wide .env
│   ├── database.js               # SQLite helpers + schema bootstrap
│   ├── routes/
│   │   ├── auth.js               # Wallet onboarding + profile lookups
│   │   ├── finance.js            # Portfolio, transactions, Gemini chat proxy
│   │   └── orders.js             # Strategy scheduling endpoints (placeholder)
│   └── services/
│       ├── financeService.js     # Portfolio mocks, AI orchestration, fallback logic
│       ├── geminiClient.js       # Gemini REST client (2.5 Flash default)
│       └── stockAnalyticsService.js
├── frontend/
│   ├── src/Dashboard.jsx         # Main signed-in experience
│   ├── src/components/           # Layout, analytics, Gemini panels, etc.
│   └── src/services/api.js       # REST client targeting the backend
└── README.md
```

### Backend Highlights
- Express API with modular routes (auth, finance, orders).
- SQLite storage via `database.js` with helpers for queries and seeding.
- `financeService` composes mocked portfolio data, Gemini calls, and graceful fallbacks when the API key is missing or requests fail.
- `geminiClient` wraps the Generative Language API with transport fallbacks (`fetch` when available, `https` otherwise).

### Frontend Highlights
- React 19 + Vite + Tailwind-inspired utility classes for fast iteration.
- Dashboard experience clusters portfolio metrics, charts, market intel, and the AI copilot.
- Componentized layout enables swapping data sources without reworking the entire shell.

---

## Environment Configuration
Jarvis reads environment variables through `backend/config/loadEnv.js`, which layers `backend/.env` over a project-wide `.env` when present. Create `backend/.env` with at least the Gemini API key if you want live AI responses.

```env
# Required for live Gemini insights
GEMINI_API_KEY=your_api_key_here

# Optional overrides (defaults shown)
PORT=3001
GEMINI_API_BASE=https://generativelanguage.googleapis.com
GEMINI_API_VERSION=v1beta
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.25
GEMINI_MAX_OUTPUT_TOKENS=768
GEMINI_TOP_P=0.9
GEMINI_SAFETY_THRESHOLD=BLOCK_MEDIUM_AND_ABOVE
```

> Tip: If you omit `GEMINI_API_KEY`, the finance service automatically falls back to curated suggestion bundles so the UI remains useful offline.

---

## Running Locally

### Backend API
```bash
cd backend
npm install
npm start          # launches on http://localhost:3001
```

The backend initializes the SQLite database (`jarvis.db`) on first run and logs key endpoints, including a health probe at `/api/health`.

### Frontend App
```bash
cd frontend
npm install
npm run dev        # serves the React app on http://localhost:5173
```

Visit `http://localhost:5173`, connect MetaMask, and follow the onboarding prompts. The frontend hits the backend REST API at `http://localhost:3001` by default (update `frontend/src/services/api.js` if deploying elsewhere).

---

## API Surface
| Method | Route                                   | Description |
|--------|-----------------------------------------|-------------|
| POST   | `/api/auth/check-user`                  | Detect existing wallet profiles |
| POST   | `/api/auth/onboard`                     | Create a new user linked to a wallet + portfolio tag |
| GET    | `/api/finance/overview/:wallet`         | Return mocked portfolio overview for the wallet |
| GET    | `/api/finance/transactions/:wallet`     | Return mocked transaction history |
| POST   | `/api/finance/ai-suggestions`           | Chat endpoint that proxies Gemini or offline playbooks |
| POST   | `/api/orders/...`                        | Schedule automation strategies (currently scaffolded) |

---

## AI Copilot Flow
1. Frontend posts prompts, historical messages, wallet context, and optional overview snapshots to `/api/finance/ai-suggestions`.
2. `financeService` assembles system instructions, generation config, and safety settings before calling `generateContent` in `geminiClient`.
3. `geminiClient` targets the configured model (default `gemini-2.5-flash`) and handles transport via native `fetch` or Node's `https`.
4. Responses are normalized into `{ message, note, meta, context }` payloads. If Gemini is unreachable or returns an empty candidate, curated fallback suggestions are injected instead of failing the chat experience.

---

## Development Tips
- **Database Resets** – Use the helper functions in `backend/database.js` or the provided seed scripts to reset sample data.
- **Static Analysis** – Add your preferred linter/prettier setup; the project intentionally stays lightweight.
- **Testing** – Endpoints are simple enough for supertest or MSW harnesses; consider adding regression coverage as you move beyond the MVP.
- **Environment Safety** – `loadEnv` only sets values when they are missing, so explicitly exporting variables in your shell will override `.env` entries.

---

## Roadmap Ideas
1. Persist real user portfolios in a managed Postgres or Supabase instance.
2. Replace mocked balances with on-chain lookups, custodial APIs, or accounting integrations.
3. Expand the copilot with scenario planning, alerts, and streaming responses.
4. Add advisor dashboards, permissions, and collaborative planning tools.
5. Harden the auth flow with session tokens, rate limits, and audit logging.

---

## License
This MVP is provided for experimentation and product exploration. Use at your own discretion.


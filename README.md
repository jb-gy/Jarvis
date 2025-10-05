# Jarvis – Wallet-Native Personal Banking Copilot

Jarvis is a dark-mode, wallet-only banking dashboard that turns a connected MetaMask account into a living balance sheet. The MVP blends a React/Vite frontend with an Express backend that can call Gemini for allocation ideas. Users sign in with their wallet, review crypto and fiat-equivalent balances, explore analytics, browse transaction history, and chat with an AI copilot – no emails or passwords required.

---

## ✨ Core Features
- **Wallet SSO** – MetaMask connection drives profile creation and session state.
- **Portfolio overview** – Unified summary cards, fiat reserve, growth metrics, and wallet fingerprint tiles.
- **Analytics studio** – Performance momentum, crypto vs. fiat comparison, and allocation doughnut charts powered by Chart.js.
- **Activity ledger** – Clean table for deposits, swaps, yield claims, and allocations with CSV export placeholder.
- **AI co-pilot** – Gemini-backed suggestions (with curated fallbacks) that answer allocation and hedging questions.

---

## 🧱 Architecture
```
jarvis/
├── backend/                  # Express API + SQLite boilerplate
│   ├── routes/finance.js     # Portfolio, transactions, AI suggestion endpoints
│   ├── services/financeService.js
│   └── routes/auth.js        # Wallet-based onboarding + profile checks
├── frontend/                 # React 19 + Vite application (dark theme)
│   ├── src/components/       # Layout, sidebar, analytics, AI panel, etc.
│   ├── src/Dashboard.jsx     # Main logged-in experience
│   └── src/services/api.js   # REST client targeting the backend
└── README.md
```

### Backend
- Node.js + Express
- SQLite (via the existing `database.js` helper)
- Finance service mocks portfolio/transaction data and integrates with Gemini when `GEMINI_API_KEY` is provided.

### Frontend
- React 19 with functional components and hooks
- Tailwind utility classes (via Vite plugin) for styling
- Chart.js + react-chartjs-2 for performance visualizations

---

## ⚙️ Environment Variables
Create `backend/.env` and set:

```env
GEMINI_API_KEY=your_api_key_here   # optional – fallback suggestions are used if omitted
```

The frontend currently targets `http://localhost:3001` for API calls; update `frontend/src/services/api.js` if you deploy elsewhere.

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
npm start        # runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # runs on http://localhost:5173
```

Open http://localhost:5173, connect MetaMask, and Jarvis will guide you through onboarding.

---

## 📡 Key API Routes
| Method | Route                                   | Description |
|--------|-----------------------------------------|-------------|
| POST   | `/api/auth/check-user`                  | Detect existing wallet profile |
| POST   | `/api/auth/onboard`                     | Create profile with role + portfolio tag |
| GET    | `/api/finance/overview/:wallet`         | Return mocked portfolio overview |
| GET    | `/api/finance/transactions/:wallet`     | Return mocked transaction history |
| POST   | `/api/finance/ai-suggestions`           | Proxy Gemini (or fallback ideas) for investment prompts |

---

## 🧭 Roadmap Ideas
- Persist real user portfolios in Supabase or another managed Postgres service.
- Replace mocked portfolio data with on-chain lookups or custodial account integrations.
- Expand AI tooling with user-specific prompts, scenario planning, and alerting.
- Add role-based dashboards for advisors vs. individual investors.

---

## 📄 License
This MVP is provided for experimentation and product exploration. Use at your own discretion.

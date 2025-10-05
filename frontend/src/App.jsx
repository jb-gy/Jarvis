import { useWallet } from './WalletContext';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import './App.css';

const App = () => {
  const {
    isConnected,
    account,
    userData,
    isOnboarding,
    connectWallet,
    completeOnboarding,
    isLoading
  } = useWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Syncing your wallet...</p>
        </div>
      </div>
    );
  }

  if (isConnected && isOnboarding) {
    return (
      <Onboarding
        walletAddress={account}
        onComplete={completeOnboarding}
      />
    );
  }

  if (isConnected && userData) {
    return <Layout />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-900/80 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-200 font-semibold"
              aria-hidden="true"
            >
              AI
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">Jarvis</p>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Personal crypto banking</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#ai" className="hover:text-white transition-colors">AI Copilot</a>
            <button
              onClick={connectWallet}
              className="ml-6 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition"
            >
              Connect wallet
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#4c1d95,_transparent),_radial-gradient(circle_at_bottom,_#0ea5e9,_transparent)]" />
          <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-3xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-200 font-semibold"
                aria-hidden="true"
              >
                AI
              </div>
              <span className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-wide text-white/80">Multi-chain ready</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                Your wallet. Your balance sheet. <span className="text-indigo-200">All in one command center.</span>
              </h1>
              <p className="mt-5 text-lg text-white/70">
                Jarvis syncs your MetaMask in seconds, wraps balances into human language, and gives you a Gemini-powered copilot for smarter investment moves.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={connectWallet}
                  className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
                >
                  Launch dashboard
                </button>
                <span className="text-sm text-white/60">No emails, no passwords — just your wallet signature.</span>
              </div>
            </div>
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_30px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/50">
                <span>Portfolio snapshot</span>
                <span>Gemini AI</span>
              </div>
              <div className="mt-6 space-y-6">
                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-sm text-white/50">Total balance</p>
                  <p className="mt-2 text-3xl font-semibold">$6,435.21</p>
                  <p className="mt-1 text-sm text-emerald-300">+12.2% vs last buy</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-sm text-white/50">Gemini suggests</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/70">
                    <li>• Hedge volatility with on-chain T-bills</li>
                    <li>• Add 0.35 ETH to liquid staking ladder</li>
                    <li>• Cap AI token basket at 12% allocation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid gap-10 md:grid-cols-3">
            {[{
              title: 'Unified balance intelligence',
              description: 'We merge wallet balances, stablecoins, and fiat ramps into one living balance sheet.',
              caption: 'ETH, stables, RWAs, perps'
            }, {
              title: 'AI that speaks crypto',
              description: 'Gemini 2.0 reads your holdings, surfaces allocation tweaks, and calls out risk drift.',
              caption: 'Scenario planning, hedges, cash runway'
            }, {
              title: 'Instant transaction history',
              description: 'A beautiful ledger for swaps, deposits, yield claims, and treasury automations.',
              caption: 'CSV export, smart filters, reconciliations'
            }].map((feature) => (
              <div key={feature.title} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-xs uppercase tracking-wide text-amber-200">{feature.caption}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="bg-slate-900 text-slate-100 py-20">
          <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs uppercase tracking-wide">Workflow</span>
              <h2 className="mt-6 text-3xl font-semibold">From wallet signature to insights in 90 seconds</h2>
              <ol className="mt-6 space-y-4 text-sm text-slate-300">
                <li><span className="font-semibold text-slate-100">1. Connect MetaMask:</span> No passwords — we use your wallet signature to personalize the dashboard.</li>
                <li><span className="font-semibold text-slate-100">2. Sync balances & history:</span> We map on-chain holdings, fiat equivalents, and latest yield flows.</li>
                <li><span className="font-semibold text-slate-100">3. Ask Jarvis anything:</span> Rebalancing ideas, risk controls, tax-friendly moves — all context-aware.</li>
              </ol>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-8 backdrop-blur">
              <p className="text-sm text-slate-400 uppercase tracking-[0.25em]">Modules</p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <p>• Overview cockpit with growth tracking vs. fiat</p>
                <p>• Transaction journal with CSV export</p>
                <p>• Jarvis co-pilot for allocation calls</p>
                <p>• Analytics charting balances, yields, and allocations</p>
              </div>
              <button
                onClick={connectWallet}
                className="mt-8 inline-flex items-center px-5 py-3 rounded-2xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition"
              >
                Preview the dashboard
              </button>
            </div>
          </div>
        </section>

        <section id="ai" className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-amber-200">Gemini + DeFi telemetry</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">An assistant that understands allocation math</h2>
              <p className="mt-3 text-sm text-white/70">
                Jarvis routes your wallet state into Gemini so you get hyper-specific recommendations: when to rotate into stables, how much to stake, and what to do with idle cash.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Understand risk drift in seconds</li>
                <li>• See growth vs. fiat every time you sign in</li>
                <li>• Receive actionable steps, not generic tips</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 text-sm text-white/70 space-y-4">
              <p className="text-white font-semibold">Gemini says:</p>
              <p>"Shift 12% into tokenized T-bills to protect your 3 month runway."</p>
              <p>"Restake 0.3 ETH via ether.fi to boost APY without breaking liquidity."</p>
              <p>"Cap AI index basket to 15% until ETH/stables ratio crosses 68/32."</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/80 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Jarvis. Built for founders who bank in crypto first.
      </footer>
    </div>
  );
};

export default App;

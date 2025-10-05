import React, { useMemo, useState } from 'react';
import Dashboard from '../Dashboard';
import { useWallet } from '../WalletContext';
import GeminiAnalystPanel from './AIAssistantPanel';
import MarketIntel from './MarketIntel';
import geminiLogo from '../assets/gemini-logo.svg';

const Layout = () => {
  const [activePage, setActivePage] = useState('overview');
  const { account, balance, disconnectWallet, userData } = useWallet();

  const navigationItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'income', label: 'Income Streams' },
      { id: 'fingerprint', label: 'Wallet Fingerprint' },
      { id: 'portfolio', label: 'Portfolio Split' },
      { id: 'funds', label: 'Funds' },
      { id: 'market', label: 'Market Intel' },
      { id: 'assistant', label: 'Gemini Analyst', icon: geminiLogo },
      { id: 'settings', label: 'Settings' }
    ],
    []
  );

  const renderPage = () => {
    if (['overview', 'transactions', 'income', 'fingerprint', 'portfolio', 'funds'].includes(activePage)) {
      return <Dashboard initialTab={activePage} />;
    }

    if (activePage === 'assistant') {
      return (
        <div className="px-[5vw] py-10 bg-slate-950 min-h-full">
          <div className="max-w-4xl">
            <GeminiAnalystPanel walletAddress={account} />
          </div>
        </div>
      );
    }

    if (activePage === 'market') {
      return <MarketIntel />;
    }

    if (activePage === 'settings') {
      return (
        <div className="px-[5vw] py-10 text-left text-slate-400 bg-slate-950 min-h-full">
          Settings and notifications are on the roadmap. Let us know what controls you need first.
        </div>
      );
    }

    return <Dashboard initialTab="overview" />;
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="px-[5vw] pt-[3vw] pb-6 border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-200 font-semibold"
                  aria-hidden="true"
                >
                  AI
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-indigo-200">Jarvis</p>
                  <p className="text-sm text-slate-400">Personal crypto banking</p>
                </div>
              </div>
              <h2 className="text-[42px] font-semibold text-slate-100">
                {activePage === 'overview' && 'Portfolio overview'}
                {activePage === 'transactions' && 'Transaction history'}
                {activePage === 'income' && 'Income streams'}
                {activePage === 'fingerprint' && 'Wallet fingerprint'}
                {activePage === 'portfolio' && 'Portfolio split'}
                {activePage === 'funds' && 'Funds'}
                {activePage === 'market' && 'Market intelligence'}
                {activePage === 'assistant' && 'Gemini Analyst'}
                {activePage === 'settings' && 'Settings'}
              </h2>
              <p className="text-slate-400 mt-1">
                {activePage === 'overview' && `Welcome back, ${userData?.name || 'Explorer'}. Your personal crypto banking cockpit is ready.`}
                {activePage === 'transactions' && 'A clean ledger of swaps, deposits, and yield claims.'}
                {activePage === 'income' && 'Track projected yield across staking ladders and vaults.'}
                {activePage === 'fingerprint' && 'Key wallet telemetry at a glance.'}
                {activePage === 'portfolio' && 'See how capital is allocated across strategies.'}
                {activePage === 'funds' && 'Spin up thematic funds and monitor their objectives.'}
                {activePage === 'market' && 'Pull Yahoo Finance stats, compare volatility, and spot co-movements live.'}
                {activePage === 'assistant' && 'Chat with Gemini for allocations, hedges, or market reads tailored to you.'}
                {activePage === 'settings' && 'Coming soon: custom alerts, risk budgets, and preferences.'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-sm font-medium text-slate-200">{balance || '0.0000'} ETH</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-400 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activePage === item.id
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <img src={item.icon} alt="Gemini" className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-slate-950">{renderPage()}</main>
    </div>
  );
};

export default Layout;

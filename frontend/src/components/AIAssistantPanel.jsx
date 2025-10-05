import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiService from '../services/api';
import geminiLogo from '../assets/gemini-logo.svg';

const SUGGESTED_PROMPTS = [
  'What allocation tweaks should I make this week?',
  'How can I hedge downside risk over the next quarter?',
  'Summarise my runway and highlight any red flags.',
  'Give me three yield ideas that fit this wallet.'
];

const STATUS_COPY = {
  idle: { label: 'Idle', tone: 'bg-slate-700 text-slate-200' },
  connecting: { label: 'Connecting', tone: 'bg-amber-500/20 text-amber-200 border border-amber-400/40' },
  live: { label: 'Live • Gemini', tone: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' },
  fallback: { label: 'Offline • Fallback', tone: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40' },
  error: { label: 'Error', tone: 'bg-rose-500/20 text-rose-200 border border-rose-500/40' }
};

const createMessage = (role, content, extras = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  ...extras
});

const GeminiAnalystPanel = ({ walletAddress }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(walletAddress ? 'connecting' : 'idle');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [meta, setMeta] = useState(null);
  const [prefillAttempted, setPrefillAttempted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!walletAddress) {
      setMessages([]);
      setInput('');
      setError('');
      setNote('Connect your wallet to unlock Gemini Analyst.');
      setMeta(null);
      setStatus('idle');
      setPrefillAttempted(false);
      return;
    }

    setMessages([]);
    setInput('');
    setError('');
    setNote('');
    setMeta(null);
    setStatus('connecting');
    setPrefillAttempted(false);

    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await apiService.sendAnalystMessage({
          walletAddress,
          history: [],
          prefill: true
        });

        if (response.message) {
          setMessages([createMessage('assistant', response.message, { source: response.source })]);
        }

        setNote(response.note || '');
        setMeta(response.meta || null);

        if (response.source === 'gemini') {
          setStatus('live');
        } else if (response.source === 'fallback') {
          setStatus('fallback');
        } else {
          setStatus('idle');
        }
      } catch (err) {
        console.error('Gemini Analyst bootstrap failed:', err);
        setError(err.message || 'Unable to reach Gemini Analyst right now.');
        setStatus('error');
      } finally {
        setLoading(false);
        setPrefillAttempted(true);
      }
    };

    bootstrap();
  }, [walletAddress]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!walletAddress) {
      setError('Connect a wallet before chatting with Gemini Analyst.');
      return;
    }

    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const historyPayload = messages.map(({ role, content }) => ({ role, content }));
    const userMessage = createMessage('user', trimmed);

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await apiService.sendAnalystMessage({
        walletAddress,
        prompt: trimmed,
        history: historyPayload
      });

      if (response.message) {
        const assistantMessage = createMessage('assistant', response.message, { source: response.source });
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setNote(response.note || '');
      setMeta(response.meta || null);

      if (response.source === 'gemini') {
        setStatus('live');
      } else if (response.source === 'fallback') {
        setStatus('fallback');
      }
    } catch (err) {
      console.error('Gemini Analyst chat failed:', err);
      setError(err.message || 'Unable to fetch Gemini response.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const formRef = useRef(null);

  const statusBadge = useMemo(() => {
    const descriptor = STATUS_COPY[status] || STATUS_COPY.idle;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${descriptor.tone}`}>
        {descriptor.label}
      </span>
    );
  }, [status]);

  const renderMessage = (message) => {
    const isUser = message.role === 'user';

    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-900/80 text-slate-200 border border-slate-700'
          }`}
        >
          {message.content}
        </div>
      </div>
    );
  };

  const metaInsights = useMemo(() => {
    if (!meta) return [];

    const items = [];
    if (meta.model) {
      items.push({ label: 'Model', value: meta.model.replace('models/', '') });
    }
    if (typeof meta.latencyMs === 'number') {
      items.push({ label: 'Latency', value: `${(meta.latencyMs / 1000).toFixed(2)}s` });
    }

    const usage = meta.usage || {};
    if (usage.totalTokenCount) {
      items.push({ label: 'Total Tokens', value: usage.totalTokenCount });
    }
    if (usage.promptTokenCount) {
      items.push({ label: 'Prompt Tokens', value: usage.promptTokenCount });
    }
    if (usage.candidatesTokenCount) {
      items.push({ label: 'Output Tokens', value: usage.candidatesTokenCount });
    }

    return items;
  }, [meta]);

  return (
    <section className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl text-left flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <img src={geminiLogo} alt="Gemini" className="h-10 w-10" />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-200">Gemini Analyst</p>
            <h2 className="text-2xl font-semibold text-white mt-1">Your allocation copilot</h2>
            <p className="text-sm text-slate-400 mt-1">
              Blend live Gemini reasoning with wallet telemetry to surface hedges, optimize runway, and design yield plays in real time.
            </p>
          </div>
        </div>
        {statusBadge}
      </header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-[18rem] max-h-[28rem] overflow-y-auto bg-slate-950/60 border border-slate-900 rounded-3xl p-4 space-y-4"
      >
        {messages.map(renderMessage)}

        {!messages.length && prefillAttempted && !loading && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300">
            {status === 'fallback'
              ? 'Gemini is offline, but the copilot still has curated strategies ready. Ask away.'
              : "Spark the conversation with a question about allocations, hedges, or yield."}
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 animate-pulse">
              Analyst is thinking…
            </div>
          </div>
        )}
      </div>

      {note && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3">
          {note}
        </div>
      )}

      {error && (
        <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="text-xs px-3 py-2 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSend} className="space-y-2">
        <label htmlFor="gemini-analyst-input" className="text-xs uppercase tracking-widest text-slate-400">
          Ask the copilot anything
        </label>
        <div className="flex items-end gap-3">
          <textarea
            id="gemini-analyst-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const form = formRef.current;
                if (form) {
                  if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                  } else {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }
              }
            }}
            placeholder={walletAddress ? 'e.g. Design a delta-neutral plan for the next 30 days.' : 'Connect a wallet to start chatting.'}
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            rows={3}
            disabled={!walletAddress || loading}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!walletAddress || loading || !input.trim()}
          >
            {loading ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </form>

      {metaInsights.length > 0 && (
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          {metaInsights.map((item) => (
            <div key={item.label} className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80">
              <span className="uppercase tracking-widest text-slate-500 block">{item.label}</span>
              <span className="text-slate-200 text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GeminiAnalystPanel;

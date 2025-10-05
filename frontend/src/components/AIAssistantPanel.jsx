import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiService from '../services/api';
import geminiLogo from '../assets/gemini-logo.svg';

const placeholderMessage = `I'm Gemini Analyst, your portfolio copilot. Ask me about allocation tweaks, hedges, or yield ideas.`;

const GeminiAnalystPanel = ({ walletAddress }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);
  const scrollRef = useRef(null);

  const canChat = useMemo(() => Boolean(walletAddress), [walletAddress]);

  useEffect(() => {
    setMessages([]);
    setNote(null);
    setError(null);

    if (!walletAddress) {
      return;
    }

    const bootstrapConversation = async () => {
      setLoading(true);
      try {
        const response = await apiService.getInvestmentIdeas({
          walletAddress,
          history: [],
          question: 'Give me a concise snapshot of my portfolio and current opportunities.'
        });
        setMessages([{ role: 'assistant', content: response.message, source: response.source }]);
        setNote(response.note || null);
      } catch (err) {
        console.error('AI bootstrap failed:', err);
        setError(err.message || 'Unable to reach Gemini Analyst right now.');
      } finally {
        setLoading(false);
      }
    };

    bootstrapConversation();
  }, [walletAddress]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendQuestion = async (event) => {
    event.preventDefault();
    if (!question.trim() || !walletAddress) {
      return;
    }

    const userMessage = { role: 'user', content: question.trim() };
    const history = [...messages, userMessage];

    setMessages(history);
    setQuestion('');
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getInvestmentIdeas({
        walletAddress,
        history,
        question: question.trim()
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response.message, source: response.source }]);
      setNote(response.note || null);
    } catch (err) {
      console.error('AI chat failed:', err);
      setError(err.message || 'Unable to fetch Gemini response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl p-6 text-left shadow-xl border border-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={geminiLogo} alt="Gemini" className="h-8 w-8" />
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Gemini Analyst</p>
            <h2 className="text-2xl font-semibold text-white mt-1">Conversational insights</h2>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80">
          {note ? 'Offline mode' : 'Live'}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-300">
        Ask about allocation tweaks, hedges, or runway planning. Gemini Analyst blends your wallet snapshot with Google Gemini for conversational guidance.
      </p>

      <div ref={scrollRef} className="mt-6 h-72 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && !loading && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-300">
            {placeholderMessage}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-200 border border-white/10'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {note && (
        <div className="mt-4 text-xs text-amber-300 bg-white/5 border border-amber-300/30 rounded-xl px-3 py-2">
          {note}
        </div>
      )}

      {error && (
        <div className="mt-4 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={sendQuestion} className="mt-6">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2" htmlFor="ai-question">
          What should we explore?
        </label>
        <div className="flex items-start space-x-3">
          <textarea
            id="ai-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={canChat ? 'e.g. How can I hedge volatility over the next quarter?' : 'Connect your wallet to start chatting.'}
            className="flex-1 bg-white/10 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            rows={2}
            disabled={!canChat || loading}
          />
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition-colors disabled:opacity-60"
            disabled={!canChat || !question.trim() || loading}
          >
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default GeminiAnalystPanel;

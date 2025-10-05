require('dotenv').config();
require('../config/loadEnv');
const { DEFAULT_MODEL, generateContent } = require('./geminiClient');

const DEFAULT_PORTFOLIO = {
  overview: {
    ownerName: 'Alex Rivers',
    riskProfile: 'moderate',
    balances: {
      crypto: {
        symbol: 'ETH',
        amount: 1.82,
        usdValue: 6435.21
      },
      stablecoinsUsd: 2150.0,
      fiatEquivalentUsd: 6210.31
    },
    growth: {
      lastPurchaseDate: '2024-11-15',
      lastPurchaseUsdValue: 5720.0,
      lastPurchaseCryptoPriceUsd: 2265.0
    },
    runwayReserveUsd: 950.0,
    performanceTrend: {
      labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      usdBalances: [4280, 4725, 5180, 5660, 6025, 6435],
      cryptoHoldings: [1.21, 1.34, 1.46, 1.59, 1.68, 1.82]
    },
    savingsAllocation: [
      { label: 'Core ETH Holdings', percentage: 42, usdValue: 2702 },
      { label: 'Staked ETH (Lido)', percentage: 23, usdValue: 1480 },
      { label: 'Stablecoin Yield', percentage: 18, usdValue: 1130 },
      { label: 'RWA Treasuries', percentage: 9, usdValue: 578 },
      { label: 'AI & Gaming Tokens', percentage: 8, usdValue: 515 }
    ],
    incomeStreams: [
      { label: 'Liquid Staking Rewards', apr: 4.1, usdPerMonth: 22.5 },
      { label: 'Stablecoin Vault', apr: 7.6, usdPerMonth: 13.7 },
      { label: 'AI Index Fund', apr: 11.3, usdPerMonth: 9.8 }
    ],
    comparison: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
      cryptoUsdValue: [4725, 5180, 5660, 6025, 6435],
      fiatUsdValue: [4510, 4825, 5290, 5740, 6125]
    }
  },
  transactions: [
    {
      id: 'txn-001',
      date: '2024-08-12T09:34:00Z',
      type: 'Deposit',
      asset: 'ETH',
      amountCrypto: 0.85,
      amountUsd: 2950,
      status: 'completed',
      counterparty: 'MetaMask Swap'
    },
    {
      id: 'txn-002',
      date: '2024-08-09T16:12:00Z',
      type: 'Yield Claim',
      asset: 'stETH',
      amountCrypto: 0.03,
      amountUsd: 105,
      status: 'completed',
      counterparty: 'Lido'
    },
    {
      id: 'txn-003',
      date: '2024-08-04T12:21:00Z',
      type: 'Swap',
      asset: 'USDC -> ETH',
      amountCrypto: 0.42,
      amountUsd: 1460,
      status: 'completed',
      counterparty: 'Uniswap v3'
    },
    {
      id: 'txn-004',
      date: '2024-07-28T19:50:00Z',
      type: 'Allocation',
      asset: 'USDC',
      amountCrypto: 850,
      amountUsd: 850,
      status: 'pending',
      counterparty: 'Maple Finance Pool'
    },
    {
      id: 'txn-005',
      date: '2024-07-18T08:05:00Z',
      type: 'Deposit',
      asset: 'USDC',
      amountCrypto: 1200,
      amountUsd: 1200,
      status: 'completed',
      counterparty: 'Stripe On-Ramp'
    }
  ]
};

const FALLBACK_SUGGESTIONS = [
  {
    title: 'Deploy 20% into liquid staking ladders',
    thesis: 'Rotate a slice of idle ETH into stETH and ether.fi vaults to compound staking rewards while retaining liquidity.',
    allocationSuggestion: 'Target 0.35 ETH split across Lido and ether.fi auto-compounding vaults.',
    riskLevel: 'Moderate',
    nextSteps: ['Split ETH across two ladders to smooth validator reward variance.', 'Enable restaking on EigenLayer for boosted yield with guardrails.', 'Track smart contract risk using DeFiLlama alerts.']
  },
  {
    title: 'Ring-fence cash runway in on-chain T-bill notes',
    thesis: 'Protect 3-month expenses with tokenized US treasuries currently yielding 4.9-5.2% APR.',
    allocationSuggestion: 'Keep $1,200 in USDY or Ondo Short-Term Notes to hedge ETH drawdowns.',
    riskLevel: 'Conservative',
    nextSteps: ['Automate replenishment via weekly DCA from swap profits.', 'Build escape criteria (ETH < $2,400 triggers rebalancing).', 'Sync holdings to tax dashboard for quarterly reporting.']
  },
  {
    title: 'Add upside with AI-focused index basket',
    thesis: 'Capture AI infrastructure growth with a diversified basket that rebalances monthly.',
    allocationSuggestion: 'Allocate $750 across GRT, RNDR, and FET index vault with capped drawdown.',
    riskLevel: 'Adventurous',
    nextSteps: ['Limit exposure to 12% of total portfolio.', 'Review NAV deviation weekly.', 'Set take-profit automation at 28% gain.']
  }
];

const buildOverview = (walletAddress) => {
  const { overview } = DEFAULT_PORTFOLIO;
  const currentUsd = overview.balances.crypto.usdValue + overview.balances.stablecoinsUsd;
  const deltaUsd = currentUsd - overview.growth.lastPurchaseUsdValue;
  const pctChange = overview.growth.lastPurchaseUsdValue > 0
    ? (deltaUsd / overview.growth.lastPurchaseUsdValue) * 100
    : 0;

  return {
    walletAddress,
    ownerName: overview.ownerName,
    riskProfile: overview.riskProfile,
    balances: {
      crypto: overview.balances.crypto,
      stablecoinsUsd: overview.balances.stablecoinsUsd,
      fiatEquivalentUsd: overview.balances.fiatEquivalentUsd,
      totalUsd: Number((currentUsd).toFixed(2))
    },
    growth: {
      deltaUsd: Number(deltaUsd.toFixed(2)),
      percentChange: Number(pctChange.toFixed(2)),
      lastPurchaseDate: overview.growth.lastPurchaseDate,
      lastPurchaseUsdValue: overview.growth.lastPurchaseUsdValue,
      lastPurchaseCryptoPriceUsd: overview.growth.lastPurchaseCryptoPriceUsd
    },
    runwayReserveUsd: overview.runwayReserveUsd,
    performanceTrend: overview.performanceTrend,
    savingsAllocation: overview.savingsAllocation,
    incomeStreams: overview.incomeStreams,
    comparison: overview.comparison,
    lastUpdated: new Date().toISOString()
  };
};

const getOverview = async (walletAddress) => buildOverview(walletAddress);

const getTransactions = async (walletAddress) => {
  return DEFAULT_PORTFOLIO.transactions.map((txn, index) => ({
    ...txn,
    id: `${walletAddress || 'wallet'}-${index + 1}`,
    walletAddress
  }));
};

const formatFallbackMessage = () =>
  FALLBACK_SUGGESTIONS.map((idea, index) => {
    const steps = idea.nextSteps.length
      ? `\nNext steps:\n- ${idea.nextSteps.join('\n- ')}`
      : '';
    return `${index + 1}. ${idea.title}\n${idea.thesis}\nAllocation: ${idea.allocationSuggestion}\nRisk: ${idea.riskLevel}${steps}`;
  }).join('\n\n');


const GEMINI_GENERATION_CONFIG = {
  temperature: Number(process.env.GEMINI_TEMPERATURE ?? 0.25),
  maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? 768),
  topP: Number(process.env.GEMINI_TOP_P ?? 0.9)
};

const GEMINI_SAFETY_SETTINGS = [
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUAL_CONTENT'
].map((category) => ({
  category,
  threshold: process.env.GEMINI_SAFETY_THRESHOLD || 'BLOCK_MEDIUM_AND_ABOVE'
}));

const DEFAULT_PREFILL_PROMPT = 'Introduce yourself as Jarvis, the user\'s crypto banking copilot. Give a two-sentence summary of the wallet posture and how you can help.';

const extractCandidateText = (candidate) => {
  if (!candidate?.content?.parts?.length) {
    return '';
  }

  return candidate.content.parts
    .map((part) => (typeof part.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
};

const buildSystemInstruction = (overview, walletAddress) => ({
  role: 'system',
  parts: [
    {
      text: `You are Jarvis, an expert digital private banker supporting wallet ${walletAddress}. Keep answers precise, reference numbers sparingly, and surface concrete actions.`
    },
    {
      text: `Portfolio snapshot (JSON): ${JSON.stringify(overview)}`
    },
    {
      text: 'Always close with a short call-to-action when recommending moves.'
    }
  ]
});

const mapHistoryToGemini = (history = []) =>
  history
    .filter((message) => ['assistant', 'user'].includes(message.role) && message.content)
    .slice(-12)
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    }));

const buildPrefillFallback = (overview) => {
  const { balances, growth } = overview;
  const totalUsd = balances?.totalUsd ?? balances?.crypto?.usdValue + balances?.stablecoinsUsd;

  return [
    "Gemini Analyst is running in offline mode, so here is a quick snapshot based on cached telemetry:",
    `• Total assets stand at ~$${Number(totalUsd || 0).toLocaleString()} with ${balances?.crypto?.amount?.toFixed?.(2) ?? '—'} ${
      balances?.crypto?.symbol || 'ETH'
    } on book.`,
    `• Last recorded delta since your previous buy was ${growth?.percentChange ?? 0}% (${growth?.deltaUsd ? `$${growth.deltaUsd.toLocaleString()}` : 'N/A'}).`,
    'Ask any question and the copilot will respond with playbooks even without live Gemini access.'
  ].join('\n');
};

const formatFallbackResponse = (overview) => ({
  source: 'fallback',
  message: formatFallbackMessage(),
  note: 'Gemini is currently unavailable. Showing curated fallback ideas instead.',
  meta: {
    model: null,
    usage: null,
    latencyMs: null,
    safetyRatings: []
  },
  context: {
    overview
  }
});

const buildFailureNote = (error) => {
  if (!error) {
    return 'Gemini service is unreachable. Using offline playbooks for now.';
  }

  const status = error.status || error?.response?.status;
  if (status === 401 || status === 403) {
    return 'Gemini rejected the request. Verify your API key, project access, and billing status.';
  }

  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return 'Unable to reach Gemini. Check your network connectivity and firewall settings.';
  }

  const detail = error?.response?.error?.message || error?.message;
  if (detail && detail.toLowerCase() === 'fetch failed') {
    return 'Unable to reach Gemini. Check your internet connection or proxy settings.';
  }
  if (detail) {
    return `Gemini error: ${detail}. Fallback strategies are active while we recover.`;
  }

  return 'Gemini is unavailable right now. Fallback strategies are active while we recover.';
};

const chatWithAssistant = async ({ walletAddress, question, prompt, history = [], overview, prefill = false }) => {
  const portfolio = overview || (await getOverview(walletAddress));

  if (!process.env.GEMINI_API_KEY) {
    return prefill
      ? {
          source: 'fallback',
          message: buildPrefillFallback(portfolio),
          note: 'Set GEMINI_API_KEY to enable live Gemini insights.',
          meta: {
            model: null,
            usage: null,
            latencyMs: null,
            safetyRatings: []
          },
          context: {
            overview: portfolio
          }
        }
      : formatFallbackResponse(portfolio);
  }

  const userPrompt = (prompt ?? question ?? (prefill ? DEFAULT_PREFILL_PROMPT : '')).trim();

  if (!userPrompt) {
    return {
      source: 'noop',
      message: '',
      meta: {
        model: DEFAULT_MODEL,
        usage: null,
        latencyMs: 0,
        safetyRatings: []
      }
    };
  }

  const contents = [...mapHistoryToGemini(history), { role: 'user', parts: [{ text: userPrompt }] }];

  const startedAt = Date.now();

  try {
    const data = await generateContent({
      contents,
      systemInstruction: buildSystemInstruction(portfolio, walletAddress),
      generationConfig: GEMINI_GENERATION_CONFIG,
      safetySettings: GEMINI_SAFETY_SETTINGS
    });

    const latencyMs = Date.now() - startedAt;
    const candidate = data?.candidates?.[0];
    const rawText = extractCandidateText(candidate);

    if (!rawText) {
      return {
        source: 'fallback',
        message: formatFallbackMessage(),
        note: buildFailureNote({ message: 'Gemini returned an empty response.' }),
        meta: {
          model: data?.model || DEFAULT_MODEL,
          usage: data?.usageMetadata || null,
          latencyMs,
          safetyRatings: candidate?.safetyRatings || []
        },
        context: {
          overview: portfolio
        }
      };
    }

    const blocked = candidate?.finishReason === 'SAFETY' || candidate?.safetyRatings?.some((rating) => rating.blocked);

    return {
      source: 'gemini',
      message: rawText,
      note: blocked ? 'Response may be truncated due to Gemini safety filters.' : null,
      meta: {
        model: data?.model || DEFAULT_MODEL,
        usage: data?.usageMetadata || null,
        latencyMs,
        safetyRatings: candidate?.safetyRatings || []
      },
      context: {
        overview: portfolio
      }
    };
  } catch (error) {
    console.error('Gemini request failed:', error?.response || error);
    return {
      source: 'fallback',
      message: formatFallbackMessage(),
      note: buildFailureNote(error),
      meta: {
        model: DEFAULT_MODEL,
        usage: null,
        latencyMs: null,
        safetyRatings: []
      },
      context: {
        overview: portfolio
      }
    };
  }
};

module.exports = {
  getOverview,
  getTransactions,
  chatWithAssistant
};

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

const mapHistoryToGemini = (history = []) =>
  history.slice(-10).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));

const buildSystemPrompt = (overview) => `You are Jarvis, an expert crypto banking copilot. Keep answers concise, pragmatic, and tailored to the user's portfolio.

Portfolio snapshot (JSON): ${JSON.stringify(overview)}

Return plain text with actionable insight.`;

const chatWithAssistant = async ({ walletAddress, question, history = [], overview }) => {
  const portfolio = overview || (await getOverview(walletAddress));

  if (!process.env.GEMINI_API_KEY) {
    return {
      source: 'fallback',
      message: formatFallbackMessage(),
      note: 'Set GEMINI_API_KEY to enable live Gemini insights.'
    };
  }

  const contents = [
    { role: 'user', parts: [{ text: buildSystemPrompt(portfolio) }] },
    ...mapHistoryToGemini(history)
  ];

  if (question && question.trim()) {
    contents.push({ role: 'user', parts: [{ text: question.trim() }] });
  }

  const fetchFromRuntime = (...args) => {
    if (typeof fetch !== 'function') {
      throw new Error('Fetch API is not available in this runtime.');
    }
    return fetch(...args);
  };

  try {
    const response = await fetchFromRuntime(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 512
          }
        })
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim();

    if (!rawText) {
      return {
        source: 'fallback',
        message: formatFallbackMessage(),
        note: 'Gemini returned an empty response. Showing fallback ideas.'
      };
    }

    return {
      source: 'gemini',
      message: rawText
    };
  } catch (error) {
    console.error('Gemini request failed:', error);
    return {
      source: 'fallback',
      message: formatFallbackMessage(),
      note: 'Gemini request failed. Showing fallback ideas.'
    };
  }
};

module.exports = {
  getOverview,
  getTransactions,
  chatWithAssistant
};

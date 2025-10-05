const express = require('express');
const router = express.Router();
const financeService = require('../services/financeService');
const stockAnalyticsService = require('../services/stockAnalyticsService');

// Portfolio overview for a wallet
router.get('/overview/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const overview = await financeService.getOverview(walletAddress);

    res.json({
      success: true,
      overview
    });
  } catch (error) {
    console.error('Failed to fetch portfolio overview:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load portfolio overview right now.'
    });
  }
});

// Transaction history for a wallet
router.get('/transactions/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const transactions = await financeService.getTransactions(walletAddress);

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load transactions right now.'
    });
  }
});

// AI-powered investment suggestions via Gemini
router.post('/ai-suggestions', async (req, res) => {
  try {
    const {
      walletAddress,
      prompt,
      question,
      history = [],
      prefill = false,
      overview,
      context
    } = req.body || {};

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'walletAddress is required.'
      });
    }

    const contextBlocks = Array.isArray(context)
      ? context.filter((entry) => typeof entry === 'string' && entry.trim())
      : typeof context === 'string' && context.trim()
        ? [context.trim()]
        : [];

    const payload = await financeService.chatWithAssistant({
      walletAddress,
      prompt,
      question,
      history,
      prefill: Boolean(prefill),
      overview,
      contextBlocks
    });

    res.json({
      success: true,
      ...payload
    });
  } catch (error) {
    console.error('Failed to fetch AI suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch investment suggestions right now.'
    });
  }
});

// Stock analytics (Yahoo Finance powered)
router.post('/stocks/metrics', async (req, res) => {
  try {
    const { symbols, range, interval } = req.body || {};
    const insights = await stockAnalyticsService.getStockInsights({ symbols, range, interval });

    res.json({
      success: true,
      ...insights
    });
  } catch (error) {
    console.error('Failed to analyse stocks:', error);
    const statusCode = error.details ? 207 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to analyse the requested tickers right now.',
      errors: error.details || []
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const financeService = require('../services/financeService');

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
    const { walletAddress, question, history = [] } = req.body;
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'walletAddress is required.'
      });
    }

    const overview = await financeService.getOverview(walletAddress);
    const { source, message, note } = await financeService.chatWithAssistant({
      walletAddress,
      question,
      history,
      overview
    });

    res.json({
      success: true,
      source,
      overview,
      message,
      note
    });
  } catch (error) {
    console.error('Failed to fetch AI suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch investment suggestions right now.'
    });
  }
});

module.exports = router;

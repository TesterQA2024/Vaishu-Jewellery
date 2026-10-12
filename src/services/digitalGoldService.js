/**
 * VAISHU JEWELLERY - Digital Gold (24K 999 Pure) Service
 * Manages 24K Pure Digital Vault, Buy, Sell, and Physical/Voucher Redemption
 * with strict validations and transaction auditing.
 */

import { getStoredLiveRates } from './productService';

const VAULT_STORAGE_KEY = 'vaishu_digital_gold_vaults_v1';

function getAllVaults() {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllVaults(vaults) {
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vaults));
}

/**
 * Get User's Digital Gold Vault Balance & Ledger
 */
export function getDigitalGoldVault(userId) {
  if (!userId) {
    return {
      userId: 'guest',
      grams: 0.0000,
      totalInvested: 0,
      transactions: []
    };
  }

  const vaults = getAllVaults();
  if (!vaults[userId]) {
    vaults[userId] = {
      userId,
      grams: 0.0000,
      totalInvested: 0,
      transactions: []
    };
    saveAllVaults(vaults);
  }

  return vaults[userId];
}

/**
 * Pricing Calculations for 24K Digital Gold
 */
export function getDigitalGoldRates() {
  const rates = getStoredLiveRates();
  const buyRatePerGram = rates.gold24k; // 24K 999 Pure base bullion rate
  // Sell rate is live 24K rate (market standard spread ~2-3% without GST)
  const sellRatePerGram = Math.round(buyRatePerGram * 0.975);

  return {
    buyRatePerGram,
    sellRatePerGram,
    gstPercent: 3.0,
    minBuyAmountInr: 100,
    minSellGrams: 0.01,
    minRedeemGrams: 0.5
  };
}

/**
 * Calculate Buy Preview (In INR or in Grams)
 */
export function calculateBuyQuote({ amountInr = 0, grams = 0, mode = 'inr' }) {
  const { buyRatePerGram, gstPercent } = getDigitalGoldRates();

  if (mode === 'inr') {
    const totalAmount = Math.max(0, Number(amountInr) || 0);
    // Total Amount = Metal Cost + 3% GST -> Metal Cost = Total / 1.03
    const metalCost = Math.round((totalAmount / (1 + (gstPercent / 100))) * 100) / 100;
    const gstAmount = Math.round((totalAmount - metalCost) * 100) / 100;
    const goldGrams = Math.round((metalCost / buyRatePerGram) * 10000) / 10000;

    return {
      mode: 'inr',
      totalAmount,
      metalCost,
      gstAmount,
      goldGrams,
      ratePerGram: buyRatePerGram
    };
  } else {
    const targetGrams = Math.max(0, Number(grams) || 0);
    const metalCost = Math.round(targetGrams * buyRatePerGram);
    const gstAmount = Math.round(metalCost * (gstPercent / 100));
    const totalAmount = metalCost + gstAmount;

    return {
      mode: 'grams',
      totalAmount,
      metalCost,
      gstAmount,
      goldGrams: targetGrams,
      ratePerGram: buyRatePerGram
    };
  }
}

/**
 * Calculate Sell Quote (In Grams)
 */
export function calculateSellQuote({ grams = 0 }) {
  const { sellRatePerGram } = getDigitalGoldRates();
  const targetGrams = Math.max(0, Number(grams) || 0);
  const payoutAmount = Math.round(targetGrams * sellRatePerGram);

  return {
    grams: targetGrams,
    ratePerGram: sellRatePerGram,
    payoutAmount
  };
}

/**
 * 1. BUY DIGITAL GOLD
 */
export function buyDigitalGold({
  user,
  amountInr,
  grams,
  mode = 'inr',
  paymentMethod = 'UPI'
}) {
  if (!user || !user.uid) {
    throw new Error('Please sign in to buy 24K Digital Gold.');
  }

  const quote = calculateBuyQuote({ amountInr, grams, mode });
  const { minBuyAmountInr } = getDigitalGoldRates();

  if (quote.totalAmount < minBuyAmountInr) {
    throw new Error(`Minimum purchase amount is ₹${minBuyAmountInr}.`);
  }

  if (quote.goldGrams <= 0) {
    throw new Error('Please enter a valid amount or gram quantity.');
  }

  const vaults = getAllVaults();
  const vault = vaults[user.uid] || {
    userId: user.uid,
    grams: 0.0000,
    totalInvested: 0,
    transactions: []
  };

  const txId = 'TXN-BUY-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
  const transaction = {
    id: txId,
    txId,
    type: 'BUY',
    title: 'Purchased 24K Pure Digital Gold',
    grams: quote.goldGrams,
    amountInr: quote.totalAmount,
    metalCost: quote.metalCost,
    gstAmount: quote.gstAmount,
    ratePerGram: quote.ratePerGram,
    paymentMethod,
    createdAt: new Date().toISOString(),
    status: 'SUCCESS',
    invoiceNumber: 'INV-DG-' + Math.floor(100000 + Math.random() * 900000)
  };

  vault.grams = Math.round((vault.grams + quote.goldGrams) * 10000) / 10000;
  vault.totalInvested = (vault.totalInvested || 0) + quote.totalAmount;
  vault.transactions.unshift(transaction);

  vaults[user.uid] = vault;
  saveAllVaults(vaults);

  return { vault, transaction };
}

/**
 * 2. SELL DIGITAL GOLD
 */
export function sellDigitalGold({
  user,
  grams,
  payoutDetails
}) {
  if (!user || !user.uid) {
    throw new Error('Please sign in to sell Digital Gold.');
  }

  const sellGrams = Number(grams);
  const { minSellGrams } = getDigitalGoldRates();

  if (!sellGrams || sellGrams < minSellGrams) {
    throw new Error(`Minimum gold quantity to sell is ${minSellGrams}g.`);
  }

  const vaults = getAllVaults();
  const vault = vaults[user.uid] || { grams: 0, transactions: [] };

  if (vault.grams < sellGrams) {
    throw new Error(`Insufficient gold balance. You have ${vault.grams.toFixed(4)}g in your vault.`);
  }

  if (!payoutDetails || (!payoutDetails.upiId && (!payoutDetails.accountNumber || !payoutDetails.ifsc))) {
    throw new Error('Please provide valid UPI ID or Bank Account Details for payout transfer.');
  }

  const quote = calculateSellQuote({ grams: sellGrams });
  const txId = 'TXN-SELL-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

  const transaction = {
    id: txId,
    txId,
    type: 'SELL',
    title: 'Sold 24K Digital Gold to Bank/UPI',
    grams: sellGrams,
    payoutAmount: quote.payoutAmount,
    ratePerGram: quote.ratePerGram,
    payoutDetails: payoutDetails.upiId ? `UPI: ${payoutDetails.upiId}` : `A/C: ${payoutDetails.accountNumber.slice(-4)} (${payoutDetails.ifsc})`,
    createdAt: new Date().toISOString(),
    status: 'SUCCESS',
    referenceNo: 'REF-BANK-' + Math.floor(10000000 + Math.random() * 90000000)
  };

  vault.grams = Math.round((vault.grams - sellGrams) * 10000) / 10000;
  vault.transactions.unshift(transaction);

  vaults[user.uid] = vault;
  saveAllVaults(vaults);

  return { vault, transaction };
}

/**
 * 3. REDEEM DIGITAL GOLD (To Physical 24K Coin or Store Voucher)
 */
export function redeemDigitalGold({
  user,
  grams,
  redemptionType = 'STORE_VOUCHER', // 'STORE_VOUCHER' | 'PHYSICAL_COIN'
  deliveryAddress = null
}) {
  if (!user || !user.uid) {
    throw new Error('Please sign in to redeem Digital Gold.');
  }

  const redeemGrams = Number(grams);
  const { minRedeemGrams, buyRatePerGram } = getDigitalGoldRates();

  if (!redeemGrams || redeemGrams < minRedeemGrams) {
    throw new Error(`Minimum gold quantity for redemption is ${minRedeemGrams}g.`);
  }

  const vaults = getAllVaults();
  const vault = vaults[user.uid] || { grams: 0, transactions: [] };

  if (vault.grams < redeemGrams) {
    throw new Error(`Insufficient gold balance. You have ${vault.grams.toFixed(4)}g in your vault.`);
  }

  const valueInr = Math.round(redeemGrams * buyRatePerGram);
  const txId = 'TXN-RED-' + Date.now().toString(36).toUpperCase();
  const voucherCode = 'VAISHU-DG-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const transaction = {
    id: txId,
    txId,
    type: 'REDEEM',
    title: redemptionType === 'PHYSICAL_COIN' ? 'Redeemed for 24K Minted Gold Coin Delivery' : 'Converted to Royal Jewellery Store Voucher',
    grams: redeemGrams,
    equivalentValueInr: valueInr,
    redemptionType,
    voucherCode: redemptionType === 'STORE_VOUCHER' ? voucherCode : null,
    deliveryAddress: redemptionType === 'PHYSICAL_COIN' ? deliveryAddress : null,
    createdAt: new Date().toISOString(),
    status: 'SUCCESS'
  };

  vault.grams = Math.round((vault.grams - redeemGrams) * 10000) / 10000;
  vault.transactions.unshift(transaction);

  vaults[user.uid] = vault;
  saveAllVaults(vaults);

  return { vault, transaction, voucherCode, valueInr };
}

/**
 * VAISHU JEWELLERY - Monthly Purchase Plan Service (Swarna Nidhi 11+1)
 * Compliance with Bureau of Indian Standards & Indian Jewellery Advance Purchase Guidelines
 * 
 * NOTE: This is strictly an advance jewellery purchase scheme.
 * No cash interest, no financial deposits, and no cash refunds are permitted.
 * The entire maturity sum (User Installments + 1 Month FREE EMI from Vaishu Jewellery)
 * can ONLY be redeemed for purchasing certified BIS 916 hallmarked jewellery.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '../config/firebase';

const LOCAL_PLANS_KEY = 'vaishu_monthly_purchase_plans_v1';

function getLocalPlans() {
  try {
    const raw = localStorage.getItem(LOCAL_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPlans(plans) {
  localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(plans));
}

/**
 * Calculate Plan Returns & Vaishu 1-Month Free Bonus
 */
export function calculatePlanEstimate(monthlyAmount, durationMonths = 11) {
  const amount = Number(monthlyAmount) || 5000;
  const duration = Number(durationMonths) || 11;
  const userContribution = amount * duration;
  const bonusAmount = duration === 11 ? amount : Math.round(amount * 0.5);
  const totalMaturityValue = userContribution + bonusAmount;

  return {
    monthlyAmount: amount,
    durationMonths: duration,
    userContribution,
    bonusAmount, // 1 Month EMI FREE from Vaishu Jewellery
    totalMaturityValue,
    bonusDescription: duration === 11 ? '1 Month EMI Free (100% On Us)' : '50% of 1 Month EMI Free'
  };
}

/**
 * Get all plans for a user
 */
export async function getUserPlans(userId) {
  if (!userId) return [];

  if (db && isLiveFirebaseConfigured) {
    try {
      const q = query(collection(db, 'purchase_plans'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getUserPlans failed, falling back to local storage:', err);
    }
  }

  const all = getLocalPlans();
  return all.filter(p => p.userId === userId);
}

/**
 * Enroll in a new Monthly Jewellery Purchase Plan
 */
export async function enrollInPlan({
  user,
  monthlyAmount,
  durationMonths = 11,
  nomineeName = '',
  nomineeRelation = '',
  paymentMethod = 'UPI'
}) {
  const estimate = calculatePlanEstimate(monthlyAmount, durationMonths);
  const planId = 'VP-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  const initialPayment = {
    installmentNo: 1,
    amount: estimate.monthlyAmount,
    paidAt: now.toISOString(),
    paymentMethod,
    receiptNo: 'REC-' + Date.now().toString(36).toUpperCase(),
    status: 'PAID'
  };

  const planData = {
    id: planId,
    planId,
    userId: user?.uid || 'guest_' + Date.now(),
    customerName: user?.displayName || 'Royal Patron',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '+91 98765 43210',
    nomineeName: nomineeName || 'Not Specified',
    nomineeRelation: nomineeRelation || 'Family',
    monthlyAmount: estimate.monthlyAmount,
    durationMonths: estimate.durationMonths,
    userContributionTarget: estimate.userContribution,
    bonusContribution: estimate.bonusAmount,
    totalMaturityValue: estimate.totalMaturityValue,
    installmentsPaid: 1,
    installments: [initialPayment],
    status: 'ACTIVE', // 'ACTIVE' | 'MATURED' | 'REDEEMED'
    voucherCode: null,
    createdAt: now.toISOString(),
    nextDueDate: nextMonth.toISOString(),
    legalDisclaimerAccepted: true
  };

  if (db && isLiveFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'purchase_plans', planId), planData);
    } catch (err) {
      console.warn('Firestore enrollInPlan error:', err);
    }
  }

  const localPlans = getLocalPlans();
  localPlans.unshift(planData);
  saveLocalPlans(localPlans);

  return planData;
}

/**
 * Pay next installment for an active plan
 */
export async function payNextInstallment(planId, paymentMethod = 'UPI') {
  const localPlans = getLocalPlans();
  const index = localPlans.findIndex(p => p.id === planId || p.planId === planId);
  if (index === -1) throw new Error('Plan not found');

  const plan = localPlans[index];
  if (plan.installmentsPaid >= plan.durationMonths) {
    throw new Error('All installments already paid for this plan');
  }

  const newInstallmentNo = plan.installmentsPaid + 1;
  const now = new Date();
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + 30);

  const newPayment = {
    installmentNo: newInstallmentNo,
    amount: plan.monthlyAmount,
    paidAt: now.toISOString(),
    paymentMethod,
    receiptNo: 'REC-' + Date.now().toString(36).toUpperCase(),
    status: 'PAID'
  };

  plan.installments.push(newPayment);
  plan.installmentsPaid = newInstallmentNo;
  plan.nextDueDate = nextDueDate.toISOString();

  // If user completed all required months, unlock 12th Month Free Bonus EMI!
  if (plan.installmentsPaid >= plan.durationMonths) {
    plan.status = 'MATURED';
    plan.voucherCode = 'VAISHU-GOLD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    plan.maturedAt = now.toISOString();
  }

  localPlans[index] = plan;
  saveLocalPlans(localPlans);

  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'purchase_plans', planId), {
        installments: plan.installments,
        installmentsPaid: plan.installmentsPaid,
        nextDueDate: plan.nextDueDate,
        status: plan.status,
        voucherCode: plan.voucherCode || null,
        maturedAt: plan.maturedAt || null
      });
    } catch (err) {
      console.warn('Firestore payNextInstallment error:', err);
    }
  }

  return plan;
}

/**
 * Redeem Matured Jewellery Voucher
 */
export async function redeemPlanVoucher(planId) {
  const localPlans = getLocalPlans();
  const index = localPlans.findIndex(p => p.id === planId || p.planId === planId);
  if (index === -1) throw new Error('Plan not found');

  const plan = localPlans[index];
  plan.status = 'REDEEMED';
  plan.redeemedAt = new Date().toISOString();

  localPlans[index] = plan;
  saveLocalPlans(localPlans);

  if (db && isLiveFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'purchase_plans', planId), {
        status: 'REDEEMED',
        redeemedAt: plan.redeemedAt
      });
    } catch (err) {
      console.warn('Firestore redeemPlanVoucher error:', err);
    }
  }

  return plan;
}

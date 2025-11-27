import { InstallmentData, CalculationResult } from '../types';

export const calculatePriceTable = (
  amount: number,
  installments: number,
  interestRatePercentage: number
): CalculationResult => {
  const schedule: InstallmentData[] = [];
  
  if (amount <= 0 || installments <= 0) {
    return {
      schedule: [],
      totalInterest: 0,
      totalPayment: 0,
      monthlyPayment: 0
    };
  }

  const i = interestRatePercentage / 100; // Rate in decimal
  let pmt = 0;

  // Avoid division by zero if interest rate is 0
  if (i === 0) {
    pmt = amount / installments;
  } else {
    pmt = amount * ( (i * Math.pow(1 + i, installments)) / (Math.pow(1 + i, installments) - 1) );
  }

  let currentBalance = amount;
  let totalInterest = 0;

  for (let n = 1; n <= installments; n++) {
    const interest = currentBalance * i;
    const amortization = pmt - interest;
    const newBalance = Math.max(0, currentBalance - amortization);

    schedule.push({
      number: n,
      payment: pmt,
      interest: interest,
      amortization: amortization,
      balance: newBalance,
    });

    totalInterest += interest;
    currentBalance = newBalance;
  }

  // Adjust last balance to exactly 0 if small floating point error exists
  if (schedule.length > 0) {
      schedule[schedule.length - 1].balance = 0;
  }

  return {
    schedule,
    totalInterest,
    totalPayment: pmt * installments,
    monthlyPayment: pmt,
  };
};
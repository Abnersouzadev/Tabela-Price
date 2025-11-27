export interface LoanParams {
  clientName: string;
  amount: number;
  installments: number;
  interestRate: number; // Monthly percentage
}

export interface InstallmentData {
  number: number;
  payment: number;      // PMT (Prestação)
  interest: number;     // Juros
  amortization: number; // Amortização
  balance: number;      // Saldo Devedor
}

export interface CalculationResult {
  schedule: InstallmentData[];
  totalInterest: number;
  totalPayment: number;
  monthlyPayment: number;
}
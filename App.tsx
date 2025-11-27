import React, { useState, useEffect, useMemo } from 'react';
import { Download, Calculator, User, DollarSign, Calendar, Percent, PieChart, TrendingUp, CreditCard } from 'lucide-react';
import { LoanParams, CalculationResult } from './types';
import { calculatePriceTable } from './utils/calculator';
import { generatePDF } from './utils/pdfGenerator';
import { formatCurrency } from './utils/formatters';
import { SummaryCard } from './components/SummaryCard';

const App: React.FC = () => {
  const [params, setParams] = useState<LoanParams>({
    clientName: '',
    amount: 10000,
    installments: 12,
    interestRate: 1,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const res = calculatePriceTable(params.amount, params.installments, params.interestRate);
    setResult(res);
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: name === 'clientName' ? value : parseFloat(value) || 0
    }));
  };

  const handleDownload = () => {
    if (result) {
      generatePDF(params, result);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gray-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Calculadora Price
            </h1>
            <p className="text-gray-500">
              Simule financiamentos e gere relatórios profissionais.
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={!result || result.schedule.length === 0}
            className="group flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-full font-medium transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>Baixar PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6 text-gray-900">
                <Calculator className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Dados do Contrato</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="clientName"
                      value={params.clientName}
                      onChange={handleInputChange}
                      placeholder="Ex: João da Silva"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Empréstimo (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="amount"
                      value={params.amount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas (Meses)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="installments"
                        value={params.installments}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxa (% a.m.)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="interestRate"
                        value={params.interestRate}
                        readOnly
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 leading-relaxed">
              O sistema utiliza a Tabela Price (Sistema Francês de Amortização), onde as parcelas são fixas ao longo do tempo.
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Summary Cards */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard 
                  label="Prestação Mensal"
                  value={formatCurrency(result.monthlyPayment)}
                  subValue="Valor fixo"
                  icon={CreditCard}
                  highlight={true}
                />
                <SummaryCard 
                  label="Total de Juros"
                  value={formatCurrency(result.totalInterest)}
                  subValue={`+${((result.totalInterest / params.amount) * 100).toFixed(1)}% do valor`}
                  icon={TrendingUp}
                />
                <SummaryCard 
                  label="Custo Total"
                  value={formatCurrency(result.totalPayment)}
                  subValue="Principal + Juros"
                  icon={PieChart}
                />
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                <h3 className="font-semibold text-gray-900">Detalhamento das Parcelas</h3>
              </div>
              
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-0">
                    <tr>
                      <th className="px-6 py-3 font-medium text-center w-16">#</th>
                      <th className="px-6 py-3 font-medium text-right">Prestação</th>
                      <th className="px-6 py-3 font-medium text-right text-red-600">Juros</th>
                      <th className="px-6 py-3 font-medium text-right text-emerald-600">Amortização</th>
                      <th className="px-6 py-3 font-medium text-right">Saldo Devedor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result?.schedule.map((row) => (
                      <tr key={row.number} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3 text-center text-gray-400 font-medium">{row.number}</td>
                        <td className="px-6 py-3 text-right font-medium text-gray-900">
                          {formatCurrency(row.payment)}
                        </td>
                        <td className="px-6 py-3 text-right text-red-500">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-6 py-3 text-right text-emerald-600">
                          {formatCurrency(row.amortization)}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500 font-mono">
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                    
                    {(!result || result.schedule.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          Preencha os dados para visualizar a tabela.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
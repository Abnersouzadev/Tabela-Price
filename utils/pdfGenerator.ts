import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, LoanParams } from '../types';
import { formatCurrency } from './formatters';

export const generatePDF = (params: LoanParams, result: CalculationResult) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Relatório de Financiamento - Tabela Price', 14, 22);

  // Client Info Box
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  const date = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data: ${date}`, 14, 32);
  doc.text(`Cliente: ${params.clientName || 'Não informado'}`, 14, 40);

  // Summary Table
  const summaryData = [
    ['Valor Financiado', formatCurrency(params.amount)],
    ['Parcelas', `${params.installments}x`],
    ['Taxa de Juros', `${params.interestRate}% a.m.`],
    ['Prestação Mensal', formatCurrency(result.monthlyPayment)],
    ['Total de Juros', formatCurrency(result.totalInterest)],
    ['Valor Total Pago', formatCurrency(result.totalPayment)],
  ];

  autoTable(doc, {
    startY: 48,
    head: [['Resumo do Contrato', 'Valores']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [50, 50, 50] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    }
  });

  // Detailed Schedule
  const tableBody = result.schedule.map((row) => [
    row.number,
    formatCurrency(row.payment),
    formatCurrency(row.interest),
    formatCurrency(row.amortization),
    formatCurrency(row.balance),
  ]);

  autoTable(doc, {
    // @ts-ignore - startY exists on previous autoTable instance but types might be tricky
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['Mês', 'Prestação', 'Juros', 'Amortização', 'Saldo Devedor']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [75, 85, 99] }, // Gray-600
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Gerado por Calculadora Price Minimalista', 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`price-calculo-${params.clientName.replace(/\s+/g, '-').toLowerCase() || 'cliente'}.pdf`);
};
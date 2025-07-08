import React from 'react';
import { SocialSpendData } from './BankingSocialData';
import { formatCurrencyBKM } from '@/services/dataService';

interface BankInvestmentSummaryProps {
  data: SocialSpendData[];
  bank: string;
  year: number;
}

export const BankInvestmentSummary: React.FC<BankInvestmentSummaryProps> = ({ data, bank, year }) => {
  // Filter data for specific bank and year only (no December from previous year)
  const bankYearData = data.filter(item => item.bank === bank && item.year === year);
  
  if (bankYearData.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Summary - {year}</h3>
        <p className="text-sm text-gray-600">No data available for {bank} in {year}</p>
      </div>
    );
  }
  
  // Group by distributor and sum the dollars
  const distributorSummary = bankYearData.reduce((acc, item) => {
    const distributor = item.platform; // Using platform as distributor
    if (!acc[distributor]) {
      acc[distributor] = 0;
    }
    acc[distributor] += item.spend;
    return acc;
  }, {} as Record<string, number>);

  // Sort distributors by spend amount (descending)
  const sortedDistributors = Object.entries(distributorSummary)
    .sort((a, b) => b[1] - a[1]);

  // Calculate total
  const totalSpend = Object.values(distributorSummary).reduce((sum, spend) => sum + spend, 0);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Investment Summary - {year}</h3>
        <p className="text-sm text-gray-600">{bank} Platform Investment Breakdown</p>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                Metric
              </th>
              {sortedDistributors.map(([distributor]) => (
                <th key={distributor} className="border px-3 py-2 text-xs font-medium text-gray-500 uppercase text-center">
                  {distributor.replace('.COM', '')}
                </th>
              ))}
              <th className="border px-3 py-2 text-xs font-medium text-gray-500 uppercase text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border px-3 py-2 text-sm font-medium text-gray-900">
                Investment
              </td>
              {sortedDistributors.map(([distributor, spend]) => (
                <td key={distributor} className="border px-3 py-2 text-sm text-gray-900 text-center font-mono">
                  {formatCurrencyBKM(spend)}
                </td>
              ))}
              <td className="border px-3 py-2 text-sm text-gray-900 text-center font-mono font-semibold">
                {formatCurrencyBKM(totalSpend)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
import React from "react";
import { WaveTableData } from "@/services/dataService";
import { formatCurrencyBKM } from "@/services/dataService";

interface YoYWaveTableProps {
  waveData: WaveTableData;
}

function getYoYChange(a: number, b: number): string {
  if (a === 0 && b === 0) return "-";
  if (a === 0) return b > 0 ? "+100%" : "0%";
  const pct = ((b - a) / Math.abs(a)) * 100;
  return `${pct > 0 ? "+" : ""}${pct.toFixed(0)}%`;
}

function getYoYChangeColor(a: number, b: number): string {
  if (a === 0 && b === 0) return "text-gray-500";
  if (a === 0) return b > 0 ? "text-green-600" : "text-gray-500";
  const pct = ((b - a) / Math.abs(a)) * 100;
  if (pct > 0) return "text-green-600";
  if (pct < 0) return "text-red-600";
  return "text-gray-500";
}

export const YoYWaveTable: React.FC<YoYWaveTableProps> = ({ waveData }) => {
  const { banks, months, yearA, yearB, dataA, dataB } = waveData;
  const yearA_prev = yearA - 1;

  // Calculate totals for each bank
  const bankTotals = banks.map(bank => ({
    bank,
    totalA: months.reduce((sum, m) => sum + dataA[bank][m], 0),
    totalB: months.reduce((sum, m) => sum + dataB[bank][m], 0)
  }));

  // Sort banks by Wave 1 totals (descending) for Wave 1 table
  const banksOrderedByA = bankTotals.sort((a, b) => b.totalA - a.totalA);
  
  // Sort banks by Wave 2 totals (descending) for Wave 2 table  
  const banksOrderedByB = bankTotals.sort((a, b) => b.totalB - a.totalB);

  return (
    <div className="overflow-x-auto w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Wave 1: Dec {yearA_prev} + months {yearA} (data from {yearA_prev} and {yearA})
        </h3>
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-wells-fargo-red text-white">
              <th className="py-2 px-3 text-left font-semibold">Bank</th>
              {months.map(month => (
                <th key={month} className="py-2 px-3 font-semibold text-right">
                  {month === "December" ? `Dec'${String(yearA_prev).slice(-2)}` : `${month.slice(0,3)}'${String(yearA).slice(-2)}`}
                </th>
              ))}
              <th className="py-2 px-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {banksOrderedByA.map((bankData) => (
              <tr key={bankData.bank} className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">{bankData.bank}</td>
                {months.map(month => (
                  <td key={month} className="py-2 px-3 text-right">{formatCurrencyBKM(dataA[bankData.bank][month])}</td>
                ))}
                <td className="py-2 px-3 text-right font-bold">{formatCurrencyBKM(bankData.totalA)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Wave 2: Dec {yearA} + months {yearB} (data from {yearA} and {yearB})
        </h3>
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-wells-fargo-red text-white">
              <th className="py-2 px-3 text-left font-semibold">Bank</th>
              {months.map(month => (
                <th key={month} className="py-2 px-3 font-semibold text-right">
                  {month === "December" ? `Dec'${String(yearA).slice(-2)}` : `${month.slice(0,3)}'${String(yearB).slice(-2)}`}
                </th>
              ))}
              <th className="py-2 px-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {banksOrderedByB.map((bankData) => (
              <tr key={bankData.bank} className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">{bankData.bank}</td>
                {months.map(month => (
                  <td key={month} className="py-2 px-3 text-right">{formatCurrencyBKM(dataB[bankData.bank][month])}</td>
                ))}
                <td className="py-2 px-3 text-right font-bold">{formatCurrencyBKM(bankData.totalB)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">YoY Change: Wave 1 vs Wave 2</h3>
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-wells-fargo-red text-white">
              <th className="py-2 px-3 text-left font-semibold">Bank</th>
              {months.map(month => (
                <th key={month} className="py-2 px-3 font-semibold text-right">{month === "December" ? `Dec` : month.slice(0,3)}</th>
              ))}
              <th className="py-2 px-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {banksOrderedByB.map((bankData) => (
              <tr key={bankData.bank} className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">{bankData.bank}</td>
                {months.map(month => (
                  <td key={month} className="py-2 px-3 text-right">{getYoYChange(dataA[bankData.bank][month], dataB[bankData.bank][month])}</td>
                ))}
                <td className={`py-2 px-3 text-right font-bold ${getYoYChangeColor(bankData.totalA, bankData.totalB)}`}>{getYoYChange(bankData.totalA, bankData.totalB)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 
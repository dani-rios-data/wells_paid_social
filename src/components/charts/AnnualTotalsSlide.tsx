import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { bankColors, formatCurrencyBKM } from '../../services/dataService';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface AnnualTotalsSlideProps {
  data: SocialSpendData[];
}

export const AnnualTotalsSlide = ({ data }: AnnualTotalsSlideProps) => {
  // State for selected banks filter
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get ALL unique banks from the data
  const allBanks = useMemo(() => [...new Set(data.map(item => item.bank))].sort(), [data]);
  
  // Initialize with all banks selected
  React.useEffect(() => {
    if (selectedBanks.length === 0 && allBanks.length > 0) {
      setSelectedBanks([...allBanks]);
    }
  }, [allBanks, selectedBanks.length]);
  
  // Filter data based on selected banks
  const filteredData = useMemo(() => {
    if (selectedBanks.length === 0) return data;
    return data.filter(item => selectedBanks.includes(item.bank));
  }, [data, selectedBanks]);
  
  // Handle bank selection
  const handleBankToggle = (bank: string) => {
    setSelectedBanks(prev => {
      if (prev.includes(bank)) {
        return prev.filter(b => b !== bank);
      } else {
        return [...prev, bank];
      }
    });
  };

  // Calculate total spend by year by brand
  const getTotalSpendByYearByBrand = () => {
    const totals = filteredData.reduce((acc, curr) => {
      if (!acc[curr.bank]) {
        acc[curr.bank] = { 2023: 0, 2024: 0, 2025: 0 };
      }
      acc[curr.bank][curr.year] = (acc[curr.bank][curr.year] || 0) + curr.spend;
      return acc;
    }, {} as Record<string, { 2023: number; 2024: number; 2025: number }>);

    return Object.entries(totals).map(([bank, years]) => ({
      bank,
      2023: years[2023],
      2024: years[2024],
      2025: years[2025]
    })).sort((a, b) => (b[2024] + b[2025]) - (a[2024] + a[2025])); // Sort by combined 2024+2025 spend
  };

  // Calculate month-over-month data for each year
  const getMonthOverMonthData = (year: number) => {
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyData = filteredData.filter(d => d.year === year).reduce((acc, curr) => {
      const monthName = curr.month.split(' ')[0];
      if (!acc[curr.bank]) {
        acc[curr.bank] = {};
      }
      acc[curr.bank][monthName] = (acc[curr.bank][monthName] || 0) + curr.spend;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Get all months available for this year
    const availableMonths = [...new Set(filteredData.filter(d => d.year === year).map(d => d.month.split(' ')[0]))];
    const sortedMonths = monthOrder.filter(month => availableMonths.includes(month));

    return { monthlyData, sortedMonths };
  };

  const totalSpendData = getTotalSpendByYearByBrand();
  const mom2023 = getMonthOverMonthData(2023);
  const mom2024 = getMonthOverMonthData(2024);
  const mom2025 = getMonthOverMonthData(2025);

  const formatAxisCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(0)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6" onClick={() => setIsFilterOpen(false)}>
      {/* Dashboard Filters */}
      <div className="bg-slate-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard Filters</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Banks:</label>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterOpen(!isFilterOpen);
                }}
                className="flex items-center gap-2 text-sm w-48 justify-between bg-white text-black"
              >
                <span>Banks ({selectedBanks.length})</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {isFilterOpen && (
                <div 
                  className="absolute right-0 top-full mt-1 w-64 bg-white border rounded-lg shadow-lg z-10 p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {allBanks.map(bank => (
                      <div key={bank} className="flex items-center space-x-2">
                        <Checkbox
                          id={bank}
                          checked={selectedBanks.includes(bank)}
                          onCheckedChange={() => handleBankToggle(bank)}
                        />
                        <label
                          htmlFor={bank}
                          className="text-sm cursor-pointer flex-1 text-black"
                        >
                          {bank}
                        </label>
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: bankColors[bank as keyof typeof bankColors] || '#6B7280' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Total Spend by Year by Brand - Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Total Spend by Year by Brand
        </h3>
        <div style={{ width: '100%', height: '600px' }}>
          <ResponsiveContainer>
            <BarChart data={totalSpendData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <XAxis 
                dataKey="bank" 
                tick={{ fontSize: 10, fill: '#111' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#111' }}
                tickFormatter={formatAxisCurrency}
                domain={[0, 'dataMax']}
              />
              <Tooltip formatter={(value) => formatCurrencyBKM(value as number)} />
              <Legend />
              <Bar dataKey="2023" fill="#8884d8" name="2023" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2024" fill="#82ca9d" name="2024" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2025" fill="#ffc658" name="2025" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Spend by Year by Brand - Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Total Spend by Year by Brand (Table)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-wells-fargo-red text-white">
                <th className="text-left py-3 px-4 font-semibold">Bank</th>
                <th className="text-right py-3 px-4 font-semibold">2023</th>
                <th className="text-right py-3 px-4 font-semibold">2024</th>
                <th className="text-right py-3 px-4 font-semibold">2025</th>
                <th className="text-right py-3 px-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {totalSpendData.map((row, index) => {
                const rowTotal = row[2023] + row[2024] + row[2025];
                return (
                  <tr key={row.bank} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-medium">{row.bank}</td>
                    <td className="py-3 px-4 text-right">{formatCurrencyBKM(row[2023])}</td>
                    <td className="py-3 px-4 text-right">{formatCurrencyBKM(row[2024])}</td>
                    <td className="py-3 px-4 text-right">{formatCurrencyBKM(row[2025])}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrencyBKM(rowTotal)}</td>
                  </tr>
                );
              })}
              {/* Column totals row */}
              <tr className="bg-wells-fargo-red text-white font-semibold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-right">
                  {formatCurrencyBKM(totalSpendData.reduce((sum, row) => sum + row[2023], 0))}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrencyBKM(totalSpendData.reduce((sum, row) => sum + row[2024], 0))}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrencyBKM(totalSpendData.reduce((sum, row) => sum + row[2025], 0))}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrencyBKM(totalSpendData.reduce((sum, row) => sum + row[2023] + row[2024] + row[2025], 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Month-over-Month tables for each year - stacked vertically */}
      <div className="space-y-6">
        {/* 2023 MoM */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">2023 Month-over-Month</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-wells-fargo-red text-white">
                  <th className="text-left py-2 px-3 font-semibold text-xs">Bank</th>
                  {mom2023.sortedMonths.map(month => (
                    <th key={month} className="text-right py-2 px-2 font-semibold text-xs">{month.slice(0, 3)}</th>
                  ))}
                  <th className="text-right py-2 px-2 font-semibold text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mom2023.monthlyData).map(([bank, months], index) => {
                  const total = mom2023.sortedMonths.reduce((sum, month) => sum + (months[month] || 0), 0);
                  return (
                    <tr key={bank} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-3 font-medium text-xs">{bank}</td>
                      {mom2023.sortedMonths.map(month => (
                        <td key={month} className="py-2 px-2 text-right text-xs">
                          {months[month] ? formatCurrencyBKM(months[month]) : '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-right text-xs font-semibold">
                        {formatCurrencyBKM(total)}
                      </td>
                    </tr>
                  );
                })}
                {/* Column totals row */}
                <tr className="bg-wells-fargo-red text-white font-semibold">
                  <td className="py-2 px-3 text-xs">Total</td>
                  {mom2023.sortedMonths.map(month => {
                    const columnTotal = Object.entries(mom2023.monthlyData).reduce((sum, [bank, months]) => sum + (months[month] || 0), 0);
                    return (
                      <td key={month} className="py-2 px-2 text-right text-xs">
                        {formatCurrencyBKM(columnTotal)}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-right text-xs">
                    {formatCurrencyBKM(Object.entries(mom2023.monthlyData).reduce((sum, [bank, months]) => 
                      sum + mom2023.sortedMonths.reduce((monthSum, month) => monthSum + (months[month] || 0), 0), 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2024 MoM */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">2024 Month-over-Month</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-wells-fargo-red text-white">
                  <th className="text-left py-2 px-3 font-semibold text-xs">Bank</th>
                  {mom2024.sortedMonths.map(month => (
                    <th key={month} className="text-right py-2 px-2 font-semibold text-xs">{month.slice(0, 3)}</th>
                  ))}
                  <th className="text-right py-2 px-2 font-semibold text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mom2024.monthlyData).map(([bank, months], index) => {
                  const total = mom2024.sortedMonths.reduce((sum, month) => sum + (months[month] || 0), 0);
                  return (
                    <tr key={bank} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-3 font-medium text-xs">{bank}</td>
                      {mom2024.sortedMonths.map(month => (
                        <td key={month} className="py-2 px-2 text-right text-xs">
                          {months[month] ? formatCurrencyBKM(months[month]) : '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-right text-xs font-semibold">
                        {formatCurrencyBKM(total)}
                      </td>
                    </tr>
                  );
                })}
                {/* Column totals row */}
                <tr className="bg-wells-fargo-red text-white font-semibold">
                  <td className="py-2 px-3 text-xs">Total</td>
                  {mom2024.sortedMonths.map(month => {
                    const columnTotal = Object.entries(mom2024.monthlyData).reduce((sum, [bank, months]) => sum + (months[month] || 0), 0);
                    return (
                      <td key={month} className="py-2 px-2 text-right text-xs">
                        {formatCurrencyBKM(columnTotal)}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-right text-xs">
                    {formatCurrencyBKM(Object.entries(mom2024.monthlyData).reduce((sum, [bank, months]) => 
                      sum + mom2024.sortedMonths.reduce((monthSum, month) => monthSum + (months[month] || 0), 0), 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2025 MoM */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">2025 Month-over-Month</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-wells-fargo-red text-white">
                  <th className="text-left py-2 px-3 font-semibold text-xs">Bank</th>
                  {mom2025.sortedMonths.map(month => (
                    <th key={month} className="text-right py-2 px-2 font-semibold text-xs">{month.slice(0, 3)}</th>
                  ))}
                  <th className="text-right py-2 px-2 font-semibold text-xs">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(mom2025.monthlyData).map(([bank, months], index) => {
                  const total = mom2025.sortedMonths.reduce((sum, month) => sum + (months[month] || 0), 0);
                  return (
                    <tr key={bank} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-3 font-medium text-xs">{bank}</td>
                      {mom2025.sortedMonths.map(month => (
                        <td key={month} className="py-2 px-2 text-right text-xs">
                          {months[month] ? formatCurrencyBKM(months[month]) : '-'}
                        </td>
                      ))}
                      <td className="py-2 px-2 text-right text-xs font-semibold">
                        {formatCurrencyBKM(total)}
                      </td>
                    </tr>
                  );
                })}
                {/* Column totals row */}
                <tr className="bg-wells-fargo-red text-white font-semibold">
                  <td className="py-2 px-3 text-xs">Total</td>
                  {mom2025.sortedMonths.map(month => {
                    const columnTotal = Object.entries(mom2025.monthlyData).reduce((sum, [bank, months]) => sum + (months[month] || 0), 0);
                    return (
                      <td key={month} className="py-2 px-2 text-right text-xs">
                        {formatCurrencyBKM(columnTotal)}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-right text-xs">
                    {formatCurrencyBKM(Object.entries(mom2025.monthlyData).reduce((sum, [bank, months]) => 
                      sum + mom2025.sortedMonths.reduce((monthSum, month) => monthSum + (months[month] || 0), 0), 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
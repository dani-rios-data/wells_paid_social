import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { bankColors, formatCurrencyBKM } from '../../services/dataService';
import { YoYSpendTooltip, CustomTooltip } from './CustomTooltip';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface YoYSpendComparisonProps {
  data: SocialSpendData[];
  yearA?: number;
  yearB?: number;
  isPartialComparison?: boolean;
}

export const YoYSpendComparison = ({ data, yearA = 2023, yearB = 2024, isPartialComparison = false }: YoYSpendComparisonProps) => {
  // State for selected banks filter
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get all unique banks from the data
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
  // Get months available in the latest year for partial comparison note
  const getPartialComparisonInfo = () => {
    if (!isPartialComparison) return null;
    
    const monthsInYearB = [...new Set(filteredData.filter(d => d.year === yearB).map(d => d.month.split(' ')[0]))];
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const sortedMonths = monthsInYearB.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    
    const firstMonth = sortedMonths[0];
    const lastMonth = sortedMonths[sortedMonths.length - 1];
    const timeRange = sortedMonths.length === 1 ? firstMonth : `${firstMonth} - ${lastMonth}`;
    
    return {
      months: sortedMonths,
      timeRange,
      yearB
    };
  };

  // Calculate YoY spend for each bank using the specified years
  const calculateYoYData = () => {
    let dataToCompare = filteredData.filter(d => d.year === yearA || d.year === yearB);

    if (isPartialComparison) {
      // Get months available in the latest year (yearB)
      const monthsInYearB = [...new Set(filteredData.filter(d => d.year === yearB).map(d => d.month.split(' ')[0]))];
      
      // Filter data for both years to only include these months
      dataToCompare = dataToCompare.filter(d => 
        monthsInYearB.includes(d.month.split(' ')[0])
      );
    }
    
    const bankTotals = dataToCompare.reduce((acc, curr) => {
      if (!acc[curr.bank]) {
        acc[curr.bank] = { [yearA]: 0, [yearB]: 0 };
      }
      if (curr.year === yearA || curr.year === yearB) {
        acc[curr.bank][curr.year] = (acc[curr.bank][curr.year] || 0) + curr.spend;
      }
      return acc;
    }, {} as Record<string, { [key: number]: number }>);

    return Object.entries(bankTotals).map(([bank, totals]) => {
      const yearASpend = totals[yearA] || 0;
      const yearBSpend = totals[yearB] || 0;
      // Use exact calculations without rounding until display
      const yoyChange = yearASpend > 0 ? ((yearBSpend - yearASpend) / yearASpend) * 100 : 0;
      // Round to 1 decimal place for more precision
      const roundedYoyChange = Math.round(yoyChange * 10) / 10;
      return {
        bank,
        [yearA]: yearASpend,
        [yearB]: yearBSpend,
        yoyChange: roundedYoyChange,
        yoyChangeExact: yoyChange, // Keep exact value for calculations
        yoyChangeDisplay: roundedYoyChange > 0 ? `+${roundedYoyChange}%` : `${roundedYoyChange}%`
      };
    }).sort((a, b) => b.yoyChange - a.yoyChange);
  };

  const yoyData = calculateYoYData();
  const partialInfo = getPartialComparisonInfo();

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch" data-testid="yoy-spend-comparison">
      {/* LEFT COLUMN - CHARTS */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* CHART 1: YoY Spend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col" data-testid="yoy-chart">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            YoY Social Spend by Banks ({yearA} vs {yearB})
          </h3>
          {partialInfo && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This comparison uses partial year data. Since {partialInfo.yearB} only has data for{' '}
                <strong>{partialInfo.timeRange}</strong>, the {yearA} comparison is limited to the same months{' '}
                ({partialInfo.timeRange}) for accurate year-over-year analysis.
              </p>
            </div>
          )}
          <div className="flex-grow" style={{ width: '100%', minHeight: '450px' }}>
            <ResponsiveContainer>
              <BarChart data={yoyData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <XAxis 
                  dataKey="bank" 
                  tick={{ fontSize: 9, fill: '#111' }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#111' }}
                  tickFormatter={formatAxisCurrency}
                />
                <Tooltip 
                  content={<YoYSpendTooltip yearA={yearA} yearB={yearB} formatter={formatCurrencyBKM} />}
                  cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px' }} />
                <Bar dataKey={yearA} fill="#6b7280" name={yearA.toString()} radius={[6, 6, 0, 0]} />
                <Bar dataKey={yearB} fill="#06b6d4" name={yearB.toString()} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: YoY Change % */}
        <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col" data-testid="yoy-change-chart">
           <h3 className="text-xl font-semibold mb-2 text-foreground">
            YoY Percentage Change by Banks
          </h3>
          {partialInfo && (
            <p className="text-sm text-gray-600 mb-4">
              Based on {partialInfo.timeRange} data comparison
            </p>
          )}
          <div className="flex-grow" style={{ width: '100%', minHeight: '450px' }}>
            <ResponsiveContainer>
              <BarChart data={yoyData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="bank" 
                  tick={{ fontSize: 9, fill: '#111' }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#111' }}
                  tickFormatter={(value) => `${value}%`}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(val) => `${val}%`} valueKey="yoyChange" name="YoY Change" />}
                  cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }}
                />
                <Bar dataKey="yoyChange" name="YoY Change" radius={[6, 6, 0, 0]}>
                  {yoyData.map((entry, index) => {
                    const color = entry.yoyChange > 0 
                      ? '#10b981' // emerald-500
                      : entry.yoyChange < 0 
                        ? '#ef4444' // red-500
                        : '#6b7280'; // gray-500
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - TABLE */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          YoY Change Analysis
        </h3>
        {partialInfo && (
          <p className="text-sm text-gray-600 mb-4">
            Based on {partialInfo.timeRange} data
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-wells-fargo-red text-white">
                <th className="text-left py-3 px-4 font-semibold">Bank</th>
                <th className="text-right py-3 px-4 font-semibold">{yearA}</th>
                <th className="text-right py-3 px-4 font-semibold">{yearB}</th>
                <th className="text-right py-3 px-4 font-semibold">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {yoyData.map((row, index) => (
                <tr key={row.bank} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 font-medium">{row.bank}</td>
                  <td className="py-3 px-4 text-right">{formatCurrencyBKM(row[yearA])}</td>
                  <td className="py-3 px-4 text-right">{formatCurrencyBKM(row[yearB])}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    row.yoyChange > 0 ? 'text-emerald-600' : row.yoyChange < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {row.yoyChangeDisplay}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
        <div className="lg:col-span-3 mt-4 text-sm text-gray-600">
          <p className="font-medium">Source: Nielsen Ad Intel</p>
        </div>
      </div>
    </div>
  );
};
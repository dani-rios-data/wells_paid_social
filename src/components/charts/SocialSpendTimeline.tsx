import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { bankColors, getDateRange, formatCurrencyBKM } from '../../services/dataService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface SocialSpendTimelineProps {
  data: SocialSpendData[];
}

interface AggregatedDataItem {
  month: string;
  sortDate: Date;
  sortKey: number;
  [bankName: string]: string | number | Date;
}

interface ChartDataItem {
  month: string;
  [bankName: string]: string | number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

export const SocialSpendTimeline = ({ data }: SocialSpendTimelineProps) => {
  // State for selected banks filter
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get ALL unique banks from the data
  const allBanks = useMemo(() => [...new Set(data.map(item => item.bank))].sort(), [data]);
  
  // Initialize with all banks selected
  React.useEffect(() => {
    if (selectedBanks.length === 0) {
      setSelectedBanks(allBanks);
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
  
  // Handle select all/none
  const handleSelectAll = () => {
    setSelectedBanks([...allBanks]);
  };
  
  const handleSelectNone = () => {
    setSelectedBanks([]);
  };
  // Helper function to parse month year string to date
  const parseMonthYear = (monthYear: string, year: number) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Handle formats like "April 2023" or just "April"
    const parts = monthYear.trim().split(' ');
    const monthName = parts[0];
    const yearPart = parts.length > 1 ? parseInt(parts[1]) : year;
    
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex === -1) return new Date(yearPart, 0); // Default to January if month not found
    
    return new Date(yearPart, monthIndex);
  };

  // Aggregate data by bank and month-year combination
  const aggregatedData = filteredData.reduce((acc, curr) => {
    const date = parseMonthYear(curr.month, curr.year);
    const sortKey = date.getTime();
    // Format as MMM YYYY (e.g., "Mar 2023")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = date.getMonth();
    const displayKey = `${monthNames[monthIndex]} ${curr.year}`;
    
    if (!acc[sortKey]) {
      acc[sortKey] = { 
        month: displayKey,
        sortDate: date,
        sortKey: sortKey
      };
    }
    const currentValue = acc[sortKey][curr.bank];
    if (typeof currentValue === 'number') {
      acc[sortKey][curr.bank] = currentValue + curr.spend;
    } else {
      acc[sortKey][curr.bank] = curr.spend;
    }
    return acc;
  }, {} as Record<number, AggregatedDataItem>);

  // Sort by date and format for chart
  const chartData: ChartDataItem[] = Object.values(aggregatedData)
    .sort((a: AggregatedDataItem, b: AggregatedDataItem) => a.sortKey - b.sortKey)
    .map((item: AggregatedDataItem) => {
      const { sortDate, sortKey, ...rest } = item;
      return rest as ChartDataItem;
    });

  // Get filtered banks from the data
  const banksInData = [...new Set(filteredData.map(item => item.bank))].sort();
  
  // Calculate Y-axis domain based on filtered data
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1000];
    
    const allValues: number[] = [];
    chartData.forEach(item => {
      banksInData.forEach(bank => {
        const value = item[bank];
        if (typeof value === 'number' && value > 0) {
          allValues.push(value);
        }
      });
    });
    
    if (allValues.length === 0) return [0, 1000];
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    // Add 5% padding
    const padding = (maxValue - minValue) * 0.05;
    const yMin = Math.max(0, minValue - padding);
    const yMax = maxValue + padding;
    
    return [yMin, yMax];
  }, [chartData, banksInData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${Math.round(value / 1000000000)}B`;
    } else if (value >= 1000000) {
      return `$${Math.round(value / 1000000)}M`;
    } else if (value >= 1000) {
      return `$${Math.round(value / 1000)}K`;
    } else {
      return `$${Math.round(value)}`;
    }
  };

  const formatCurrencyTooltip = (value: number) => {
    const formatDecimal = (num: number): string => {
      const formatted = num.toFixed(2);
      return formatted.replace(/\.?0+$/, '');
    };

    if (value >= 1000000000) {
      return `$${formatDecimal(value / 1000000000)}B`;
    } else if (value >= 1000000) {
      return `$${formatDecimal(value / 1000000)}M`;
    } else if (value >= 1000) {
      return `$${formatDecimal(value / 1000)}K`;
    } else {
      return `$${formatDecimal(value)}`;
    }
  };

  const dateRange = getDateRange(filteredData);

  // Custom tooltip formatter that sorts values from highest to lowest
  const customTooltipFormatter = (value: number, name: string) => [formatCurrencyTooltip(value), name];
  
  const customTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      // Sort payload by value in descending order
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '8px',
          fontSize: '10px'
        }}>
          <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '6px', fontSize: '11px' }}>{label}</p>
          {sortedPayload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '2px 0' }}>
              <span style={{ marginRight: '6px' }}>●</span>
              <span style={{ fontWeight: 'bold' }}>{entry.dataKey}</span>: {formatCurrencyTooltip(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border w-full" data-testid="social-spend-timeline">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-foreground">
          Total Social Spend Follows Category Trend of Higher Spend
        </h3>
        
        {/* Multi-select Bank Filter */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-sm"
          >
            Banks ({selectedBanks.length})
            <ChevronDown className="w-4 h-4" />
          </Button>
          
          {isFilterOpen && (
            <div 
              className="absolute right-0 top-full mt-1 w-64 bg-white border rounded-lg shadow-lg z-10 p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectAll();
                  }}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectNone();
                  }}
                  className="text-xs"
                >
                  Select None
                </Button>
              </div>
              
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
                      className="text-sm cursor-pointer flex-1"
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
              
              <div className="mt-2 pt-2 border-t">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsFilterOpen(false);
                  }}
                  className="w-full text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ width: '100%', height: 520 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 25, bottom: 15 }}
          >
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 7, fill: '#374151' }}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              stroke="#9CA3AF"
            />
            <YAxis 
              tick={{ fontSize: 7, fill: '#374151' }}
              tickFormatter={formatCurrency}
              stroke="#9CA3AF"
              width={25}
              domain={yAxisDomain}
            />
            <Tooltip 
              content={customTooltip}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '8px', fontSize: '8px' }}
              iconType="line"
            />
            {banksInData.map((bank) => (
              <Line
                key={bank}
                type="monotone"
                dataKey={bank}
                stroke={bankColors[bank as keyof typeof bankColors] || '#6B7280'}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: bankColors[bank as keyof typeof bankColors] || '#6B7280' }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
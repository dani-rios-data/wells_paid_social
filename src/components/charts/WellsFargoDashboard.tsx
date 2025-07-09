import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { formatCurrencyBKM } from '@/services/dataService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WellsFargoDashboardProps {
  data: SocialSpendData[];
}

export const WellsFargoDashboard: React.FC<WellsFargoDashboardProps> = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedBankForPlatformDonut, setSelectedBankForPlatformDonut] = useState<string>("WELLS FARGO");
  const [selectedPlatformForBankDonut, setSelectedPlatformForBankDonut] = useState<string>("All");
  const [selectedComparisonBank, setSelectedComparisonBank] = useState<string>("CHASE");
  const [selectedDistributor, setSelectedDistributor] = useState<string>("All");

  // Get unique years from data
  const uniqueYears = useMemo(() => {
    return [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
  }, [data]);

  // Get unique banks
  const uniqueBanks = useMemo(() => {
    return [...new Set(data.map(item => item.bank))].sort();
  }, [data]);

  // Get unique banks excluding selected bank for comparison
  const uniqueComparisonBanks = useMemo(() => {
    return [...new Set(data.map(item => item.bank))].filter(bank => bank !== selectedBankForPlatformDonut).sort();
  }, [data, selectedBankForPlatformDonut]);

  // Get unique distributors
  const uniqueDistributors = useMemo(() => {
    return ["All", ...new Set(data.map(item => item.platform))].sort();
  }, [data]);

  // Initialize with latest year and Wells Fargo by default
  useEffect(() => {
    if (uniqueYears.length > 0) {
      setSelectedYear(uniqueYears[0]); // Most recent year
    }
  }, [uniqueYears]);

  // Data for Bank Distribution Donut (responds to year and platform filters)
  const bankDonutData = useMemo(() => {
    let filtered = data.filter(item => item.year === selectedYear);
    if (selectedPlatformForBankDonut !== "All") {
      filtered = filtered.filter(item => item.platform === selectedPlatformForBankDonut);
    }

    const bankTotals = filtered.reduce((acc, item) => {
      acc[item.bank] = (acc[item.bank] || 0) + item.spend;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(bankTotals)
      .map(([bank, total]) => ({
        name: bank,
        value: total,
        percentage: 0 // Will be calculated below
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, arr) => {
        const totalSpend = arr.reduce((sum, i) => sum + i.value, 0);
        return {
          ...item,
          percentage: totalSpend > 0 ? (item.value / totalSpend) * 100 : 0
        };
      });
  }, [data, selectedYear, selectedPlatformForBankDonut]);

  // Data for Platform Distribution Donut (responds to year and bank filters)
  const platformDonutData = useMemo(() => {
    const filtered = data.filter(item => item.bank === selectedBankForPlatformDonut && item.year === selectedYear);

    const platformTotals = filtered.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + item.spend;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(platformTotals)
      .map(([platform, total]) => ({
        name: platform.replace('.COM', ''),
        fullName: platform,
        value: total,
        percentage: 0 // Will be calculated below
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, arr) => {
        const totalSpend = arr.reduce((sum, i) => sum + i.value, 0);
        return {
          ...item,
          percentage: totalSpend > 0 ? (item.value / totalSpend) * 100 : 0
        };
      });
  }, [data, selectedYear, selectedBankForPlatformDonut]);

  // Prepare heat map data (banks in columns, platforms in rows - only responds to year filter)
  const heatMapData = useMemo(() => {
    const platforms = [...new Set(data.map(item => item.platform))];
    const banks = [...new Set(data.filter(item => item.year === selectedYear).map(item => item.bank))].sort();
    const bankData: Record<string, Record<string, number>> = {};
    
    // Initialize data structure
    platforms.forEach(platform => {
      bankData[platform] = {};
      banks.forEach(bank => {
        bankData[platform][bank] = 0;
      });
    });
    
    // Populate with actual data for selected year
    data.filter(item => item.year === selectedYear).forEach(item => {
      if (bankData[item.platform]) {
        bankData[item.platform][item.bank] += item.spend;
      }
    });
    
    return { platforms, banks, data: bankData };
  }, [data, selectedYear]);

  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get selected bank monthly totals
    let selectedBankData = data.filter(item => 
      item.bank === selectedBankForPlatformDonut && item.year === selectedYear
    );
    if (selectedDistributor !== "All") {
      selectedBankData = selectedBankData.filter(item => item.platform === selectedDistributor);
    }
    
    const selectedBankMonthly = selectedBankData.reduce((acc, item) => {
      const month = item.month.split(' ')[0];
      acc[month] = (acc[month] || 0) + item.spend;
      return acc;
    }, {} as Record<string, number>);
    
    // Get comparison bank monthly totals
    let comparisonData = data.filter(item => 
      item.bank === selectedComparisonBank && item.year === selectedYear
    );
    if (selectedDistributor !== "All") {
      comparisonData = comparisonData.filter(item => item.platform === selectedDistributor);
    }
    
    const comparisonMonthly = comparisonData.reduce((acc, item) => {
      const month = item.month.split(' ')[0];
      acc[month] = (acc[month] || 0) + item.spend;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate industry average
    let allBanksData = data.filter(item => item.year === selectedYear);
    if (selectedDistributor !== "All") {
      allBanksData = allBanksData.filter(item => item.platform === selectedDistributor);
    }
    
    const totalSpend = allBanksData.reduce((sum, item) => sum + item.spend, 0);
    const totalBanks = new Set(allBanksData.map(item => item.bank)).size;
    const totalMonths = monthNames.length;
    const industryAverage = totalBanks > 0 && totalMonths > 0 ? totalSpend / (totalBanks * totalMonths) : 0;
    
    return monthNames.map(month => ({
      month: `${month.slice(0, 3)}'${selectedYear.toString().slice(-2)}`,
      [selectedBankForPlatformDonut]: selectedBankMonthly[month] || 0,
      [selectedComparisonBank]: comparisonMonthly[month] || 0,
      'Industry Average': industryAverage
    }));
  }, [data, selectedYear, selectedBankForPlatformDonut, selectedComparisonBank, selectedDistributor]);

  // Platform colors
  const platformColors = {
    'FACEBOOK': '#1877F2',
    'INSTAGRAM': '#E4405F',
    'PINTEREST': '#BD081C',
    'X': '#1DA1F2',
    'REDDIT': '#FF4500',
    'TIKTOK': '#000000',
  };

  // Bank colors
  const bankColors = {
    'WELLS FARGO': '#D71921',
    'CHASE': '#117ACA',
    'BANK OF AMERICA': '#012169',
    'CAPITAL ONE': '#FF8C00',
    'US BANK': '#9932CC',
    'CHIME': '#01AC66',
    'CASH APP': '#00D632',
    'PNC BANK': '#254AA5',
    'TD BANK': '#00B04F',
    'CITI': '#0066CC',
  };

  // Get max value for heat map color scaling
  const maxHeatValue = useMemo(() => {
    return Math.max(...Object.values(heatMapData.data).flatMap(bankData => Object.values(bankData)));
  }, [heatMapData]);

  // Heat map color intensity function - using general blue colors
  const getHeatMapColor = (value: number) => {
    if (value === 0) return '#f8f9fa';
    const intensity = value / maxHeatValue;
    const blue = Math.floor(200 - (100 * intensity)); // Blue gradient
    const green = Math.floor(220 - (60 * intensity));
    const red = Math.floor(240 - (40 * intensity));
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      dataKey: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${formatCurrencyBKM(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom label function for donut charts with external lines
  const renderCustomizedLabel = (entry: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percentage: number;
    name: string;
    value: number;
  }, chartType: 'bank' | 'platform') => {
    const RADIAN = Math.PI / 180;
    const radius = entry.outerRadius + 35; // Position outside the chart
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);
    
    // Line coordinates
    const lineStartRadius = entry.outerRadius + 5;
    const lineEndRadius = entry.outerRadius + 25;
    const lineStartX = entry.cx + lineStartRadius * Math.cos(-entry.midAngle * RADIAN);
    const lineStartY = entry.cy + lineStartRadius * Math.sin(-entry.midAngle * RADIAN);
    const lineEndX = entry.cx + lineEndRadius * Math.cos(-entry.midAngle * RADIAN);
    const lineEndY = entry.cy + lineEndRadius * Math.sin(-entry.midAngle * RADIAN);

    // Only show label if percentage is significant enough
    if (entry.percentage < 3) return null;

    // Get the color for this entry
    const colorMap = chartType === 'bank' ? bankColors : platformColors;
    const entryColor = colorMap[entry.name as keyof typeof colorMap] || '#8884d8';

    return (
      <g>
        {/* Connection line with matching color */}
        <line 
          x1={lineStartX} 
          y1={lineStartY} 
          x2={lineEndX} 
          y2={lineEndY} 
          stroke={entryColor} 
          strokeWidth="2"
          opacity="0.8"
        />
        {/* Label text */}
        <text 
          x={x} 
          y={y-5} 
          fill="#1a202c" 
          textAnchor={x > entry.cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize="11"
          fontWeight="700"
        >
          {entry.name}
        </text>
        <text 
          x={x} 
          y={y+8} 
          fill="#4a5568" 
          textAnchor={x > entry.cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize="9"
          fontWeight="600"
        >
          {`${formatCurrencyBKM(entry.value)} (${entry.percentage.toFixed(1)}%)`}
        </text>
      </g>
    );
  };


  return (
    <div className="space-y-6">
      {/* Global Year Filter with Strong Background - Full Width */}
      <div className="w-full bg-slate-700 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard Filters</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Year:</label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32 bg-white text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Distribution Donut Chart - First */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Investment by Bank</CardTitle>
            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1 text-gray-700">Platform</label>
                <Select value={selectedPlatformForBankDonut} onValueChange={setSelectedPlatformForBankDonut}>
                  <SelectTrigger className="w-40 border-gray-300 bg-white shadow-sm text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDistributors.map(distributor => (
                      <SelectItem key={distributor} value={distributor} className="text-sm">
                        {distributor === "All" ? "All Platforms" : distributor.replace('.COM', '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bankDonutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => renderCustomizedLabel(entry, 'bank')}
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bankDonutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={bankColors[entry.name as keyof typeof bankColors] || '#8884d8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrencyBKM(value)}
                    labelFormatter={(label) => label}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution Donut Chart - Second */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Investment Breakdown</CardTitle>
            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1 text-gray-700">Bank</label>
                <Select value={selectedBankForPlatformDonut} onValueChange={setSelectedBankForPlatformDonut}>
                  <SelectTrigger className="w-48 border-gray-300 bg-white shadow-sm text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueBanks.map(bank => (
                      <SelectItem key={bank} value={bank} className="text-sm">{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDonutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => renderCustomizedLabel(entry, 'platform')}
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {platformDonutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={platformColors[entry.name as keyof typeof platformColors] || '#8884d8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrencyBKM(value)}
                    labelFormatter={(label) => label}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heat Map Table - Banks in Columns */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Matrix: Platform vs Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 font-medium">Platform</th>
                  {heatMapData.banks.map(bank => (
                    <th key={bank} className="text-center p-2 font-medium min-w-20 text-xs">
                      {bank}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatMapData.platforms.map(platform => (
                  <tr key={platform}>
                    <td className="p-2 font-medium flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: platformColors[platform.replace('.COM', '') as keyof typeof platformColors] || '#8884d8' }}
                      />
                      {platform.replace('.COM', '')}
                    </td>
                    {heatMapData.banks.map(bank => {
                      const value = heatMapData.data[platform][bank];
                      return (
                        <td 
                          key={bank} 
                          className="text-center p-2 text-xs"
                          style={{ 
                            backgroundColor: getHeatMapColor(value),
                            color: value > maxHeatValue * 0.7 ? 'white' : 'black'
                          }}
                        >
                          {value > 0 ? formatCurrencyBKM(value) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Wells Fargo Monthly Investment Comparison</CardTitle>
          <div className="flex gap-4 flex-wrap items-center bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1 text-gray-700">Comparison Bank</label>
              <Select value={selectedComparisonBank} onValueChange={setSelectedComparisonBank}>
                <SelectTrigger className="w-48 border-gray-300 bg-white shadow-sm text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniqueComparisonBanks.map(bank => (
                    <SelectItem key={bank} value={bank} className="text-sm">{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1 text-gray-700">Platform</label>
              <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
                <SelectTrigger className="w-40 border-gray-300 bg-white shadow-sm text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniqueDistributors.map(distributor => (
                    <SelectItem key={distributor} value={distributor} className="text-sm">
                      {distributor === "All" ? "All Platforms" : distributor.replace('.COM', '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={formatCurrencyBKM} 
                  domain={[(dataMin: number) => dataMin * 0.8, (dataMax: number) => dataMax * 1.1]}
                  scale="linear"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={selectedBankForPlatformDonut} 
                  stroke="#D71921" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#D71921', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedComparisonBank} 
                  stroke="#117ACA" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#117ACA', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Industry Average" 
                  stroke="#888888" 
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  activeDot={{ r: 4, fill: '#888888', stroke: '#fff', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
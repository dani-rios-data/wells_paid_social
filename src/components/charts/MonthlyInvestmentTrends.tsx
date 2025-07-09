import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { formatCurrencyBKM } from '@/services/dataService';

interface MonthlyInvestmentTrendsProps {
  data: SocialSpendData[];
  bank: string;
  year: number;
}

export const MonthlyInvestmentTrends: React.FC<MonthlyInvestmentTrendsProps> = ({ data, bank, year }) => {
  // Determine unique years in the dataset
  const uniqueYears = [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
  const currentYear = uniqueYears[uniqueYears.length - 1];
  const previousYear = uniqueYears[uniqueYears.length - 2];
  
  let bankData: any[] = [];
  let monthOrder: string[] = [];
  let yearRange = '';
  let mostRecentMonth = 'December';
  
  if (year === currentYear) {
    // For current year: December of previous year + current year data
    const prevYear = year - 1;
    bankData = data.filter(item => 
      item.bank === bank && 
      ((item.year === prevYear && item.month.startsWith('December')) || 
       (item.year === year))
    );
    
    // Get the most recent month available in the current year
    const currentYearMonths = bankData
      .filter(item => item.year === year)
      .map(item => item.month.split(' ')[0]);
    
    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    mostRecentMonth = currentYearMonths.reduce((latest, current) => {
      const latestIndex = allMonths.indexOf(latest);
      const currentIndex = allMonths.indexOf(current);
      return currentIndex > latestIndex ? current : latest;
    }, currentYearMonths[0] || 'January');

    // Define month order from December of previous year to most recent month of current year
    const mostRecentIndex = allMonths.indexOf(mostRecentMonth);
    monthOrder = ['December', ...allMonths.slice(0, mostRecentIndex + 1)];
    yearRange = `Dec ${prevYear} to ${mostRecentMonth} ${year}`;
  } else {
    // For previous year: January to December of that year only
    bankData = data.filter(item => 
      item.bank === bank && item.year === year
    );
    
    monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    yearRange = `Jan ${year} to Dec ${year}`;
    mostRecentMonth = 'December';
  }
  
  if (bankData.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Investment Trends</h3>
        <p className="text-sm text-gray-600">No data available for {bank} - {yearRange}</p>
      </div>
    );
  }

  // Group data by month and platform
  const monthlyData = bankData.reduce((acc, item) => {
    const month = item.month.split(' ')[0]; // Extract month name
    const platform = item.platform;
    
    if (!acc[month]) {
      acc[month] = {};
    }
    
    if (!acc[month][platform]) {
      acc[month][platform] = 0;
    }
    
    acc[month][platform] += item.spend;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Transform data for chart
  const chartData = monthOrder.map(month => {
    const monthData = monthlyData[month] || {};
    let displayMonth = '';
    
    if (year === currentYear) {
      // For current year: December shows previous year, others show current year
      displayMonth = month === 'December' ? `Dec'${String(year - 1).slice(-2)}` : `${month.slice(0, 3)}'${String(year).slice(-2)}`;
    } else {
      // For previous year: all months show the year being analyzed
      displayMonth = `${month.slice(0, 3)}'${String(year).slice(-2)}`;
    }
    
    return {
      month: displayMonth,
      'FACEBOOK.COM': monthData['FACEBOOK.COM'] || 0,
      'INSTAGRAM.COM': monthData['INSTAGRAM.COM'] || 0,
      'PINTEREST.COM': monthData['PINTEREST.COM'] || 0,
      'X.COM': monthData['X.COM'] || 0,
      'REDDIT': monthData['REDDIT'] || 0,
      'TIKTOK': monthData['TIKTOK'] || 0,
    };
  });

  // Platform colors mapping
  const platformColors = {
    'FACEBOOK.COM': '#1877F2',
    'INSTAGRAM.COM': '#E4405F',
    'PINTEREST.COM': '#BD081C',
    'X.COM': '#1DA1F2',
    'REDDIT': '#FF4500',
    'TIKTOK': '#000000',
  };

  // Calculate dynamic Y-axis domain based on actual data per distributor per month for this specific year
  const allValues: number[] = [];
  
  // Get all values from chartData for this specific bank and year combination (including zeros)
  chartData.forEach(monthData => {
    Object.entries(platformColors).forEach(([platform]) => {
      const value = monthData[platform] || 0;
      allValues.push(value);
    });
  });
  
  // Get min and max from actual data shown in this specific chart
  const nonZeroValues = allValues.filter(v => v > 0);
  const actualMin = 0; // Always start from 0 for spending data
  const actualMax = nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
  
  // Calculate appropriate tick interval and domain with tighter padding
  const calculateYAxisDomain = (min: number, max: number) => {
    if (max <= 0) return { domain: [0, 1000] };
    
    // Add minimal padding above max (5% instead of 10%)
    const paddingPercent = 0.05;
    const paddedMax = max * (1 + paddingPercent);
    
    return { domain: [0, paddedMax] };
  };
  
  const yAxisConfig = calculateYAxisDomain(actualMin, actualMax);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey.replace('.COM', '')}: ${formatCurrencyBKM(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Create legend table data
  const legendTableData = Object.entries(platformColors).map(([platform, color]) => {
    const monthlyValues = chartData.map(monthData => monthData[platform] || 0);
    const total = monthlyValues.reduce((sum, value) => sum + value, 0);
    return {
      platform,
      color,
      monthlyValues,
      total,
      displayName: platform.replace('.COM', '')
    };
  }).filter(item => item.total > 0); // Only show platforms with data

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Investment Trends</h3>
        <p className="text-sm text-gray-600">{bank} - Dec {previousYear} to {mostRecentMonth} {year}</p>
      </div>
      
      <div className="p-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 5,
            }}
            barCategoryGap="5%"
            maxBarSize={60}
          >
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => formatCurrencyBKM(value)}
              domain={yAxisConfig.domain}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="FACEBOOK.COM" 
              fill="#1877F2" 
              name="Facebook"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="INSTAGRAM.COM" 
              fill="#E4405F" 
              name="Instagram"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="PINTEREST.COM" 
              fill="#BD081C" 
              name="Pinterest"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="X.COM" 
              fill="#1DA1F2" 
              name="X"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="REDDIT" 
              fill="#FF4500" 
              name="Reddit"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="TIKTOK" 
              fill="#000000" 
              name="TikTok"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Legend Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1 text-left font-medium text-gray-500 w-24">Platform</th>
                {chartData.map((monthData, index) => (
                  <th key={index} className="border px-2 py-1 text-center font-medium text-gray-500 w-20">
                    {monthData.month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {legendTableData.map((item) => (
                <tr key={item.platform} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.displayName}</span>
                  </td>
                  {item.monthlyValues.map((value, index) => (
                    <td key={index} className="border px-2 py-1 text-center font-mono text-xs">
                      {value > 0 ? formatCurrencyBKM(value) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-gray-100 font-semibold">
                <td className="border px-2 py-1 text-left font-medium text-gray-900">
                  Total
                </td>
                {chartData.map((monthData, index) => {
                  const monthTotal = Object.entries(platformColors).reduce((sum, [platform]) => {
                    return sum + (monthData[platform] || 0);
                  }, 0);
                  return (
                    <td key={index} className="border px-2 py-1 text-center font-mono text-xs font-semibold">
                      {monthTotal > 0 ? formatCurrencyBKM(monthTotal) : '-'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
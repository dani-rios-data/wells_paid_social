import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { bankColors, formatCurrencyBKM } from '../../services/dataService';
import { YoYSpendTooltip, CustomTooltip } from './CustomTooltip';

interface YoYSpendComparisonProps {
  data: SocialSpendData[];
  yearA?: number;
  yearB?: number;
  isPartialComparison?: boolean;
}

export const YoYSpendComparison = ({ data, yearA = 2023, yearB = 2024, isPartialComparison = false }: YoYSpendComparisonProps) => {
  // Calculate YoY spend for each bank using the specified years
  const calculateYoYData = () => {
    let dataToCompare = data.filter(d => d.year === yearA || d.year === yearB);

    if (isPartialComparison) {
      // Get months available in the latest year (yearB)
      const monthsInYearB = [...new Set(data.filter(d => d.year === yearB).map(d => d.month.split(' ')[0]))];
      
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
      const yoyChange = yearASpend > 0 ? ((yearBSpend - yearASpend) / yearASpend) * 100 : 0;
      return {
        bank,
        [yearA]: yearASpend,
        [yearB]: yearBSpend,
        yoyChange: Math.round(yoyChange),
        yoyChangeDisplay: yoyChange > 0 ? `+${Math.round(yoyChange)}%` : `${Math.round(yoyChange)}%`
      };
    }).sort((a, b) => b.yoyChange - a.yoyChange);
  };

  const yoyData = calculateYoYData();

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch" data-testid="yoy-spend-comparison">
      {/* LEFT COLUMN - CHARTS */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* CHART 1: YoY Spend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col" data-testid="yoy-chart">
          <h3 className="text-xl font-semibold mb-6 text-foreground">
            YoY Social Spend by Banks ({yearA} vs {yearB})
          </h3>
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
                <Bar dataKey={yearA} fill="#a0aec0" name={yearA.toString()} radius={[6, 6, 0, 0]} />
                <Bar dataKey={yearB} fill="#4FD1C5" name={yearB.toString()} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: YoY Change % */}
        <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 flex flex-col" data-testid="yoy-change-chart">
           <h3 className="text-xl font-semibold mb-6 text-foreground">
            YoY Percentage Change by Banks
          </h3>
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
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={(val) => `${val}%`} valueKey="yoyChange" name="YoY Change" />}
                  cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }}
                />
                <Bar dataKey="yoyChange" name="YoY Change" radius={[6, 6, 0, 0]}>
                  {yoyData.map((entry, index) => {
                    const color = entry.yoyChange > 0 
                      ? '#22c55e' // green-500
                      : entry.yoyChange < 0 
                        ? '#ef4444' // red-500
                        : '#a0aec0'; // gray-400
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
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          YoY Change Analysis
        </h3>
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
                    row.yoyChange > 0 ? 'text-green-600' : row.yoyChange < 0 ? 'text-red-600' : 'text-gray-600'
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
  );
};
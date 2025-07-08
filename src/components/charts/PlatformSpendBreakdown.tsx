import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { SocialSpendData } from '../BankingSocialData';
import { platformColors } from '../../services/dataService';

interface PlatformSpendBreakdownProps {
  data: SocialSpendData[];
}

export const PlatformSpendBreakdown = ({ data }: PlatformSpendBreakdownProps) => {
  // Calculate platform spend by bank
  const calculatePlatformData = () => {
    const bankPlatformData = data.reduce((acc, curr) => {
      if (!acc[curr.bank]) {
        acc[curr.bank] = {};
      }
      if (!acc[curr.bank][curr.platform]) {
        acc[curr.bank][curr.platform] = 0;
      }
      acc[curr.bank][curr.platform] += curr.spend;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    return bankPlatformData;
  };

  const platformData = calculatePlatformData();
  const banks = Object.keys(platformData);
  
  // Focus on top spending banks
  const topBanks = ["Wells Fargo", "Capital One", "Chase", "Bank of America"];

  const formatCurrency = (value: number) => {
    const formatted = (value / 1000000).toFixed(1);
    return `$${formatted.replace(/\.?0+$/, '')}M`;
  };

  // Prepare data for Wells Fargo detailed breakdown
  const wellsFargoData = platformData["Wells Fargo"] ? 
    Object.entries(platformData["Wells Fargo"]).map(([platform, spend]) => ({
      platform,
      spend,
      percentage: 0 // Will calculate after we have total
    })) : [];

  const wellsFargoTotal = wellsFargoData.reduce((sum, item) => sum + item.spend, 0);
  wellsFargoData.forEach(item => {
    item.percentage = Math.round((item.spend / wellsFargoTotal) * 100);
  });

  return (
    <div className="space-y-8" data-testid="platform-spend-breakdown">
      {/* Wells Fargo Platform Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border" data-testid="platform-chart">
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Wells Fargo FY24 Social Spend - Platform Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={wellsFargoData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="spend"
                    label={({ platform, percentage }) => `${platform.replace('.COM', '')} ${percentage}%`}
                  >
                    {wellsFargoData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={platformColors[entry.platform as keyof typeof platformColors] || '#8884d8'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spend']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="space-y-4">
            <div className="bg-wells-fargo-light-gold p-4 rounded-lg">
              <h4 className="font-semibold text-wells-fargo-dark-red mb-2">Platform Prioritization:</h4>
              <p className="text-sm">
                <strong>Facebook ({wellsFargoData.find(p => p.platform === 'FACEBOOK.COM')?.percentage || 0}%)</strong> leads Wells Fargo's social strategy, followed by Instagram and emerging platforms.
              </p>
            </div>
            
            <div className="space-y-2">
              {wellsFargoData.sort((a, b) => b.spend - a.spend).map((platform) => (
                <div key={platform.platform} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{platform.platform.replace('.COM', '')}</span>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(platform.spend)}</div>
                    <div className="text-sm text-gray-600">{platform.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Banks Platform Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-semibold mb-6 text-foreground">
          Platform Spend Comparison Across Major Banks
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {topBanks.map(bank => {
            const bankData = platformData[bank];
            if (!bankData) return null;
            
            const bankPlatformArray = Object.entries(bankData).map(([platform, spend]) => ({
              platform: platform.replace('.COM', ''),
              spend
            })).sort((a, b) => b.spend - a.spend);

            return (
              <div key={bank} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-lg" style={{ color: bank === 'Wells Fargo' ? 'hsl(var(--wells-fargo-red))' : undefined }}>
                  {bank}
                </h4>
                <div className="space-y-2">
                  {bankPlatformArray.slice(0, 4).map((platform) => (
                    <div key={platform.platform} className="flex justify-between items-center">
                      <span className="text-sm">{platform.platform}</span>
                      <span className="text-sm font-medium">{formatCurrency(platform.spend)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="font-medium">Source: Nielsen Ad Intel</p>
      </div>
    </div>
  );
};
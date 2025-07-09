import { SocialSpendData } from '@/components/BankingSocialData';

export const loadCSVData = async (): Promise<SocialSpendData[]> => {
  try {
    const response = await fetch('/banking-social-data.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const data: SocialSpendData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        
        const bank = values[0];
        const year = parseInt(values[1]);
        const month = values[2];
        const platform = values[5]; // Distributor column
        const spend = parseInt(values[7]); // dollars column
        
        // Clean bank name - keep original names from CSV
        const cleanBankName = bank;
        
        data.push({
          bank: cleanBankName,
          year,
          month,
          platform,
          spend
        });
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    // Fallback to mock data if CSV loading fails
    return [];
  }
};

export const bankColors = {
  "WELLS FARGO": "#D71921", // rojo Wells Fargo (único rojo)
  "CHASE": "#117ACA", // azul Chase  
  "BANK OF AMERICA": "#012169", // azul corporativo
  "CAPITAL ONE": "#FF8C00", // naranja
  "US BANK": "#9932CC", // púrpura
  "CHIME": "#01AC66", // verde Chime
  "CASH APP": "#00D632", // verde Cash App
  "PNC BANK": "#254AA5", // azul PNC
  "TD BANK": "#00B04F", // verde TD
  "CITI": "#0066CC", // azul Citi
  "FIRST NATL BANK OF AMERICA": "#8B4513", // marrón
  "Bank": "#808080", // gris para header
};

export const platformColors = {
  "FACEBOOK.COM": "#1877F2",
  "INSTAGRAM.COM": "#E4405F",
  "TIKTOK": "#000000",
  "X.COM": "#1DA1F2",
  "PINTEREST.COM": "#BD081C",
  "REDDIT": "#FF4500",
  "SNAPCHAT": "#FFFC00",
};

export const getDateRange = (data: SocialSpendData[]): string => {
  if (data.length === 0) return "No data available";
  
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.year, getMonthNumber(a.month));
    const dateB = new Date(b.year, getMonthNumber(b.month));
    return dateA.getTime() - dateB.getTime();
  });
  
  const firstDate = sortedData[0];
  const lastDate = sortedData[sortedData.length - 1];
  
  const formatDate = (year: number, month: string) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNum = getMonthNumber(month);
    return `${monthNames[monthNum]} ${year}`;
  };
  
  return `${formatDate(firstDate.year, firstDate.month)} – ${formatDate(lastDate.year, lastDate.month)}`;
};

export const getUniqueBanks = (data: SocialSpendData[]): string[] => {
  const banks = [...new Set(data.map(item => item.bank))];
  return banks.sort();
};

const getMonthNumber = (month: string): number => {
  const monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  // Handle formats like "April 2023" or "April"
  const monthName = month.split(' ')[0];
  return monthMap[monthName] || 0;
};

export const formatCurrencyBKM = (value: number): string => {
  const formatDecimal = (num: number): string => {
    const formatted = num.toFixed(2);
    // Remove trailing zeros and decimal point if not needed
    return formatted.replace(/\.?0+$/, '');
  };

  if (Math.abs(value) >= 1000000000) {
    return `$${formatDecimal(value / 1000000000)}B`;
  }
  if (Math.abs(value) >= 1000000) {
    return `$${formatDecimal(value / 1000000)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${formatDecimal(value / 1000)}K`;
  }
  return `$${formatDecimal(value)}`;
};

// Bank insights data based on actual CSV analysis
const bankInsightsData = {
  "BANK OF AMERICA": {
    "insights_2024": [
      "Achieved exceptional 169% year-over-year growth in social media investment, increasing from $951,624 in 2023 to $2,563,809 in 2024",
      "Balanced platform approach with Pinterest at 43% ($3,199,173) and Facebook at 23% ($1,744,158) of total spend"
    ],
    "insights_2025": [
      "Peak 2024 performance in March 2024 with $476,029 spend, representing 19% of annual social media investment",
      "2025 shows accelerated momentum with $560,027 average monthly spend, 162% higher than 2024's $213,651 monthly average"
    ]
  },
  "CAPITAL ONE": {
    "insights_2024": [
      "Achieved exceptional 137% year-over-year growth in social media investment, increasing from $14,725,254 in 2023 to $34,898,553 in 2024",
      "Facebook leads platform investment with 56% share ($38,332,342), followed by Instagram at 23% ($15,785,876)"
    ],
    "insights_2025": [
      "Peak 2024 performance in September 2024 with $4,798,730 spend, representing 14% of annual social media investment",
      "2025 investment pace at $2,741,269 average monthly spend, 6% below 2024's $2,908,213 monthly average"
    ]
  },
  "CASH APP": {
    "insights_2024": [
      "Demonstrated strong 77% year-over-year growth in social media spending, reaching $196,317 in 2024",
      "TikTok leads platform investment with 66% share ($665,886), followed by Facebook at 18% ($182,894)"
    ],
    "insights_2025": [
      "Peak 2024 performance in September 2024 with $95,348 spend, representing 49% of annual social media investment",
      "2025 shows accelerated momentum with $177,286 average monthly spend, 352% higher than 2024's $39,263 monthly average"
    ]
  },
  "CHASE": {
    "insights_2024": [
      "Achieved exceptional 1457% year-over-year growth in social media investment, increasing from $6,714,234 in 2023 to $104,535,252 in 2024",
      "Heavily concentrated on Facebook with 73% of total investment ($94,420,871), indicating a focused platform strategy"
    ],
    "insights_2025": [
      "Peak 2024 performance in August 2024 with $29,718,682 spend, representing 28% of annual social media investment",
      "2025 investment pace at $2,638,929 average monthly spend, 70% below 2024's $8,711,271 monthly average"
    ]
  },
  "CHIME": {
    "insights_2024": [
      "Social media spending decreased by 8% from 2023 to 2024, totaling $7,150,511 in 2024",
      "Heavily concentrated on Facebook with 73% of total investment ($10,852,170), indicating a focused platform strategy"
    ],
    "insights_2025": [
      "Peak 2024 performance in March 2024 with $1,604,212 spend, representing 22% of annual social media investment",
      "2025 investment pace at $4,527 average monthly spend, 99% below 2024's $595,876 monthly average"
    ]
  },
  "CITI": {
    "insights_2024": [
      "Achieved exceptional 13345% year-over-year growth in social media investment, increasing from $7,534 in 2023 to $1,012,979 in 2024",
      "Pinterest leads platform investment with 56% share ($794,073), followed by Facebook at 21% ($293,687)"
    ],
    "insights_2025": [
      "Peak 2024 performance in April 2024 with $280,880 spend, representing 28% of annual social media investment",
      "2025 investment pace at $57,284 average monthly spend, 32% below 2024's $84,415 monthly average"
    ]
  },
  "PNC BANK": {
    "insights_2024": [
      "Achieved exceptional 3170% year-over-year growth in social media investment, increasing from $62,621 in 2023 to $2,047,755 in 2024",
      "Facebook leads platform investment with 51% share ($1,873,541), followed by Instagram at 27% ($989,527)"
    ],
    "insights_2025": [
      "Peak 2024 performance in October 2024 with $452,365 spend, representing 22% of annual social media investment",
      "2025 shows accelerated momentum with $219,319 average monthly spend, 29% higher than 2024's $170,646 monthly average"
    ]
  },
  "TD BANK": {
    "insights_2024": [
      "Demonstrated strong 52% year-over-year growth in social media spending, reaching $13,258,957 in 2024",
      "Facebook leads platform investment with 64% share ($18,148,605), followed by Instagram at 36% ($10,375,096)"
    ],
    "insights_2025": [
      "Peak 2024 performance in August 2024 with $1,783,713 spend, representing 13% of annual social media investment",
      "2025 investment pace at $940,443 average monthly spend, 15% below 2024's $1,104,913 monthly average"
    ]
  },
  "US BANK": {
    "insights_2024": [
      "Achieved exceptional 118% year-over-year growth in social media investment, increasing from $14,709,483 in 2023 to $32,059,966 in 2024",
      "Facebook leads platform investment with 62% share ($33,901,675), followed by Instagram at 27% ($14,751,472)"
    ],
    "insights_2025": [
      "Peak 2024 performance in June 2024 with $4,710,797 spend, representing 15% of annual social media investment",
      "2025 investment pace at $1,128,080 average monthly spend, 58% below 2024's $2,671,664 monthly average"
    ]
  },
  "WELLS FARGO": {
    "insights_2024": [
      "Achieved exceptional 138% year-over-year growth in social media investment, increasing from $4,134,716 in 2023 to $9,856,151 in 2024",
      "Facebook leads platform investment with 50% share ($10,220,372), followed by Instagram at 40% ($8,259,275)"
    ],
    "insights_2025": [
      "Peak 2024 performance in July 2024 with $1,557,886 spend, representing 16% of annual social media investment",
      "2025 shows accelerated momentum with $915,648 average monthly spend, 11% higher than 2024's $821,346 monthly average"
    ]
  }
};

export const getBankInsights = (bank: string, year: number): string[] => {
  const bankData = bankInsightsData[bank as keyof typeof bankInsightsData];
  if (!bankData) {
    return [
      `Analysis for ${bank} in ${year}`,
      "Platform performance insights",
      "Investment trend analysis",
      "Strategic recommendations"
    ];
  }
  
  if (year === 2025) {
    return bankData.insights_2025;
  } else {
    return bankData.insights_2024;
  }
};

// New function to get all unique years from the dataset
export const getUniqueYears = (data: SocialSpendData[]): number[] => {
  const years = [...new Set(data.map(item => item.year))];
  return years.sort((a, b) => a - b);
};

// New function to generate consecutive year pairs for YoY comparisons
export const getYearPairs = (data: SocialSpendData[]): Array<{ yearA: number; yearB: number }> => {
  const years = getUniqueYears(data);
  const pairs: Array<{ yearA: number; yearB: number }> = [];
  
  for (let i = 0; i < years.length - 1; i++) {
    pairs.push({
      yearA: years[i],
      yearB: years[i + 1]
    });
  }
  
  // Reverse to show most recent years first
  return pairs.reverse();
};

// New function to get data filtered by specific years
export const getDataByYears = (data: SocialSpendData[], years: number[]): SocialSpendData[] => {
  return data.filter(item => years.includes(item.year));
};

// Nueva función para generar insights automáticos para comparativas YoY
export const generateYoYInsights = (data: SocialSpendData[], yearA: number, yearB: number, isPartial: boolean = false): string[] => {
  let dataToCompare = data.filter(item => item.year === yearA || item.year === yearB);

  if (isPartial) {
    // Get months available in the latest year (yearB)
    const monthsInYearB = [...new Set(data.filter(d => d.year === yearB).map(d => d.month.split(' ')[0]))];
    
    // Filter data for both years to only include these months
    dataToCompare = dataToCompare.filter(d => 
      monthsInYearB.includes(d.month.split(' ')[0])
    );
  }

  // Calculate totals by bank for both years
  const bankTotals = dataToCompare.reduce((acc, curr) => {
    if (!acc[curr.bank]) {
      acc[curr.bank] = { [yearA]: 0, [yearB]: 0 };
    }
    if (curr.year === yearA || curr.year === yearB) {
      acc[curr.bank][curr.year] = (acc[curr.bank][curr.year] || 0) + curr.spend;
    }
    return acc;
  }, {} as Record<string, { [key: number]: number }>);

  const yoyAnalysis = Object.entries(bankTotals).map(([bank, totals]) => {
    const yearASpend = totals[yearA] || 0;
    const yearBSpend = totals[yearB] || 0;
    const yoyChange = yearASpend > 0 ? ((yearBSpend - yearASpend) / yearASpend) * 100 : 0;
    return {
      bank,
      yearASpend,
      yearBSpend,
      yoyChange,
      absoluteChange: yearBSpend - yearASpend
    };
  });

  // Sort by different metrics to generate insights
  const sortedByGrowth = [...yoyAnalysis].sort((a, b) => b.yoyChange - a.yoyChange);
  const sortedByYearBSpend = [...yoyAnalysis].sort((a, b) => b.yearBSpend - a.yearBSpend);
  const sortedByAbsoluteChange = [...yoyAnalysis].sort((a, b) => b.absoluteChange - a.absoluteChange);

  const insights: string[] = [];

  // Insight 1: Highest percentage growth
  if (sortedByGrowth.length > 0 && sortedByGrowth[0].yoyChange > 0) {
    const topGrowth = sortedByGrowth[0];
    insights.push(
      `${topGrowth.bank} registered the highest YoY growth of ${topGrowth.yoyChange.toFixed(0)}%, ` +
      `increasing from ${formatCurrencyBKM(topGrowth.yearASpend)} in ${yearA} to ` +
      `${formatCurrencyBKM(topGrowth.yearBSpend)} in ${yearB}.`
    );
  }

  // Insight 2: Highest total investment
  if (sortedByYearBSpend.length > 0) {
    const topSpender = sortedByYearBSpend[0];
    insights.push(
      `${topSpender.bank} led total investment in ${yearB} with ${formatCurrencyBKM(topSpender.yearBSpend)}, ` +
      `a ${topSpender.yoyChange > 0 ? '+' : ''}${topSpender.yoyChange.toFixed(0)}% change ` +
      `from ${yearA}.`
    );
  }

  // Insight 3: Largest absolute increase
  if (sortedByAbsoluteChange.length > 0 && sortedByAbsoluteChange[0].absoluteChange > 0) {
    const topAbsolute = sortedByAbsoluteChange[0];
    insights.push(
      `${topAbsolute.bank} had the largest absolute increase, investing an additional ${formatCurrencyBKM(topAbsolute.absoluteChange)} ` +
      `in ${yearB} compared to ${yearA}.`
    );
  }

  // Insight 4: Analysis of banks with declining investment (if any)
  const declining = yoyAnalysis.filter(bank => bank.yoyChange < 0);
  if (declining.length > 0) {
    const mostDeclining = declining.sort((a, b) => a.yoyChange - b.yoyChange)[0];
    insights.push(
      `${mostDeclining.bank} reduced its investment by ${Math.abs(mostDeclining.yoyChange).toFixed(0)}%, ` +
      `from ${formatCurrencyBKM(mostDeclining.yearASpend)} in ${yearA} to ` +
      `${formatCurrencyBKM(mostDeclining.yearBSpend)} in ${yearB}.`
    );
  } else {
    // If all grew, mention overall growth
    const totalYearA = yoyAnalysis.reduce((sum, bank) => sum + bank.yearASpend, 0);
    const totalYearB = yoyAnalysis.reduce((sum, bank) => sum + bank.yearBSpend, 0);
    const overallGrowth = totalYearA > 0 ? ((totalYearB - totalYearA) / totalYearA) * 100 : 0;
    
    if (overallGrowth > 0) {
      insights.push(
        `All analyzed institutions increased their social media investment, with an overall sector growth of ${overallGrowth.toFixed(0)}% from ${yearA} to ${yearB}.`
      );
    }
  }

  return insights;
};

export const generateTimelineInsights = (data: SocialSpendData[]): string[] => {
  if (data.length === 0) return ["No data available to generate insights."];

  const dateRange = getDateRange(data);

  // 1. Total Investment
  const totalInvestment = data.reduce((sum, item) => sum + item.spend, 0);
  
  // 2. Top Spender
  const spendByBank = data.reduce((acc, curr) => {
    if (!acc[curr.bank]) acc[curr.bank] = 0;
    acc[curr.bank] += curr.spend;
    return acc;
  }, {} as Record<string, number>);

  const topSpender = Object.entries(spendByBank).sort((a, b) => b[1] - a[1])[0];
  const topSpenderName = topSpender[0];
  const topSpenderAmount = topSpender[1];

  // 3. Highest Single-Month Spend
  const highestSingleEntry = data.sort((a,b) => b.spend - a.spend)[0];
  const highestMonthName = highestSingleEntry.month;
  const highestMonthBank = highestSingleEntry.bank;
  const highestMonthAmount = highestSingleEntry.spend;


  // 4. Platform Diversification (Example for a specific bank, e.g., Bank of America)
  const targetBank = "Bank of America";
  const targetBankData = data.filter(d => d.bank === targetBank);
  const uniqueYears = [...new Set(targetBankData.map(d => d.year))].sort();
  let diversificationInsight = "";
  if (uniqueYears.length > 1) {
    const lastYear = uniqueYears[uniqueYears.length - 1];
    const prevYear = uniqueYears[uniqueYears.length - 2];
    const lastYearPlatforms = new Set(targetBankData.filter(d => d.year === lastYear).map(p => p.platform));
    const prevYearPlatforms = new Set(targetBankData.filter(d => d.year === prevYear).map(p => p.platform));
    const newPlatforms = [...lastYearPlatforms].filter(p => !prevYearPlatforms.has(p));
    if (newPlatforms.length > 0) {
      diversificationInsight = `${targetBank} expanded its platform strategy in ${lastYear}, adding ${newPlatforms.join(', ')}.`;
    }
  }


  return [
    `Investment in social media advertising across all banks totaled ${formatCurrencyBKM(totalInvestment)} during the ${dateRange} period.`,
    `${topSpenderName} had the highest total social investment with ${formatCurrencyBKM(topSpenderAmount)}.`,
    `The highest single-month spend was recorded by ${highestMonthBank} in ${highestMonthName}, with an investment of ${formatCurrencyBKM(highestMonthAmount)}.`,
    diversificationInsight
  ].filter(Boolean); // Filter out empty strings
};

export const getLatestDateInfo = (data: SocialSpendData[]): { year: number; month: string } | null => {
  if (data.length === 0) return null;
  
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.year, getMonthNumber(a.month));
    const dateB = new Date(b.year, getMonthNumber(b.month));
    return dateB.getTime() - dateA.getTime(); // Sort descending
  });
  
  const latestEntry = sortedData[0];
  const monthName = latestEntry.month.split(' ')[0];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    year: latestEntry.year,
    month: monthNames[getMonthNumber(monthName)] // Return full month name
  };
};

export const generatePlatformInsights = (data: SocialSpendData[], targetBank: string): string[] => {
  const bankData = data.filter(d => d.bank === targetBank);
  if (bankData.length === 0) return [`No data available for ${targetBank}.`];

  const totalBankSpend = bankData.reduce((sum, item) => sum + item.spend, 0);
  
  const spendByPlatform = bankData.reduce((acc, curr) => {
    if (!acc[curr.platform]) acc[curr.platform] = 0;
    acc[curr.platform] += curr.spend;
    return acc;
  }, {} as Record<string, number>);

  const sortedPlatforms = Object.entries(spendByPlatform).sort((a, b) => b[1] - a[1]);

  const insights = sortedPlatforms.map(platform => {
    const [platformName, spend] = platform;
    const percentage = (spend / totalBankSpend) * 100;
    return `${platformName} captured ${percentage.toFixed(0)}% of ${targetBank}'s total social investment, with ${formatCurrencyBKM(spend)} allocated.`;
  });

  return insights.slice(0, 4); // Return top 4 platform insights
};

export interface WaveTableData {
  banks: string[];
  months: string[]; // Ejemplo: ['December', 'January', 'February']
  yearA: number;
  yearB: number;
  dataA: Record<string, Record<string, number>>; // bank -> month -> value
  dataB: Record<string, Record<string, number>>;
}

export function getWaveTableData(data: SocialSpendData[]): WaveTableData | null {
  if (!data.length) return null;
  // Detect the latest available year
  const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
  const yearB = years[years.length - 1];
  const yearA = yearB - 1;
  const yearA_prev = yearA - 1;

  // Detect available months in the latest year (sorted by month)
  const monthsInYearB = [...new Set(data.filter(d => d.year === yearB).map(d => d.month.split(' ')[0]))];
  const monthOrder = ['December','January','February','March','April','May','June','July','August','September','October','November'];
  const monthsSorted = ['December', ...monthsInYearB.filter(m => m !== 'December').sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))];

  // Detectar todos los bancos
  const banksSet = [...new Set(data.map(d => d.bank))];

  // Inicializar estructuras
  const dataA: Record<string, Record<string, number>> = {};
  const dataB: Record<string, Record<string, number>> = {};
  banksSet.forEach(bank => {
    dataA[bank] = {};
    dataB[bank] = {};
    monthsSorted.forEach(month => {
      dataA[bank][month] = 0;
      dataB[bank][month] = 0;
    });
  });

  // Fill amounts for yearA (December of yearA-1 and months of yearA that are in the latest year)
  monthsSorted.forEach(month => {
    if (month === 'December') {
      banksSet.forEach(bank => {
        const sum = data.filter(d => d.bank === bank && d.year === yearA_prev && d.month.startsWith('December')).reduce((acc, d) => acc + d.spend, 0);
        dataA[bank][month] = sum;
      });
    } else {
      banksSet.forEach(bank => {
        const sum = data.filter(d => d.bank === bank && d.year === yearA && d.month.startsWith(month)).reduce((acc, d) => acc + d.spend, 0);
        dataA[bank][month] = sum;
      });
    }
  });

  // Fill amounts for yearB (December of yearA and months of yearB)
  monthsSorted.forEach(month => {
    if (month === 'December') {
      banksSet.forEach(bank => {
        const sum = data.filter(d => d.bank === bank && d.year === yearA && d.month.startsWith('December')).reduce((acc, d) => acc + d.spend, 0);
        dataB[bank][month] = sum;
      });
    } else {
      banksSet.forEach(bank => {
        const sum = data.filter(d => d.bank === bank && d.year === yearB && d.month.startsWith(month)).reduce((acc, d) => acc + d.spend, 0);
        dataB[bank][month] = sum;
      });
    }
  });

  // Calculate totals for each bank in both periods
  const bankTotals = banksSet.map(bank => {
    const totalA = monthsSorted.reduce((sum, month) => sum + dataA[bank][month], 0);
    const totalB = monthsSorted.reduce((sum, month) => sum + dataB[bank][month], 0);
    return { bank, totalA, totalB };
  });

  // Sort banks by total spending in yearB (Wave 2) descending - this will be the default order
  const banks = bankTotals.sort((a, b) => b.totalB - a.totalB).map(item => item.bank);

  return {
    banks,
    months: monthsSorted,
    yearA,
    yearB,
    dataA,
    dataB
  };
}
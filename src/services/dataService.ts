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
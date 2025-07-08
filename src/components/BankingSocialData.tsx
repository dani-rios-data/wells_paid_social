// Mock data structure based on the dataset sample provided
export interface SocialSpendData {
  bank: string;
  year: number;
  month: string;
  platform: string;
  spend: number;
}

// Sample data representing the banking social spend dataset
export const mockBankingSocialData: SocialSpendData[] = [
  // Wells Fargo - 2023
  { bank: "Wells Fargo", year: 2023, month: "January 2023", platform: "FACEBOOK.COM", spend: 850000 },
  { bank: "Wells Fargo", year: 2023, month: "January 2023", platform: "INSTAGRAM.COM", spend: 425000 },
  { bank: "Wells Fargo", year: 2023, month: "January 2023", platform: "TIKTOK", spend: 180000 },
  { bank: "Wells Fargo", year: 2023, month: "February 2023", platform: "FACEBOOK.COM", spend: 920000 },
  { bank: "Wells Fargo", year: 2023, month: "February 2023", platform: "INSTAGRAM.COM", spend: 380000 },
  { bank: "Wells Fargo", year: 2023, month: "March 2023", platform: "FACEBOOK.COM", spend: 1100000 },
  { bank: "Wells Fargo", year: 2023, month: "March 2023", platform: "INSTAGRAM.COM", spend: 450000 },
  { bank: "Wells Fargo", year: 2023, month: "April 2023", platform: "FACEBOOK.COM", spend: 950000 },
  { bank: "Wells Fargo", year: 2023, month: "May 2023", platform: "FACEBOOK.COM", spend: 800000 },
  { bank: "Wells Fargo", year: 2023, month: "June 2023", platform: "FACEBOOK.COM", spend: 750000 },
  
  // Wells Fargo - 2024
  { bank: "Wells Fargo", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 1200000 },
  { bank: "Wells Fargo", year: 2024, month: "January 2024", platform: "INSTAGRAM.COM", spend: 650000 },
  { bank: "Wells Fargo", year: 2024, month: "January 2024", platform: "TIKTOK", spend: 320000 },
  { bank: "Wells Fargo", year: 2024, month: "February 2024", platform: "FACEBOOK.COM", spend: 1150000 },
  { bank: "Wells Fargo", year: 2024, month: "March 2024", platform: "FACEBOOK.COM", spend: 1300000 },
  { bank: "Wells Fargo", year: 2024, month: "April 2024", platform: "FACEBOOK.COM", spend: 1100000 },
  
  // Chase
  { bank: "Chase", year: 2023, month: "January 2023", platform: "FACEBOOK.COM", spend: 1200000 },
  { bank: "Chase", year: 2023, month: "January 2023", platform: "INSTAGRAM.COM", spend: 800000 },
  { bank: "Chase", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 1500000 },
  { bank: "Chase", year: 2024, month: "January 2024", platform: "INSTAGRAM.COM", spend: 950000 },
  
  // Bank of America (from provided dataset sample)
  { bank: "Bank of America", year: 2023, month: "April 2023", platform: "X.COM", spend: 46042 },
  { bank: "Bank of America", year: 2023, month: "December 2023", platform: "FACEBOOK.COM", spend: 61218 },
  { bank: "Bank of America", year: 2023, month: "December 2023", platform: "INSTAGRAM.COM", spend: 67652 },
  { bank: "Bank of America", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 117689 },
  { bank: "Bank of America", year: 2024, month: "January 2024", platform: "INSTAGRAM.COM", spend: 38823 },
  { bank: "Bank of America", year: 2024, month: "May 2024", platform: "FACEBOOK.COM", spend: 159223 },
  
  // Capital One (from provided dataset sample)
  { bank: "Capital One", year: 2023, month: "April 2023", platform: "FACEBOOK.COM", spend: 621062 },
  { bank: "Capital One", year: 2023, month: "April 2023", platform: "INSTAGRAM.COM", spend: 149957 },
  { bank: "Capital One", year: 2023, month: "December 2023", platform: "FACEBOOK.COM", spend: 2168227 },
  { bank: "Capital One", year: 2023, month: "December 2023", platform: "INSTAGRAM.COM", spend: 725676 },
  { bank: "Capital One", year: 2024, month: "April 2024", platform: "FACEBOOK.COM", spend: 1081376 },
  { bank: "Capital One", year: 2024, month: "April 2024", platform: "INSTAGRAM.COM", spend: 718188 },
  
  // US Bank
  { bank: "US Bank", year: 2023, month: "January 2023", platform: "FACEBOOK.COM", spend: 450000 },
  { bank: "US Bank", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 520000 },
  
  // Chime
  { bank: "Chime", year: 2023, month: "January 2023", platform: "FACEBOOK.COM", spend: 380000 },
  { bank: "Chime", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 580000 },
  
  // Cash App
  { bank: "Cash App", year: 2023, month: "January 2023", platform: "TIKTOK", spend: 420000 },
  { bank: "Cash App", year: 2024, month: "January 2024", platform: "TIKTOK", spend: 650000 },
  
  // SoFi
  { bank: "SoFi", year: 2023, month: "January 2023", platform: "FACEBOOK.COM", spend: 280000 },
  { bank: "SoFi", year: 2024, month: "January 2024", platform: "FACEBOOK.COM", spend: 420000 },
];

export const bankColors = {
  "Wells Fargo": "hsl(var(--wells-fargo-red))",
  "Chase": "hsl(var(--chart-blue))",
  "Bank of America": "hsl(var(--chart-green))",
  "Capital One": "hsl(var(--chart-orange))",
  "US Bank": "hsl(var(--chart-purple))",
  "Chime": "hsl(var(--chart-teal))",
  "Cash App": "hsl(var(--chart-pink))",
  "SoFi": "hsl(var(--chart-navy))",
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
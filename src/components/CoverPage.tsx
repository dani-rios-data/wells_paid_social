import { ChevronRight, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialSpendData } from "./BankingSocialData";
import { getDateRange, getUniqueBanks, bankColors } from "@/services/dataService";

interface CoverPageProps {
  onStartPresentation: () => void;
  data: SocialSpendData[];
}

export const CoverPage = ({ onStartPresentation, data }: CoverPageProps) => {
  const dateRange = getDateRange(data);
  const banks = getUniqueBanks(data);
  
  const getBankColor = (bank: string): string => {
    const colorMap: { [key: string]: string } = {
      "WELLS FARGO": "hsl(var(--wells-fargo-red))",
      "CHASE": "hsl(var(--chart-blue))",
      "BANK OF AMERICA": "hsl(var(--chart-green))",
      "CAPITAL ONE": "hsl(var(--chart-orange))",
      "US BANK": "hsl(var(--chart-purple))",
      "CHIME": "hsl(var(--chart-teal))",
      "CASH APP": "hsl(var(--chart-pink))",
      "PNC BANK": "hsl(var(--chart-navy))",
      "TD BANK": "hsl(var(--chart-gray))",
      "CITI": "hsl(var(--chart-blue))",
      "FIRST NATL BANK OF AMERICA": "hsl(215 85% 35%)",
    };
    return colorMap[bank] || "hsl(var(--wells-fargo-gold))";
  };
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header fijo */}
      <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4" style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, height: '64px' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-wells-fargo-red rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">WF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-wells-fargo-red">Wells Fargo</h1>
            <p className="text-xs text-gray-500">Banking Paid Social Investment Analysis</p>
          </div>
        </div>
        <div className="text-gray-500 text-xs text-right">
          <p>Confidential & Proprietary</p>
          <p>Internal Use Only</p>
        </div>
      </header>
      {/* Portada centrada debajo del header */}
      <main className="flex flex-col items-center justify-center w-full min-h-screen" style={{ background: 'linear-gradient(135deg, #b71c1c 0%, #7f0000 100%)', paddingTop: '64px' }}>
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto flex-1 py-16">
          <h1 className="text-6xl lg:text-7xl font-extrabold text-wells-fargo-gold mb-4 text-center drop-shadow-lg">Wells Fargo</h1>
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-8 text-center">Paid Social Investment Analysis</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full mb-8">
            <p className="text-white/90 text-lg text-center"><strong className="text-wells-fargo-gold">Date Range:</strong> {dateRange}</p>
            <p className="text-white/90 text-lg text-center"><strong className="text-wells-fargo-gold">Source:</strong> Nielsen Ad Intel</p>
          </div>
          <Button 
            onClick={onStartPresentation}
            size="lg"
            className="bg-wells-fargo-gold text-wells-fargo-red hover:bg-wells-fargo-light-gold font-semibold text-lg px-8 py-4 mt-8"
          >
            Start Analysis
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};
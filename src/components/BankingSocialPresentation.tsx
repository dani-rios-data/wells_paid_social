import { useState, useEffect } from "react";
import { CoverPage } from "./CoverPage";
import { PresentationHeader } from "./PresentationHeader";
import { SlideContainer } from "./SlideContainer";
import { SocialSpendTimeline } from "./charts/SocialSpendTimeline";
import { YoYSpendComparison } from "./charts/YoYSpendComparison";
import { PlatformSpendBreakdown } from "./charts/PlatformSpendBreakdown";
import { InsightsPanel } from "./InsightsPanel";
import { useToast } from "@/hooks/use-toast";
import { 
  loadCSVData, 
  getDateRange, 
  getYearPairs, 
  generateYoYInsights,
  generateTimelineInsights,
  generatePlatformInsights,
  getUniqueYears,
  getLatestDateInfo,
  getWaveTableData,
  getUniqueBanks,
  getBankInsights
} from "@/services/dataService";
import { SocialSpendData } from "./BankingSocialData";
import { generatePowerPointPresentation } from "@/services/pptxService";
import { YoYWaveTable } from "./charts/YoYWaveTable";
import { BankInvestmentSummary } from "./BankInvestmentSummary";
import { MonthlyInvestmentTrends } from "./charts/MonthlyInvestmentTrends";

const createSlides = (data: SocialSpendData[]) => {
  if (data.length === 0) {
    return [{ title: "Loading...", subtitle: "Please wait", content: () => <div></div> }];
  }

  const dateRange = getDateRange(data);
  const yearPairs = getYearPairs(data);
  const uniqueYears = getUniqueYears(data);
  const latestYear = uniqueYears[uniqueYears.length - 1];
  const latestDateInfo = getLatestDateInfo(data);
  
  const waveTableData = getWaveTableData(data);
  
  const slides = [
    // Slide 1: Timeline (now with dynamic insights)
    {
      title: "Total Social Spend Follows Category Trend of Higher Spend",
      subtitle: dateRange,
      content: () => (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <SocialSpendTimeline data={data} />
        </div>
        <div>
          <InsightsPanel 
            title="Key Investment Patterns"
            insights={generateTimelineInsights(data)}
          />
        </div>
      </div>
    )
  }];

  // New slide: WAVE Table
  if (waveTableData) {
    slides.push({
      title: `WAVE Social Spend Table (${waveTableData.yearA + 1})`,
      subtitle: `Comparison: December ${waveTableData.yearA} + available months ${waveTableData.yearB}`,
      content: () => <YoYWaveTable waveData={waveTableData} />
    });
  }

  // Generate YoY slides dynamically for each consecutive year pair
  yearPairs.forEach(pair => {
    const isPartial = pair.yearB === latestYear;
    let subtitle = `${pair.yearA} vs ${pair.yearB} Comparison`;

    if (isPartial && latestDateInfo) {
      subtitle = `${pair.yearA} vs ${pair.yearB} (Year-to-Date as of ${latestDateInfo.month})`;
    }

    slides.push({
      title: `YoY Social Spend by Banks`,
      subtitle: subtitle,
      content: () => (
        <div className="space-y-8">
          <YoYSpendComparison 
            data={data} 
            yearA={pair.yearA} 
            yearB={pair.yearB} 
            isPartialComparison={isPartial}
          />
          <InsightsPanel 
            title={`Year-over-Year Analysis ${pair.yearA} vs ${pair.yearB}`}
            insights={generateYoYInsights(data, pair.yearA, pair.yearB, isPartial)}
          />
        </div>
      )
    });
  });

  // Individual bank analysis slides
  const allBanks = getUniqueBanks(data);
  const currentYear = uniqueYears[uniqueYears.length - 1];
  const previousYear = uniqueYears[uniqueYears.length - 2];

  // Calculate total spend by bank for current year
  const bankTotals = allBanks.map(bank => {
    const bankCurrentYearData = data.filter(item => item.bank === bank && item.year === currentYear);
    const total = bankCurrentYearData.reduce((sum, item) => sum + item.spend, 0);
    return { bank, total };
  });

  // Sort banks: Wells Fargo first, then by current year total spend (descending)
  const sortedBanks = bankTotals.sort((a, b) => {
    if (a.bank === "WELLS FARGO") return -1;
    if (b.bank === "WELLS FARGO") return 1;
    return b.total - a.total;
  }).map(item => item.bank);

  sortedBanks.forEach(bank => {
    // Skip "Bank" header if it exists
    if (bank === "Bank") return;
    
    // Slide 1: Bank Title Slide
    slides.push({
      title: "",
      subtitle: "Social Media Investment Analysis",
      content: () => (
        <div className="flex items-center justify-center" style={{ height: '50vh', overflow: 'hidden' }}>
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold text-wells-fargo-red">{bank}</div>
            <div className="text-2xl text-gray-600">Social Media Investment Analysis</div>
            <div className="text-lg text-gray-500">{dateRange}</div>
          </div>
        </div>
      )
    });

    // Slide 2: Current Year Analysis (más reciente primero)
    slides.push({
      title: `${bank} - ${currentYear} Analysis`,
      subtitle: `Social Media Investment Performance`,
      content: () => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          <div className="xl:col-span-2">
            <div className="space-y-4">
              {/* Summary table with actual data */}
              <BankInvestmentSummary 
                data={data} 
                bank={bank} 
                year={currentYear} 
              />
              
              {/* Monthly Investment Trends Chart */}
              <MonthlyInvestmentTrends 
                data={data} 
                bank={bank} 
                year={currentYear} 
              />
            </div>
          </div>
          <div>
            <InsightsPanel 
              title={`${bank} Insights - ${currentYear}`}
              insights={getBankInsights(bank, currentYear)}
            />
          </div>
        </div>
      )
    });

    // Slide 3: Previous Year Analysis (año anterior segundo)
    if (previousYear) {
      slides.push({
        title: `${bank} - ${previousYear} Analysis`,
        subtitle: `Social Media Investment Performance`,
        content: () => (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
            <div className="xl:col-span-2">
              <div className="space-y-4">
                {/* Summary table with actual data */}
                <BankInvestmentSummary 
                  data={data} 
                  bank={bank} 
                  year={previousYear} 
                />
                
                {/* Monthly Investment Trends Chart */}
                <MonthlyInvestmentTrends 
                  data={data} 
                  bank={bank} 
                  year={previousYear} 
                />
              </div>
            </div>
            <div>
              <InsightsPanel 
                title={`${bank} Insights - ${previousYear}`}
                insights={getBankInsights(bank, previousYear)}
              />
            </div>
          </div>
        )
      });
    }
  });

  // Final slide: Platform Investment Distribution (now with dynamic insights)
  slides.push({
    title: "Platform Investment Distribution",
    subtitle: "Channel Strategy Analysis for Wells Fargo",
    content: () => (
      <div className="space-y-8">
        <PlatformSpendBreakdown data={data} />
        <InsightsPanel 
          title="Platform Strategy Insights"
          insights={generatePlatformInsights(data, "Wells Fargo")}
        />
      </div>
    )
  });

  return slides;
};

export const BankingSocialPresentation = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const [data, setData] = useState<SocialSpendData[]>([]);
  const [loading, setLoading] = useState(true);

  // Create slides with dynamic date range
  const slides = createSlides(data);
  
  // Check if current slide is a bank title slide
  const isBankTitleSlide = (slideIndex: number) => {
    const slide = slides[slideIndex];
    return slide && slide.subtitle === "Social Media Investment Analysis" && 
           slide.title !== "Platform Investment Distribution" &&
           !slide.title.includes("YoY") && 
           !slide.title.includes("Analysis") &&
           !slide.title.includes("Social Spend");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only allow navigation if we're not on the cover page
      if (showCover) return;
      
      if (event.key === 'ArrowRight') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (event.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slides.length, showCover]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await loadCSVData();
        setData(csvData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load CSV data. Using fallback data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleStartPresentation = () => {
    setShowCover(false);
  };

  const handleDownload = async () => {
    try {
      toast({
        title: "Download Started",
        description: "Your PowerPoint presentation is being generated...",
      });
      
      await generatePowerPointPresentation(data, slides);
      
      toast({
        title: "Download Complete",
        description: "Your PowerPoint presentation has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your presentation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Presentation link has been copied to your clipboard.",
    });
  };

  if (showCover) {
    return <CoverPage onStartPresentation={handleStartPresentation} data={data} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-wells-fargo-red rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-wells-fargo-gold font-bold text-xl">WF</span>
          </div>
          <p className="text-lg">Loading presentation data...</p>
        </div>
      </div>
    );
  }

  // Apply different scaling for bank title slides
  const currentSlideScale = isBankTitleSlide(currentSlide) ? 1.0 : 0.8;
  const currentSlideWidth = isBankTitleSlide(currentSlide) ? '100%' : '125%';
  const currentSlideHeight = isBankTitleSlide(currentSlide) ? '100%' : '125%';

  return (
    <div style={{ 
      transform: `scale(${currentSlideScale})`, 
      transformOrigin: 'top left', 
      width: currentSlideWidth, 
      height: currentSlideHeight,
      overflow: 'auto'
    }}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PresentationHeader 
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onDownload={handleDownload}
          onShare={handleShare}
        />
        
        <SlideContainer 
          title={slides[currentSlide].title}
          subtitle={slides[currentSlide].subtitle}
        >
          {slides[currentSlide].content()}
        </SlideContainer>

        {/* Footer */}
        <div className="bg-wells-fargo-red text-white py-4 text-center">
          <p className="text-sm">© 2025 Wells Fargo. Analysis based on Nielsen Ad Intel data.</p>
          <p className="text-xs text-white/80 mt-1">Confidential and proprietary information for internal use only.</p>
        </div>
      </div>
    </div>
  );
};
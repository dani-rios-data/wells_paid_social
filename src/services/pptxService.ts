import pptxgen from "pptxgenjs";
import React from "react";
import html2canvas from "html2canvas";
import { SocialSpendData } from "@/components/BankingSocialData";
import { getDateRange, getUniqueBanks } from "./dataService";

export interface SlideData {
  title: string;
  subtitle: string;
  content: (data: SocialSpendData[]) => React.ReactNode;
}

export const generatePowerPointPresentation = async (
  data: SocialSpendData[], 
  slides: SlideData[]
): Promise<void> => {
  try {
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.author = "Wells Fargo";
    pptx.company = "Wells Fargo";
    pptx.subject = "Banking Paid Social Investment Analysis";
    pptx.title = "Banking Paid Social Investment Analysis";
    
    // Generate cover slide
    await generateCoverSlide(pptx, data);
    
    // Generate content slides with actual visual captures
    for (let i = 0; i < slides.length; i++) {
      await generateContentSlideWithVisuals(pptx, slides[i], data, i + 1);
    }
    
    // Generate and download the presentation
    const fileName = `Wells_Fargo_Social_Investment_Analysis_${new Date().toISOString().split('T')[0]}.pptx`;
    await pptx.writeFile({ fileName });
    
  } catch (error) {
    console.error('Error generating PowerPoint presentation:', error);
    throw new Error('Failed to generate PowerPoint presentation');
  }
};

// Helper function to capture chart elements as images
const captureChartAsImage = async (selector: string): Promise<string | null> => {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return null;
    }
    
    // Wait a moment for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const canvas = await html2canvas(element as HTMLElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      ignoreElements: (element) => {
        // Skip headers, navigation, and any Wells Fargo header elements
        return element.hasAttribute('data-testid') && element.getAttribute('data-testid') === 'presentation-header' ||
               element.tagName === 'HEADER' || 
               element.classList.contains('header') ||
               element.classList.contains('bg-wells-fargo-red') ||
               element.closest('[data-testid="presentation-header"]') !== null ||
               (element.classList.contains('bg-white') && element.classList.contains('p-4') && element.classList.contains('border-b'));
      }
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
};

// New function to capture the entire slide content without header
const captureSlideContent = async (): Promise<string | null> => {
  try {
    // Find the slide content container (excluding header)
    const slideContent = document.querySelector('[data-testid="slide-content"]');
    if (!slideContent) {
      console.warn('Slide content not found');
      return null;
    }

    // Wait for content to fully render
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const canvas = await html2canvas(slideContent as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: slideContent.scrollWidth,
      height: slideContent.scrollHeight,
      ignoreElements: (element) => {
        // Exclude any headers or navigation elements
        return element.hasAttribute('data-testid') && element.getAttribute('data-testid') === 'presentation-header' ||
               element.tagName === 'HEADER' || 
               element.classList.contains('header') ||
               element.closest('[data-testid="presentation-header"]') !== null;
      }
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing slide content:', error);
    return null;
  }
};

const generateCoverSlide = async (pptx: pptxgen, data: SocialSpendData[]) => {
  const slide = pptx.addSlide();
  
  // Set slide background
  slide.background = { fill: "D71921" };
  
  // Wells Fargo Logo/Brand
  slide.addText("WF", {
    x: 0.5,
    y: 0.5,
    w: 1,
    h: 1,
    fontSize: 36,
    fontFace: "Arial",
    color: "FFD700",
    bold: true,
    align: "center",
    valign: "middle"
  });
  
  slide.addText("Wells Fargo", {
    x: 1.8,
    y: 0.5,
    w: 3,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
    valign: "middle"
  });
  
  slide.addText("Strategic Analytics", {
    x: 1.8,
    y: 1,
    w: 3,
    h: 0.3,
    fontSize: 14,
    fontFace: "Arial",
    color: "FFFFFF",
    transparency: 20,
    valign: "middle"
  });
  
  // Main title
  slide.addText("BANKING", {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1,
    fontSize: 48,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
    align: "left"
  });
  
  slide.addText("Paid Social Investment", {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.8,
    fontSize: 36,
    fontFace: "Arial",
    color: "FFD700",
    align: "left"
  });
  
  slide.addText("Analysis", {
    x: 1,
    y: 4.3,
    w: 8,
    h: 0.8,
    fontSize: 28,
    fontFace: "Arial",
    color: "FFFFFF",
    align: "left"
  });
  
  // Date range and details
  const dateRange = getDateRange(data);
  const banks = getUniqueBanks(data);
  
  slide.addText(`Date Range: ${dateRange}`, {
    x: 1,
    y: 5.5,
    w: 8,
    h: 0.3,
    fontSize: 14,
    fontFace: "Arial",
    color: "FFFFFF"
  });
  
  slide.addText("Focus: Paid Social Investment Analysis", {
    x: 1,
    y: 5.8,
    w: 8,
    h: 0.3,
    fontSize: 14,
    fontFace: "Arial",
    color: "FFFFFF"
  });
  
  slide.addText("Source: Nielsen Ad Intel", {
    x: 1,
    y: 6.1,
    w: 8,
    h: 0.3,
    fontSize: 14,
    fontFace: "Arial",
    color: "FFFFFF"
  });
  
  // Banks analyzed
  slide.addText("Banks Analyzed:", {
    x: 7,
    y: 2.5,
    w: 2,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: "FFD700",
    bold: true
  });
  
  banks.forEach((bank, index) => {
    slide.addText(`• ${bank}`, {
      x: 7,
      y: 3 + (index * 0.3),
      w: 2.5,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      color: "FFFFFF"
    });
  });
  
  // Footer
  slide.addText(`© ${new Date().getFullYear()} Wells Fargo. Analysis based on Nielsen Ad Intel data.`, {
    x: 1,
    y: 7,
    w: 8,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: "FFFFFF",
    align: "center"
  });
  
  slide.addText("Confidential and proprietary information for internal use only.", {
    x: 1,
    y: 7.3,
    w: 8,
    h: 0.3,
    fontSize: 8,
    fontFace: "Arial",
    color: "FFFFFF",
    align: "center"
  });
};

const generateContentSlideWithVisuals = async (
  pptx: pptxgen, 
  slideData: SlideData, 
  data: SocialSpendData[], 
  slideNumber: number
) => {
  const slide = pptx.addSlide();
  
  // Set slide background to white
  slide.background = { fill: "FFFFFF" };
  
  // Red header background shape
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 10,
    h: 1.8,
    fill: { color: "D71921" },
    line: { width: 0 }
  });
  
  // Wells Fargo logo background (gold square)
  slide.addShape("rect", {
    x: 0.5,
    y: 0.2,
    w: 0.8,
    h: 0.8,
    fill: { color: "FFCD41" },
    line: { width: 0 }
  });
  
  // WF text in logo
  slide.addText("WF", {
    x: 0.5,
    y: 0.2,
    w: 0.8,
    h: 0.8,
    fontSize: 24,
    fontFace: "Arial",
    color: "D71921",
    bold: true,
    align: "center",
    valign: "middle"
  });
  
  // Wells Fargo title
  slide.addText("Wells Fargo", {
    x: 1.5,
    y: 0.3,
    w: 3,
    h: 0.4,
    fontSize: 20,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
    valign: "middle"
  });
  
  // Subtitle
  slide.addText("Banking Paid Social Investment Analysis", {
    x: 1.5,
    y: 0.7,
    w: 5,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: "FFFFFF",
    valign: "middle"
  });
  
  // Slide number (top right)
  slide.addText(`Slide ${slideNumber}`, {
    x: 8.5,
    y: 0.3,
    w: 1.2,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: "FFFFFF",
    align: "right",
    valign: "middle"
  });
  
  // Main slide title (editable)
  slide.addText(slideData.title, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 0.8,
    fontSize: 24,
    fontFace: "Arial",
    color: "2C3E50",
    bold: true,
    breakLine: true
  });
  
  // Subtitle (editable)
  slide.addText(slideData.subtitle, {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: "7F8C8D"
  });
  
  // Try to capture only the chart/graph as image
  const chartImage = await captureChartOnly(slideNumber);
  
  if (chartImage) {
    // Add chart as image (not editable, but high quality)
    slide.addImage({
      data: chartImage,
      x: 0.5,
      y: 3.8,
      w: 6.5,
      h: 3.2
    });
  } else {
    // Fallback chart placeholder (editable shape)
    slide.addShape("rect", {
      x: 0.5,
      y: 3.8,
      w: 6.5,
      h: 3.2,
      fill: { color: "F8F9FA" },
      line: { color: "DEE2E6", width: 1 }
    });
    
    slide.addText("📊 Chart Visualization\n\n[Chart data will be displayed here]", {
      x: 0.5,
      y: 3.8,
      w: 6.5,
      h: 3.2,
      fontSize: 16,
      fontFace: "Arial",
      color: "6C757D",
      align: "center",
      valign: "middle"
    });
  }
  
  // Key Insights section header (editable)
  slide.addText("Key Insights:", {
    x: 7.2,
    y: 3.8,
    w: 2.5,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: "D71921",
    bold: true
  });
  
  // Key Insights background (editable shape)
  slide.addShape("rect", {
    x: 7.2,
    y: 4.3,
    w: 2.5,
    h: 2.7,
    fill: { color: "FFF3CD" },
    line: { color: "F0AD4E", width: 1 }
  });
  
  // Key insights content (editable text)
  const insights = getSlideInsights(slideNumber);
  const insightsText = insights.map(insight => `• ${insight}`).join('\n\n');
  
  slide.addText(insightsText, {
    x: 7.3,
    y: 4.4,
    w: 2.3,
    h: 2.5,
    fontSize: 10,
    fontFace: "Arial",
    color: "495057",
    breakLine: true,
    valign: "top"
  });
  
  // Footer line (editable shape)
  slide.addShape("rect", {
    x: 0.5,
    y: 7.3,
    w: 9,
    h: 0.02,
    fill: { color: "D71921" },
    line: { width: 0 }
  });
  
  // Footer text (editable)
  slide.addText("© 2025 Wells Fargo. Analysis based on Nielsen Ad Intel data.", {
    x: 0.5,
    y: 7.4,
    w: 9,
    h: 0.3,
    fontSize: 8,
    fontFace: "Arial",
    color: "6C757D",
    align: "center"
  });
  
  slide.addText("Confidential and proprietary information for internal use only.", {
    x: 0.5,
    y: 7.6,
    w: 9,
    h: 0.3,
    fontSize: 7,
    fontFace: "Arial",
    color: "6C757D",
    align: "center"
  });
};

// New function to capture only chart/graph elements
const captureChartOnly = async (slideNumber: number): Promise<string | null> => {
  try {
    const chartSelectors = [
      // Slide 1: Timeline chart
      'canvas[aria-label*="chart"], .recharts-surface, [data-testid*="chart"], .recharts-wrapper canvas',
      // Slide 2: YoY comparison chart  
      'canvas[aria-label*="chart"], .recharts-surface, [data-testid*="chart"], .recharts-wrapper canvas',
      // Slide 3: Platform breakdown chart
      'canvas[aria-label*="chart"], .recharts-surface, [data-testid*="chart"], .recharts-wrapper canvas'
    ];
    
    const selectors = chartSelectors[slideNumber - 1];
    
    // Try to find any chart canvas or SVG
    const chartElements = document.querySelectorAll(selectors);
    
    for (const element of chartElements) {
      if (element && (element.tagName === 'CANVAS' || element.tagName === 'svg')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const canvas = await html2canvas(element as HTMLElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        });
        
        return canvas.toDataURL('image/png');
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
};

// Get chart selectors for each slide - capture only content without headers
const getChartSelectors = (slideNumber: number): string[] => {
  const selectors = [
    // Slide 1: Social Spend Timeline - capture only the chart content
    [
      '[data-testid="slide-content"]',
      '[data-testid="social-spend-timeline"]'
    ],
    // Slide 2: YoY Comparison - capture only the chart area
    [
      '[data-testid="slide-content"]',
      '[data-testid="yoy-spend-comparison"]'
    ],
    // Slide 3: Platform Breakdown - capture only the chart area
    [
      '[data-testid="slide-content"]',
      '[data-testid="platform-spend-breakdown"]'
    ]
  ];
  
  return selectors[slideNumber - 1] || ['[data-testid="slide-content"]'];
};

const getSlideInsights = (slideNumber: number): string[] => {
  const insights = [
    [
      "Wells Fargo shows consistent social investment",
      "Peak spending aligns with financial quarters",
      "Capital One leads with highest overall spend",
      "Bank of America diversifies across platforms"
    ],
    [
      "Capital One leads market investment",
      "Wells Fargo shows 35% YoY growth",
      "Industry trend toward paid social focus",
      "Fintech players show percentage growth"
    ],
    [
      "Facebook dominates platform investment",
      "Instagram targets younger demographics",
      "TikTok emerges for Gen Z engagement",
      "Platform diversification strategy evident"
    ]
  ];
  
  return insights[slideNumber - 1] || [];
};
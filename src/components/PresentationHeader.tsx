"use client"

import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresentationHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onShare: () => void;
}

export const PresentationHeader = ({ currentSlide, totalSlides, onShare }: PresentationHeaderProps) => {
  return (
    <header className="bg-white p-4 border-b" data-testid="presentation-header">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-[#D71921] text-white p-3 rounded-md w-14 h-14 flex items-center justify-center">
            <span className="font-bold text-2xl">WF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Wells Fargo</h1>
            <p className="text-sm text-gray-500">Banking Paid Social Investment Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <Button onClick={onShare} className="bg-[#D71921] hover:bg-[#b8141b] text-white">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
};
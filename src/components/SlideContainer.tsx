import { ReactNode } from "react";

interface SlideContainerProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export const SlideContainer = ({ title, children, subtitle }: SlideContainerProps) => {
  return (
    <div className="bg-white flex-1">
      <div className="bg-wells-fargo-red text-white py-4 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-wide">{title}</h2>
          {subtitle && (
            <div className="mt-1 flex items-center gap-4">
              <div className="h-px bg-wells-fargo-gold flex-1"></div>
              <span className="text-wells-fargo-gold text-xs uppercase tracking-wider">{subtitle}</span>
              <div className="h-px bg-wells-fargo-gold flex-1"></div>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-8 max-w-screen-2xl mx-auto" data-testid="slide-content">
        {children}
      </div>
    </div>
  );
};
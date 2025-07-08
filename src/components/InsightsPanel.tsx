interface InsightsPanelProps {
  title: string;
  insights: string[];
}

export const InsightsPanel = ({ title, insights }: InsightsPanelProps) => {
  return (
    <div className="bg-wells-fargo-light-gold border border-wells-fargo-gold rounded-lg p-6">
      <h4 className="font-semibold text-wells-fargo-dark-red mb-4 text-lg">{title}</h4>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-wells-fargo-red rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
import { bankColors } from "@/services/dataService";

interface YoYData {
  bank: string;
  yoyChange: number;
  [key: string]: any;
}

interface TooltipPayload {
  [key: string]: any;
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  formatter: (value: number) => string;
  valueKey: string;
  name: string;
}

export const CustomTooltip = ({ active, payload, label, formatter, valueKey, name }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data[valueKey];

    return (
      <div className="bg-background/90 backdrop-blur-sm text-foreground p-3 rounded-lg border border-border/20 shadow-lg">
        <p className="font-bold text-base mb-2">{label}</p>
        <div className="flex items-center gap-2">
           <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: payload[0].color }}
          ></div>
          <p className="text-sm">
            <span className="font-medium">{name}: </span>
            <span className="font-bold">{formatter(value)}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

interface YoYSpendTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  yearA: number;
  yearB: number;
  formatter: (value: number) => string;
}

export const YoYSpendTooltip = ({ active, payload, label, yearA, yearB, formatter }: YoYSpendTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-sm text-foreground p-3 rounded-lg border border-border/20 shadow-lg">
        <p className="font-bold text-base mb-2">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: pld.color }}
            ></div>
            <p className="text-sm">
              <span className="font-medium">{pld.name}: </span>
              <span className="font-bold">{formatter(pld.value)}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}; 
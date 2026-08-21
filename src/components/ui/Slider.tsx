import React, { useId } from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  valueDisplay?: string | React.ReactNode;
  tooltip?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  valueDisplay,
  tooltip,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  // Calculate percentage for custom track styling
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center">
        <label htmlFor={inputId} className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5" title={tooltip}>
          {label}
        </label>
        <span className="text-[11px] font-mono text-cyan-400 font-bold">
          {valueDisplay !== undefined ? valueDisplay : value}{unit}
        </span>
      </div>
      <div className="relative flex items-center h-5">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:bg-cyan-300 [&::-webkit-slider-thumb]:transition-all
                     [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:[&::-moz-range-thumb]:scale-110 hover:[&::-moz-range-thumb]:bg-cyan-300 [&::-moz-range-thumb]:transition-all"
          style={{
            background: `linear-gradient(to right, rgb(34 211 238) ${percentage}%, rgb(30 41 59) ${percentage}%)`
          }}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          {...props}
        />
      </div>
    </div>
  );
};

import React, { useState } from "react";

interface FactorAdjusterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  presets?: number[];
  min?: number;
}

export const FactorAdjuster: React.FC<FactorAdjusterProps> = ({
  label,
  value,
  onChange,
  presets = [10, 20, 30],
  min,
}) => {
  const [customValue, setCustomValue] = useState<string | null>(null);
  const isCustom = value !== 0 && !presets.includes(value);
  const options = [0, ...presets].sort((a, b) => a - b);

  return (
    <div className="flex max-w-full flex-col gap-1.5">
      <label className="text-base font-medium text-slate-700">
        {label}
      </label>
      <div className="flex flex-wrap items-end">
        {options.map((preset, index) => (
          <button
            key={preset}
            type="button"
            className={`border ${index > 0 ? "border-l-0" : ""} px-4 py-2.5 text-base font-medium transition-colors ${
              value === preset
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            onClick={() => {
              setCustomValue(null);
              onChange(preset);
            }}
          >
            {preset > 0 ? "+" : ""}{preset}%
          </button>
        ))}
        <input
          id={`${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-custom`}
          type="text"
          inputMode="decimal"
          value={customValue ?? (isCustom ? value : "")}
          onChange={(e) => {
            const raw = e.target.value;
            if (!/^[+-]?\d*\.?\d*$/.test(raw)) return;
            setCustomValue(raw);

            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return;

            const nextValue = min === undefined ? parsed : Math.max(min, parsed);
            if (nextValue !== parsed) setCustomValue(String(nextValue));
            onChange(nextValue);
          }}
          onBlur={() => setCustomValue(null)}
          placeholder="Custom"
          className="w-32 border border-l-0 border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          aria-label={`${label} custom percentage`}
        />
      </div>
    </div>
  );
};

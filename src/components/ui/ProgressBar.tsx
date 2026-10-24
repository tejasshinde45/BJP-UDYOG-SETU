import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  sublabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'primary',
  label,
  sublabel,
}) => {
  const barColors = {
    primary: 'bg-[#E35914]',
    secondary: 'bg-[#136938]',
    tertiary: 'bg-[#F59E0B]',
  }[color];

  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-label">
          {label && <span className="font-medium text-[#111827]">{label}</span>}
          {sublabel && <span className="text-[#64748B]">{sublabel}</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-[#EEF2FF] rounded-full overflow-hidden">
        <div
          className={`h-full ${barColors} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

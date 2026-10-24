import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  accent?: 'none' | 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  accent = 'none',
  onClick,
}) => {
  const accentBorder = {
    none: 'border-[#E2E8F0]',
    primary: 'border-t-4 border-t-[#E35914] border-x-[#E2E8F0] border-b-[#E2E8F0]',
    secondary: 'border-t-4 border-t-[#136938] border-x-[#E2E8F0] border-b-[#E2E8F0]',
    tertiary: 'border-t-4 border-t-[#F59E0B] border-x-[#E2E8F0] border-b-[#E2E8F0]',
  }[accent];

  const hoverStyle = hoverEffect
    ? 'hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 cursor-pointer'
    : 'shadow-xs';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${accentBorder} ${hoverStyle} p-6 ${className}`}
    >
      {children}
    </div>
  );
};

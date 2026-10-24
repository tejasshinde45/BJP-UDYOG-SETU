import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'demo'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-[#FFF7ED] text-[#E35914] border border-[#FFEDD5]',
    secondary: 'bg-[#F0FDF4] text-[#136938] border border-[#DCFCE7]',
    tertiary: 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]',
    neutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    demo: 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] font-medium tracking-wide uppercase',
    outline: 'bg-white text-[#64748B] border border-[#E2E8F0]',
    success: 'bg-[#F0FDF4] text-[#136938] border border-[#DCFCE7]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7]',
    info: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FEE2E2]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full font-label select-none ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

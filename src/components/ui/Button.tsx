import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'green' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-devanagari select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-sm px-3 py-2 rounded-lg gap-1.5',
    md: 'text-base px-4 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-6 py-3 rounded-lg gap-2.5 shadow-sm',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#E35914] text-white hover:bg-[#CC4D0E] active:bg-[#B33E09] focus:ring-[#E35914] border border-transparent shadow-sm',
    secondary:
      'bg-[#F4F7FF] text-[#111827] hover:bg-[#E6ECFC] active:bg-[#DCE4FA] border border-[#E2E8F0] focus:ring-[#136938]',
    inverted:
      'bg-[#111827] text-white hover:bg-[#1F2937] active:bg-[#000000] border border-transparent focus:ring-[#111827]',
    outlined:
      'bg-white text-[#111827] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] border border-[#CBD5E1] focus:ring-[#E35914]',
    green:
      'bg-[#136938] text-white hover:bg-[#0E532C] active:bg-[#0A3D20] border border-transparent focus:ring-[#136938] shadow-sm',
    gold:
      'bg-[#F59E0B] text-[#111827] hover:bg-[#D97706] hover:text-white active:bg-[#B45309] border border-transparent focus:ring-[#F59E0B] shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-label"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white text-[#111827] text-sm rounded-lg border ${
              error ? 'border-red-400 focus:ring-red-300' : 'border-[#CBD5E1] focus:border-[#E35914] focus:ring-[#E35914]/20'
            } ${
              icon ? 'pl-10' : 'pl-3.5'
            } pr-3.5 py-2.5 transition duration-150 focus:outline-none focus:ring-2 placeholder:text-[#94A3B8] font-devanagari ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-devanagari">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#64748B] font-devanagari">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

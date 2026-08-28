import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl select-none';

    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-500/20 active:bg-primary-800',
      secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-elevated dark:hover:bg-slate-800 text-slate-800 dark:text-dark-text',
      outline: 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-200',
      ghost: 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-600 dark:text-slate-300',
      danger: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400',
      accent: 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/25',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-12 font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

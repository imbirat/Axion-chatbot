import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent-primary text-white hover:bg-accent-primary/90 active:scale-[0.98]',
        destructive: 'bg-error text-white hover:bg-error/90',
        outline: 'border border-border-subtle bg-transparent hover:bg-[var(--hover-bg)] text-text-primary',
        secondary: 'bg-bg-elevated text-text-primary hover:bg-bg-elevated/80',
        ghost: 'hover:bg-[var(--hover-bg)] text-text-secondary hover:text-text-primary',
        link: 'text-accent-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };

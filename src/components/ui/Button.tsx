"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-40 disabled:pointer-events-none",
          {
            "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]": variant === "primary",
            "bg-base-surface text-text-primary border border-base-border hover:bg-base-hover": variant === "secondary",
            "text-text-secondary hover:text-text-primary hover:bg-base-hover": variant === "ghost",
            "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20": variant === "danger",
          },
          {
            "h-7 px-2.5 text-xs gap-1.5": size === "sm",
            "h-9 px-3.5 text-sm gap-2": size === "md",
            "h-11 px-5 text-base gap-2.5": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

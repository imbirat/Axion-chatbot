"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: React.ElementType;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "center" | "end";
}

export function Dropdown({ trigger, items, align = "start" }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          className="z-50 min-w-40 bg-base-surface border border-base-border rounded-lg p-1 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {items.map((item, i) => (
            <DropdownMenu.Item
              key={i}
              onSelect={item.onSelect}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors focus:outline-none",
                item.danger
                  ? "text-danger hover:bg-danger/10"
                  : "text-text-primary hover:bg-base-hover",
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

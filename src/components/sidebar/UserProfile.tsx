"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { UserCircle, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Tooltip } from "@/components/ui/Tooltip";

interface UserProfileProps {
  collapsed: boolean;
  email: string;
}

export function UserProfile({ collapsed, email }: UserProfileProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const trigger = (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "flex items-center gap-3 w-full rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover transition-colors",
        collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
      )}
    >
      <UserCircle size={18} />
      {!collapsed && <span className="truncate">{email}</span>}
    </button>
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {collapsed ? (
        <Tooltip content={email} side="right">{trigger}</Tooltip>
      ) : (
        trigger
      )}
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={4}
          align={collapsed ? "center" : "start"}
          className="z-50 w-56 rounded-lg bg-base-surface border border-base-border p-2 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 origin-bottom"
        >
          <div className="px-3 py-2 text-sm text-text-secondary border-b border-base-border mb-1">
            {email}
          </div>
          <button
            onClick={() => { router.push("/settings"); setOpen(false); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-primary hover:bg-base-hover rounded-md transition-colors"
          >
            <Settings size={14} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-md transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

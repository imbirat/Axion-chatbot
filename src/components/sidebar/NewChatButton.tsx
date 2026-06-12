"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewChatButtonProps {
  collapsed: boolean;
}

export function NewChatButton({ collapsed }: NewChatButtonProps) {
  const router = useRouter();

  function handleNewChat() {
    router.push("/");
  }

  return (
    <button
      onClick={handleNewChat}
      className={cn(
        "flex items-center gap-3 w-full rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover transition-colors",
        collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
      )}
    >
      <Plus size={18} />
      {!collapsed && <span>New Chat</span>}
    </button>
  );
}

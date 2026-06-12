"use client";

import { useRouter, useParams } from "next/navigation";
import { MessageSquare, Bot, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types";

interface ConversationListProps {
  collapsed: boolean;
  conversations: Conversation[];
}

export function ConversationList({ collapsed, conversations }: ConversationListProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="flex flex-col gap-0.5 px-2">
      {!collapsed && (
        <p className="text-xs font-medium text-text-muted px-2 py-2 uppercase tracking-wider">
          Recents
        </p>
      )}
      {conversations.map((conv) => {
        const isActive = params?.id === conv.id;

        return (
          <button
            key={conv.id}
            onClick={() => router.push(`/${conv.mode}/${conv.id}`)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg text-sm transition-colors text-left",
              collapsed ? "justify-center p-2.5" : "px-3 py-2",
              isActive
                ? "bg-accent-subtle text-accent"
                : "text-text-secondary hover:text-text-primary hover:bg-base-hover"
            )}
          >
            {conv.mode === "agent" ? (
              <Bot size={collapsed ? 18 : 14} className={cn(collapsed ? "" : "shrink-0", conv.mode === "agent" && "text-accent")} />
            ) : conv.mode === "code" ? (
              <Code2 size={collapsed ? 18 : 14} className="shrink-0" />
            ) : (
              <MessageSquare size={collapsed ? 18 : 14} className="shrink-0" />
            )}
            {!collapsed && (
              <span className="truncate">{conv.title}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

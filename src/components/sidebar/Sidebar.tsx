"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { PanelLeft, Search, Code2, Bot, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { NewChatButton } from "./NewChatButton";
import { ConversationList } from "./ConversationList";
import { UserProfile } from "./UserProfile";
import { SearchModal } from "./SearchModal";
import { Tooltip } from "@/components/ui/Tooltip";
import { Conversation } from "@/types";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);

      const { data: convs } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(20);

      if (convs) setConversations(convs);
    }
    load();
  }, [pathname, supabase]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sidebarContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-base-surface border-r border-base-border transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className={cn("flex items-center border-b border-base-border", collapsed ? "p-2 justify-center" : "p-3 justify-between")}>
        <div className={cn("overflow-hidden transition-all duration-300", collapsed ? "w-8" : "w-[120px]")}>
          <Image
            src="/logo.png"
            alt="Axion AI"
            width={120}
            height={32}
            priority
            className="object-contain object-left min-w-[120px]"
          />
        </div>
        <button
          onClick={onToggle}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        <NewChatButton collapsed={collapsed} />

        {collapsed ? (
          <Tooltip content="Search (Ctrl+K)" side="right">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-full p-2.5 text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
            >
              <Search size={18} />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
          >
            <Search size={18} />
            <span>Search (Ctrl+K)</span>
          </button>
        )}

        {collapsed ? (
          <Tooltip content="Code" side="right">
            <button
              onClick={() => router.push("/code/new")}
              className="flex items-center justify-center w-full p-2.5 text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
            >
              <Code2 size={18} />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={() => router.push("/code/new")}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
          >
            <Code2 size={18} />
            <span>Code</span>
          </button>
        )}

        {collapsed ? (
          <Tooltip content="Agent" side="right">
            <button
              onClick={() => router.push("/agent/new")}
              className="flex items-center justify-center w-full p-2.5 text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
            >
              <Bot size={18} />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={() => router.push("/agent/new")}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-base-hover rounded-lg transition-colors"
          >
            <Bot size={18} />
            <span>Agent</span>
          </button>
        )}

        {conversations.length > 0 && (
          <div className="pt-2">
            <ConversationList collapsed={collapsed} conversations={conversations} />
          </div>
        )}
      </div>

      <div className="border-t border-base-border py-2">
        <UserProfile collapsed={collapsed} email={email} />
      </div>

      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        conversations={conversations}
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 p-2 rounded-lg bg-base-surface border border-base-border text-text-secondary"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}

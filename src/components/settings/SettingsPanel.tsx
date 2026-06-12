"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Monitor, Trash2, LogOut, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { useConversations } from "@/hooks/useConversations";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { settings, update } = useSettings();
  const { remove } = useConversations();
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleClearChats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("conversations").delete().eq("user_id", user.id);
    setClearOpen(false);
  }

  async function handleDeleteAccount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc("delete_user_account", {
      user_id: user.id,
      password: deletePassword,
    });

    if (!error) {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }
  }

  const appearanceOptions = [
    { value: "system", label: "System", icon: Monitor },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "light", label: "Light", icon: Sun },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-xl font-semibold text-text-primary mb-8">Settings</h1>

      <section className="mb-10">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">General</h2>
        <div className="bg-base-surface border border-base-border rounded-xl p-4 space-y-6">
          <div>
            <label className="text-sm text-text-secondary block mb-2">Appearance</label>
            <div className="flex gap-2">
              {appearanceOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => update({ appearance: opt.value as any })}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors",
                      settings.appearance === opt.value
                        ? "bg-accent-subtle border-accent text-accent"
                        : "bg-base-bg border-base-border text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Icon size={14} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-2">Contrast</label>
            <div className="flex gap-2">
              {["system", "medium", "increased"].map((c) => (
                <button
                  key={c}
                  onClick={() => update({ contrast: c as any })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm border capitalize transition-colors",
                    settings.contrast === c
                      ? "bg-accent-subtle border-accent text-accent"
                      : "bg-base-bg border-base-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => update({ language: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-base-bg border border-base-border text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Data</h2>
        <div className="bg-base-surface border border-base-border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-primary">Chat History</p>
              <p className="text-xs text-text-muted">Save conversations to your account</p>
            </div>
            <div className="w-10 h-5 rounded-full bg-accent relative cursor-pointer">
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setClearOpen(true)}
          >
            <Trash2 size={14} />
            Clear all conversations
          </Button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Account</h2>
        <div className="bg-base-surface border border-base-border rounded-xl p-4 space-y-4">
          <div>
            <p className="text-sm text-text-primary">Email</p>
            <p className="text-xs text-text-muted">{/* will be loaded from session */}</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <AlertTriangle size={14} />
            Delete account
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut size={14} />
            Log out
          </Button>
        </div>
      </section>

      <Modal open={clearOpen} onOpenChange={setClearOpen} title="Clear chat history" description="Are you sure? This cannot be undone.">
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={() => setClearOpen(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleClearChats} className="flex-1">Clear all</Button>
        </div>
      </Modal>

      <Modal open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete account" description="Enter your password to confirm.">
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            className="h-10 px-3 rounded-lg bg-base-bg border border-base-border text-sm text-text-primary focus:outline-none focus:border-accent"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

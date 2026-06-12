"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Conversation } from "@/types";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(20);
    if (data) setConversations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create(title: string = "New Chat", mode: string = "chat", modelId: string = "axion-4.7") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title, mode, model_id: modelId })
      .select()
      .single();

    if (data) {
      setConversations((prev) => [data, ...prev]);
    }
    return data;
  }

  async function remove(id: string) {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  async function updateTitle(id: string, title: string) {
    await supabase.from("conversations").update({ title }).eq("id", id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }

  return { conversations, loading, create, remove, updateTitle, refresh: load };
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Settings } from "@/types";

const DEFAULT_SETTINGS: Settings = {
  user_id: "",
  appearance: "system",
  contrast: "system",
  language: "en",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setSettings(data);
      } else {
        const { data: newSettings } = await supabase
          .from("settings")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (newSettings) setSettings(newSettings);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function update(updates: Partial<Settings>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("settings")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (data) setSettings(data);
  }

  return { settings, loading, update };
}

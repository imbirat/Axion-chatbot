"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={error && !error.includes("Password") ? error : undefined}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={error && error.includes("Password") ? error : undefined}
      />
      {error && !error.includes("Password") && !error.includes("Email") && (
        <p className="text-xs text-danger">{error}</p>
      )}
      <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
        <LogIn size={16} />
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <p className="text-sm text-text-secondary text-center mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent hover:text-accent-hover">
          Create account
        </Link>
      </p>
    </form>
  );
}

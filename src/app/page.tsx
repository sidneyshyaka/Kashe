"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  role: string;
  shops: { name: string } | null;
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role, shops(name)")
      .eq("id", user.id)
      .single();
    setProfile(data as Profile | null);
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    await loadProfile();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setEmail("");
    setPassword("");
  }

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  if (profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8">
        <h1 className="text-3xl font-bold">Welcome, {profile.full_name}</h1>
        <p className="text-gray-600">Shop: {profile.shops?.name}</p>
        <p className="text-gray-600">Role: {profile.role}</p>
        <button
          onClick={handleLogout}
          className="mt-4 rounded bg-gray-900 px-4 py-2 text-white"
        >
          Log out
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Kashe</h1>
      <form onSubmit={handleLogin} className="mt-6 flex w-full max-w-sm flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border px-3 py-2"
          required
        />
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-white">
          Sign in
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}

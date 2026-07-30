"use client";

import { AlertCircle, LockKeyhole, LogIn, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { getSupabaseBrowserClient, hasSupabasePublicConfig } from "@/lib/supabase/client";

interface AdminLoginProps {
  onMessage: (message: string | null) => void;
  onSuccess: () => void;
}

export function AdminLogin({ onMessage, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError("Faltan las variables públicas de Supabase en Vercel.");
      return;
    }

    setIsLoading(true);
    setError(null);
    onMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onSuccess();
    }

    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f8] px-5 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
          <LockKeyhole size={26} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Delicias de Bávaro</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Panel del restaurante</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Accede para actualizar el menú, revisar pedidos y administrar tus mesas QR.
        </p>

        {!hasSupabasePublicConfig() ? (
          <div className="mt-6 flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>Configura las variables de Supabase en Vercel para activar este acceso.</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold text-neutral-700">
            Correo administrador
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu-correo@ejemplo.com"
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-normal outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />
          </label>
          <label className="block text-sm font-bold text-neutral-700">
            Contraseña
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 font-normal outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />
          </label>
          {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isLoading || !hasSupabasePublicConfig()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3.5 font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            {isLoading ? "Comprobando..." : "Entrar al panel"}
          </button>
        </form>
      </section>
    </main>
  );
}

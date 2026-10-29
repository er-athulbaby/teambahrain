"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Flame } from "lucide-react";

type Step = "credentials" | "totp" | "setup";

export default function LoginForm({ logoUrl }: { logoUrl?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/mfa-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Invalid username or password.");
      return;
    }
    if (data.status === "needs_setup") {
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setStep("setup");
    } else {
      setStep("totp");
    }
  }

  async function finishSignIn() {
    const result = await signIn("credentials", { username, password, totp, redirect: false });
    if (result?.error) {
      setError("Invalid code — try again.");
      return false;
    }
    router.push("/admin");
    router.refresh();
    return true;
  }

  async function handleTotp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await finishSignIn();
    setLoading(false);
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/mfa-enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, totp }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Invalid code.");
      setLoading(false);
      return;
    }
    await finishSignIn();
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex justify-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-16 w-16 object-contain" />
          ) : (
            <span className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Flame size={22} strokeWidth={2} />
            </span>
          )}
        </div>
        <h1 className="mb-1 text-center text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="mb-6 text-center text-sm text-slate-500">Team Bahrain admin</p>

        {step === "credentials" && (
          <form onSubmit={handleCredentials} className="flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Checking…" : "Continue"}
            </button>
          </form>
        )}

        {step === "totp" && (
          <form onSubmit={handleTotp} className="flex flex-col gap-4">
            <div>
              <label htmlFor="totp" className="mb-1.5 block text-sm font-medium text-slate-700">
                Authenticator code
              </label>
              <input
                id="totp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tracking-widest focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1.5 text-xs text-slate-500">Enter the 6-digit code from your authenticator app.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Sign in"}
            </button>
          </form>
        )}

        {step === "setup" && (
          <form onSubmit={handleSetup} className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Set up multi-factor authentication to finish signing in — scan this with an authenticator app
              (Google Authenticator, Authy, etc.):
            </p>
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Authenticator QR code" className="mx-auto h-40 w-40" />
            )}
            {secret && (
              <p className="text-center text-xs text-slate-500 break-all">
                Can&apos;t scan? Enter this key manually: <span className="font-mono">{secret}</span>
              </p>
            )}
            <div>
              <label htmlFor="setup-totp" className="mb-1.5 block text-sm font-medium text-slate-700">
                Code from the app
              </label>
              <input
                id="setup-totp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tracking-widest focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Enabling…" : "Enable & sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

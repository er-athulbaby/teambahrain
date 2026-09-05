"use client";

import { useState } from "react";

const inputClass =
  "border-2 border-ink bg-white px-4 py-3 text-base text-ink focus:outline-none focus:border-accent";
const labelClass = "font-semibold text-[11px] tracking-[0.14em] uppercase text-ink-700";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Couldn't send your message. Please try again later.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Couldn't send your message. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-2 border-ink bg-white p-8 flex flex-col gap-2">
        <h2 className="m-0 font-bold text-xl uppercase">Message sent</h2>
        <p className="m-0 text-ink-700">Thanks for reaching out — the team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot — hidden from real visitors, left blank by them; bots that fill every field trip it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input id="name" name="name" type="text" required maxLength={200} className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input id="subject" name="subject" type="text" required maxLength={200} className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea id="message" name="message" required maxLength={5000} rows={6} className={inputClass} />
      </div>

      {status === "error" && <p className="m-0 text-sm text-accent-700 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-accent text-white border-2 border-accent px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase self-start min-w-[200px] hover:bg-accent-600 hover:border-accent-600 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

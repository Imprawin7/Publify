"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/api";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    try {
      await submitContactForm({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        message: String(data.get("message") || ""),
      });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <p className="max-w-prose text-ink">
        Message sent. I read every message and will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-prose space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm text-slate">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full border-0 border-b border-line bg-transparent py-2 text-ink outline-none focus-visible:border-accent"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-slate">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full border-0 border-b border-line bg-transparent py-2 text-ink outline-none focus-visible:border-accent"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-slate">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full border-0 border-b border-line bg-transparent py-2 text-ink outline-none focus-visible:border-accent"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">{errorMessage} — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-ink px-6 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

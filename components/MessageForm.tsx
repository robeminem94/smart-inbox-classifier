"use client";

import { useState } from "react";
import { ResultCards } from "@/components/ResultCards";
import { SOURCE_CHANNELS, type AiClassificationResult, type IncomingMessageInput, type SourceChannel } from "@/lib/types";

const emptyForm: IncomingMessageInput = {
  senderName: "",
  senderEmail: "",
  subject: "",
  body: "",
  source: "Website form",
  businessContext: "",
};

const exampleForm: IncomingMessageInput = {
  senderName: "Mark Jansen",
  senderEmail: "mark@example.com",
  subject: "Vraag over automatisering",
  body: "Hi, wij zijn een klein bedrijf met 15 medewerkers en verliezen veel tijd met handmatig overtypen van offerteaanvragen. Kunnen jullie helpen met automatisering?",
  source: "Website form",
  businessContext: "Company offers AI automation services for small businesses.",
};

export function MessageForm() {
  const [form, setForm] = useState<IncomingMessageInput>(emptyForm);
  const [submittedInput, setSubmittedInput] = useState<IncomingMessageInput | undefined>();
  const [result, setResult] = useState<AiClassificationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof IncomingMessageInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateClientForm(): string[] {
    const nextErrors: string[] = [];
    if (!form.senderName.trim()) nextErrors.push("Sender name is required.");
    if (!form.senderEmail.trim()) nextErrors.push("Sender email is required.");
    if (!form.subject.trim()) nextErrors.push("Subject is required.");
    if (!form.body.trim()) nextErrors.push("Message body is required.");
    if (!form.source.trim()) nextErrors.push("Source channel is required.");
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateClientForm();

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/classify-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        const details = Array.isArray(data.details) ? ` ${data.details.join(" ")}` : "";
        throw new Error(`${data.error || "Unable to analyze message."}${details}`);
      }

      setSubmittedInput({ ...form, businessContext: form.businessContext?.trim() || undefined });
      setResult(data as AiClassificationResult);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Unable to analyze message."]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAnalyzeAnother() {
    setForm(emptyForm);
    setSubmittedInput(undefined);
    setResult(null);
    setErrors([]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Manual analyzer</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Analyze a message</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Paste an email, website form submission, LinkedIn message, or any inbound business request.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForm(exampleForm)}
            className="w-fit rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Use example
          </button>
        </div>

        {errors.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sender name">
              <input
                value={form.senderName}
                onChange={(event) => updateField("senderName", event.target.value)}
                placeholder="Mark Jansen"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </Field>
            <Field label="Sender email">
              <input
                value={form.senderEmail}
                onChange={(event) => updateField("senderEmail", event.target.value)}
                placeholder="mark@example.com"
                type="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </Field>
          </div>

          <Field label="Message subject">
            <input
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              placeholder="Vraag over automatisering"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </Field>

          <Field label="Message body">
            <textarea
              value={form.body}
              onChange={(event) => updateField("body", event.target.value)}
              placeholder="Paste the full message here..."
              rows={8}
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Source channel">
              <select
                value={form.source}
                onChange={(event) => updateField("source", event.target.value as SourceChannel)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {SOURCE_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Optional business context">
              <input
                value={form.businessContext || ""}
                onChange={(event) => updateField("businessContext", event.target.value)}
                placeholder="AI automation services for SMBs"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Analyzing message..." : "Analyze message"}
        </button>
      </form>

      <div className="space-y-5">
        {isLoading ? <LoadingPanel /> : null}
        {result ? (
          <ResultCards result={result} messageInput={submittedInput} onAnalyzeAnother={handleAnalyzeAnother} />
        ) : null}
        {!isLoading && !result ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">AI output</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Classification appears here</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The result will include category, priority, sentiment, intent, summary, next action, draft reply,
              internal note, automation suggestion, and confidence score.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      {children}
    </label>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="h-3 w-28 rounded-full bg-slate-200" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

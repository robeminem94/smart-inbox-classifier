"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CopyButton } from "@/components/CopyButton";
import { PriorityBadge } from "@/components/PriorityBadge";
import { saveMessage } from "@/lib/localStorage";
import { type AiClassificationResult, type IncomingMessageInput } from "@/lib/types";

interface ResultCardsProps {
  result: AiClassificationResult;
  messageInput?: IncomingMessageInput;
  onAnalyzeAnother?: () => void;
}

export function ResultCards({ result, messageInput, onAnalyzeAnother }: ResultCardsProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  function handleSave() {
    if (!messageInput) return;
    saveMessage(messageInput, result);
    setSaveStatus("saved");
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</p>
          <div className="mt-3">
            <CategoryBadge category={result.category} />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Priority</p>
          <div className="mt-3">
            <PriorityBadge priority={result.priority} />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sentiment</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{result.sentiment}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Confidence</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{result.confidenceScore}%</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Summary" value={result.summary} />
        <InfoCard title="Lead / Customer Intent" value={result.intent} />
        <InfoCard title="Suggested Next Action" value={result.suggestedNextAction} />
        <InfoCard title="Automation Suggestion" value={result.automationSuggestion} />
        <InfoCard title="Reasoning" value={result.reasoningShort} />
        <InfoCard title="Suggested Label" value={result.suggestedLabel} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TextPanel title="Draft Reply" text={result.draftReply} copyLabel="Copy draft reply" />
        <TextPanel title="Internal Note" text={result.internalNote} copyLabel="Copy internal note" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">Human follow-up</p>
            <p className="mt-1 text-sm text-slate-600">
              {result.requiresHumanFollowUp
                ? "Recommended. A person should review or respond to this message."
                : "Not required for version 1 automation, but review before enabling production auto-replies."}
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              result.requiresHumanFollowUp ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {result.requiresHumanFollowUp ? "Review needed" : "Automation-ready"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap">
        <CopyButton text={result.draftReply} label="Copy draft reply" />
        <CopyButton text={result.internalNote} label="Copy internal note" />
        {messageInput ? (
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            {saveStatus === "saved" ? "Saved to inbox" : "Save to inbox"}
          </button>
        ) : null}
        {saveStatus === "saved" ? (
          <Link
            href="/inbox"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Open inbox
          </Link>
        ) : null}
        {onAnalyzeAnother ? (
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Analyze another message
          </button>
        ) : null}
      </div>
    </section>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{value || "Not available."}</p>
    </div>
  );
}

function TextPanel({ title, text, copyLabel }: { title: string; text: string; copyLabel: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <CopyButton text={text} label={copyLabel} className="px-3 py-1.5 text-xs" />
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{text || "Not available."}</p>
    </div>
  );
}

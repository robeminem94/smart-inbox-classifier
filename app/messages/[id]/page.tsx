"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { ResultCards } from "@/components/ResultCards";
import { getSavedMessageById } from "@/lib/localStorage";
import { type SavedMessage } from "@/lib/types";

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const [message, setMessage] = useState<SavedMessage | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setMessage(getSavedMessageById(params.id) || null);
    setHasLoaded(true);
  }, [params.id]);

  if (!hasLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-[2rem] bg-slate-100" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Message not found"
          description="This saved message was not found in local storage. It may have been deleted or saved in another browser."
          actionHref="/inbox"
          actionLabel="Back to inbox"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/inbox" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">
            Back to inbox
          </Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{message.subject}</h1>
          <p className="mt-2 text-sm text-slate-500">Saved {new Date(message.createdAt).toLocaleString()}</p>
        </div>
        <CopyButton text={message.analysis.draftReply} label="Copy draft reply" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-5">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Original sender info</p>
            <div className="mt-5 grid gap-4 text-sm text-slate-700">
              <InfoRow label="Sender" value={message.senderName} />
              <InfoRow label="Email" value={message.senderEmail} />
              <InfoRow label="Source" value={message.source} />
              <InfoRow label="Suggested label" value={message.analysis.suggestedLabel} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Full message body</p>
              <CopyButton text={message.body} label="Copy" className="px-3 py-1.5 text-xs" />
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{message.body}</p>
          </div>

          {message.businessContext ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Business context</p>
              <p className="mt-4 text-sm leading-7 text-slate-700">{message.businessContext}</p>
            </div>
          ) : null}
        </section>

        <ResultCards result={message.analysis} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}

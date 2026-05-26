"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge } from "@/components/PriorityBadge";
import { deleteSavedMessage, getSavedMessages } from "@/lib/localStorage";
import { CATEGORIES, PRIORITIES, type MessageCategory, type MessagePriority, type SavedMessage } from "@/lib/types";

export function InboxTable() {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MessageCategory | "All">("All");
  const [priority, setPriority] = useState<MessagePriority | "All">("All");

  useEffect(() => {
    setMessages(getSavedMessages());
  }, []);

  function handleDelete(id: string) {
    deleteSavedMessage(id);
    setMessages(getSavedMessages());
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    const matchesCategory = category === "All" || message.analysis.category === category;
    const matchesPriority = priority === "All" || message.analysis.priority === priority;
    const searchable = `${message.senderName} ${message.senderEmail} ${message.subject} ${message.body}`.toLowerCase();
    const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
    return matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <section className="space-y-6">
      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px_220px]">
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Search inbox
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sender, subject, or message body"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as MessageCategory | "All")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as MessagePriority | "All")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="All">All priorities</option>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title="No saved messages yet"
          description="Analyze a message and save the result to build a local inbox dashboard. Messages are stored in your browser local storage."
          actionHref="/analyze"
          actionLabel="Analyze a message"
        />
      ) : null}

      {messages.length > 0 && filteredMessages.length === 0 ? (
        <EmptyState title="No matching messages" description="Try adjusting your search term, category filter, or priority filter." />
      ) : null}

      {filteredMessages.length > 0 ? (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Sender</th>
                  <th className="px-5 py-4 font-semibold">Subject</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Priority</th>
                  <th className="px-5 py-4 font-semibold">Sentiment</th>
                  <th className="px-5 py-4 font-semibold">Label</th>
                  <th className="px-5 py-4 font-semibold">Confidence</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="align-top transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{message.senderName}</p>
                      <p className="mt-1 text-xs text-slate-500">{message.senderEmail}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4">
                      <p className="font-medium text-slate-900">{message.subject}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{message.body}</p>
                    </td>
                    <td className="px-5 py-4">
                      <CategoryBadge category={message.analysis.category} />
                    </td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={message.analysis.priority} />
                    </td>
                    <td className="px-5 py-4 text-slate-700">{message.analysis.sentiment}</td>
                    <td className="px-5 py-4 text-slate-700">{message.analysis.suggestedLabel}</td>
                    <td className="px-5 py-4 font-semibold text-slate-950">{message.analysis.confidenceScore}%</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/messages/${message.id}`}
                          className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(message.id)}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

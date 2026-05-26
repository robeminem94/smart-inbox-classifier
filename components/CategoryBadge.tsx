import { type MessageCategory } from "@/lib/types";

const categoryStyles: Record<MessageCategory, string> = {
  "Sales Lead": "border-indigo-200 bg-indigo-50 text-indigo-700",
  Support: "border-cyan-200 bg-cyan-50 text-cyan-700",
  "Invoice Question": "border-violet-200 bg-violet-50 text-violet-700",
  Complaint: "border-rose-200 bg-rose-50 text-rose-700",
  Partnership: "border-teal-200 bg-teal-50 text-teal-700",
  Spam: "border-slate-200 bg-slate-100 text-slate-600",
  Other: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

export function CategoryBadge({ category }: { category: MessageCategory }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryStyles[category]}`}>
      {category}
    </span>
  );
}

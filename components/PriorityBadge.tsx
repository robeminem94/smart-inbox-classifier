import { type MessagePriority } from "@/lib/types";

const priorityStyles: Record<MessagePriority, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-sky-200 bg-sky-50 text-sky-700",
  High: "border-amber-200 bg-amber-50 text-amber-700",
  Urgent: "border-red-200 bg-red-50 text-red-700",
};

export function PriorityBadge({ priority }: { priority: MessagePriority }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

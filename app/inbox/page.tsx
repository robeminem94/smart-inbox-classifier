import { InboxTable } from "@/components/InboxTable";

export default function InboxPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Local dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Inbox dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Review saved classifications, filter by business priority, and open full message details. Data is stored in browser local storage.
          </p>
        </div>
      </div>
      <InboxTable />
    </div>
  );
}

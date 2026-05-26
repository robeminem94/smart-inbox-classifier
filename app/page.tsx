import Link from "next/link";

const steps = [
  {
    title: "Paste or receive a message",
    description: "Add a message manually or send one through the inbound webhook endpoint.",
  },
  {
    title: "AI classifies the message",
    description: "OpenAI analyzes the content, sender context, source, sentiment, and business intent.",
  },
  {
    title: "Get a priority, summary, and draft reply",
    description: "Turn messy inbound communication into structured actions your team can use immediately.",
  },
];

const useCases = [
  "Sales leads",
  "Customer support",
  "Invoice questions",
  "Spam detection",
  "Urgent complaints",
  "Partnership requests",
];

const metrics = [
  { label: "Structured fields", value: "12" },
  { label: "Input channels", value: "5" },
  { label: "Webhook ready", value: "Yes" },
];

export default function LandingPage() {
  return (
    <div className="surface-grid">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              AI automation for busy business inboxes
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Smart Inbox Classifier
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Use AI to classify, prioritize, and reply to business messages automatically.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Analyze a Message
              </Link>
              <Link
                href="/settings"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                View webhook example
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-300">Incoming message</p>
                  <p className="mt-1 font-semibold">Vraag over automatisering</p>
                </div>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">High</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">
                “We are a small company and lose time manually copying quote requests. Can you help with automation?”
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-semibold text-slate-950">{metric.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Suggested next action</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Qualify the lead, ask for current workflow details, and create a CRM follow-up task.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft lg:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">From unstructured messages to clear business actions</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Example use cases</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Built for practical automation workflows</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This portfolio project demonstrates AI classification, API routes, webhooks, local persistence, dashboards,
              and reusable full-stack TypeScript patterns.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 h-2 w-12 rounded-full bg-slate-950" />
                <p className="font-semibold text-slate-950">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

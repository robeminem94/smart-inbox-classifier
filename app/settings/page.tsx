import { CopyButton } from "@/components/CopyButton";

const webhookUrl = "http://localhost:3000/api/inbound-message";

const payload = `{
  "senderName": "Mark Jansen",
  "senderEmail": "mark@example.com",
  "subject": "Vraag over automatisering",
  "body": "Wij verliezen veel tijd met handmatig werk...",
  "source": "Website form",
  "businessContext": "AI automation company for small businesses"
}`;

const curlCommand = `curl -X POST http://localhost:3000/api/inbound-message \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderName": "Mark Jansen",
    "senderEmail": "mark@example.com",
    "subject": "Vraag over automatisering",
    "body": "Wij verliezen veel tijd met handmatig werk...",
    "source": "Website form",
    "businessContext": "AI automation company for small businesses"
  }'`;

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Webhook setup</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Settings and example webhook</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this endpoint to connect website forms, Make.com, n8n, Zapier, or custom applications to the same AI classifier logic.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Webhook URL</p>
              <p className="mt-3 rounded-2xl bg-slate-100 px-4 py-3 font-mono text-sm text-slate-800">{webhookUrl}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Replace localhost with your deployed domain after publishing the project.
              </p>
            </div>
            <CopyButton text={webhookUrl} label="Copy URL" />
          </div>
        </section>

        <CodeBlock title="Example JSON payload" code={payload} />
        <CodeBlock title="Example curl command" code={curlCommand} />

        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <p className="font-semibold">Version 1 security note</p>
          <p className="mt-2 text-sm leading-6">
            This webhook intentionally has no authentication for the portfolio demo. Add a shared secret, API key,
            signature validation, or platform-specific verification before using it in production.
          </p>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Integration ideas</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              "Website contact forms",
              "Make.com automation scenarios",
              "n8n workflows",
              "Zapier webhooks",
              "Custom backend services",
              "Lead capture landing pages",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <CopyButton text={code} label="Copy" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </section>
  );
}

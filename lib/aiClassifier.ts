import { type AiClassificationResult, type IncomingMessageInput } from "@/lib/types";
import { normalizeClassificationResult } from "@/lib/validation";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a practical business inbox classification assistant.

Analyze incoming messages for a small business and return only valid JSON in this exact shape:
{
  "category": "Sales Lead | Support | Invoice Question | Complaint | Partnership | Spam | Other",
  "priority": "Low | Medium | High | Urgent",
  "sentiment": "Positive | Neutral | Negative",
  "intent": "",
  "summary": "",
  "suggestedLabel": "",
  "requiresHumanFollowUp": true,
  "confidenceScore": 0,
  "reasoningShort": "",
  "suggestedNextAction": "",
  "draftReply": "",
  "internalNote": "",
  "automationSuggestion": ""
}

Rules:
- Choose exactly one category from: Sales Lead, Support, Invoice Question, Complaint, Partnership, Spam, Other.
- Choose exactly one priority from: Low, Medium, High, Urgent.
- Choose exactly one sentiment from: Positive, Neutral, Negative.
- Keep the output realistic and do not overhype the lead.
- If the message is unclear, say that clearly in the summary and reasoningShort.
- The draft reply must be professional, short, and helpful.
- confidenceScore must be an integer from 0 to 100.
- reasoningShort must explain the classification in 1 or 2 sentences.
- automationSuggestion should be concrete, such as Create CRM lead, Send auto-reply, Assign to sales, Create support ticket, Add invoice label, or Ignore spam.
- Return JSON only. Do not include markdown, comments, or extra text.`;

function extractJson(content: string): unknown {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("AI response did not contain a JSON object.");
    }

    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }
}

const FETCH_TIMEOUT_MS = 30_000;

export async function classifyMessage(input: IncomingMessageInput): Promise<AiClassificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  const response = await fetch(OPENAI_API_URL, {
    signal: controller.signal,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Classify this business message. Return JSON only.\n\n${JSON.stringify(input, null, 2)}`,
        },
      ],
    }),
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed with status ${response.status}: ${details.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return normalizeClassificationResult(extractJson(content));
}

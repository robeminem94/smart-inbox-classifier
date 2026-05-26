import {
  CATEGORIES,
  PRIORITIES,
  SENTIMENTS,
  SOURCE_CHANNELS,
  type AiClassificationResult,
  type IncomingMessageInput,
  type MessageCategory,
  type MessagePriority,
  type MessageSentiment,
  type SourceChannel,
} from "@/lib/types";

type ValidationSuccess = { success: true; data: IncomingMessageInput };
type ValidationFailure = { success: false; errors: string[] };

const MAX_FIELD_LENGTH = 12_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSourceChannel(value: string): value is SourceChannel {
  return SOURCE_CHANNELS.includes(value as SourceChannel);
}

export function validateMessageInput(payload: unknown): ValidationSuccess | ValidationFailure {
  if (!isRecord(payload)) {
    return { success: false, errors: ["Request body must be a JSON object."] };
  }

  const senderName = asTrimmedString(payload.senderName);
  const senderEmail = asTrimmedString(payload.senderEmail);
  const subject = asTrimmedString(payload.subject);
  const body = asTrimmedString(payload.body);
  const source = asTrimmedString(payload.source);
  const businessContext = asTrimmedString(payload.businessContext);
  const errors: string[] = [];

  if (!senderName) errors.push("Sender name is required.");
  if (!senderEmail) errors.push("Sender email is required.");
  if (senderEmail && !isEmail(senderEmail)) errors.push("Sender email must be valid.");
  if (!subject) errors.push("Message subject is required.");
  if (!body) errors.push("Message body is required.");
  if (!source) errors.push("Source channel is required.");
  if (source && !isSourceChannel(source)) {
    errors.push(`Source channel must be one of: ${SOURCE_CHANNELS.join(", ")}.`);
  }

  for (const [label, value] of Object.entries({ senderName, senderEmail, subject, body, businessContext })) {
    if (value.length > MAX_FIELD_LENGTH) {
      errors.push(`${label} is too long.`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      senderName,
      senderEmail,
      subject,
      body,
      source: source as SourceChannel,
      businessContext: businessContext || undefined,
    },
  };
}

function isCategory(value: string): value is MessageCategory {
  return CATEGORIES.includes(value as MessageCategory);
}

function isPriority(value: string): value is MessagePriority {
  return PRIORITIES.includes(value as MessagePriority);
}

function isSentiment(value: string): value is MessageSentiment {
  return SENTIMENTS.includes(value as MessageSentiment);
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function booleanField(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function confidenceField(value: unknown): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

export function normalizeClassificationResult(value: unknown): AiClassificationResult {
  if (!isRecord(value)) {
    throw new Error("AI response was not a JSON object.");
  }

  const category = stringField(value.category);
  const priority = stringField(value.priority);
  const sentiment = stringField(value.sentiment);

  return {
    category: isCategory(category) ? category : "Other",
    priority: isPriority(priority) ? priority : "Medium",
    sentiment: isSentiment(sentiment) ? sentiment : "Neutral",
    intent: stringField(value.intent),
    summary: stringField(value.summary),
    suggestedLabel: stringField(value.suggestedLabel),
    requiresHumanFollowUp: booleanField(value.requiresHumanFollowUp),
    confidenceScore: confidenceField(value.confidenceScore),
    reasoningShort: stringField(value.reasoningShort),
    suggestedNextAction: stringField(value.suggestedNextAction),
    draftReply: stringField(value.draftReply),
    internalNote: stringField(value.internalNote),
    automationSuggestion: stringField(value.automationSuggestion),
  };
}

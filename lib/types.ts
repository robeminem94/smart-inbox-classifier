export const CATEGORIES = [
  "Sales Lead",
  "Support",
  "Invoice Question",
  "Complaint",
  "Partnership",
  "Spam",
  "Other",
] as const;

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export const SENTIMENTS = ["Positive", "Neutral", "Negative"] as const;

export const SOURCE_CHANNELS = ["Email", "Website form", "LinkedIn", "WhatsApp", "Other"] as const;

export type MessageCategory = (typeof CATEGORIES)[number];
export type MessagePriority = (typeof PRIORITIES)[number];
export type MessageSentiment = (typeof SENTIMENTS)[number];
export type SourceChannel = (typeof SOURCE_CHANNELS)[number];

export interface IncomingMessageInput {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  source: SourceChannel;
  businessContext?: string;
}

export interface AiClassificationResult {
  category: MessageCategory;
  priority: MessagePriority;
  sentiment: MessageSentiment;
  intent: string;
  summary: string;
  suggestedLabel: string;
  requiresHumanFollowUp: boolean;
  confidenceScore: number;
  reasoningShort: string;
  suggestedNextAction: string;
  draftReply: string;
  internalNote: string;
  automationSuggestion: string;
}

export interface SavedMessage extends IncomingMessageInput {
  id: string;
  createdAt: string;
  analysis: AiClassificationResult;
}

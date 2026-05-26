import { type AiClassificationResult, type IncomingMessageInput, type SavedMessage } from "@/lib/types";
import { isRecord } from "@/lib/validation";

const STORAGE_KEY = "smart-inbox-classifier-messages";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

let idCounter = 0;

function createId(): string {
  if (isBrowser() && "crypto" in window && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  idCounter += 1;
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function isSavedMessage(value: unknown): value is SavedMessage {
  if (!isRecord(value)) return false;

  const requiredStringFields = ["id", "createdAt", "senderName", "senderEmail", "subject", "body", "source"] as const;
  for (const field of requiredStringFields) {
    const fieldValue = value[field];
    if (typeof fieldValue !== "string" || fieldValue.trim() === "") return false;
  }

  const analysis = value.analysis;
  if (!isRecord(analysis)) return false;

  if (typeof analysis.category !== "string" || analysis.category.trim() === "") return false;

  return true;
}

export function getSavedMessages(): SavedMessage[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedMessage[];
    return Array.isArray(parsed)
      ? parsed.filter(isSavedMessage).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
  } catch {
    return [];
  }
}

export function saveMessage(input: IncomingMessageInput, analysis: AiClassificationResult): SavedMessage {
  const savedMessage: SavedMessage = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
    analysis,
  };

  const messages = getSavedMessages();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([savedMessage, ...messages]));
  return savedMessage;
}

export function getSavedMessageById(id: string): SavedMessage | undefined {
  return getSavedMessages().find((message) => message.id === id);
}

export function deleteSavedMessage(id: string): void {
  if (!isBrowser()) return;
  const nextMessages = getSavedMessages().filter((message) => message.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMessages));
}

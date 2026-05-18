import type { ChatSession, ChatSessionDateGroup } from "@/types/chatSession";

const STORAGE_KEY = "chat_sessions";

function readRaw(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function listChatSessions(): ChatSession[] {
  return readRaw().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function upsertChatSession(session: ChatSession) {
  const sessions = readRaw();
  const index = sessions.findIndex((s) => s.threadId === session.threadId);
  if (index >= 0) {
    sessions[index] = { ...sessions[index], ...session };
  } else {
    sessions.push(session);
  }
  writeRaw(sessions);
}

export function removeChatSession(threadId: string) {
  writeRaw(readRaw().filter((s) => s.threadId !== threadId));
}

function toDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  const todayKey = toDateKey(Date.now());
  const yesterdayKey = toDateKey(Date.now() - 86_400_000);
  if (dateKey === todayKey) return "今天";
  if (dateKey === yesterdayKey) return "昨天";
  const [y, m, d] = dateKey.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function groupChatSessionsByDate(sessions: ChatSession[]): ChatSessionDateGroup[] {
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  const map = new Map<string, ChatSession[]>();

  for (const session of sorted) {
    const key = toDateKey(session.updatedAt);
    const group = map.get(key);
    if (group) {
      group.push(session);
    } else {
      map.set(key, [session]);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupSessions]) => ({
      dateKey,
      dateLabel: formatDateLabel(dateKey),
      sessions: groupSessions,
    }));
}

export function sessionTitleFromMessage(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "新对话";
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

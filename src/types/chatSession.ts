export interface ChatSession {
  threadId: string;
  title: string;
  preview?: string;
  updatedAt: number;
}

export interface ChatSessionDateGroup {
  dateKey: string;
  dateLabel: string;
  sessions: ChatSession[];
}

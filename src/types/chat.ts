/**
 * 聊天相关类型定义
 */

export type MessageRole = "user" | "assistant" | "system";

export type MessageContentPart =
  | { type: "text"; text: string }
  | { type: "image"; url: string };

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  contentParts?: MessageContentPart[];
  imageUrl?: string;
  timestamp: number;
  loading?: boolean;
  streaming?: boolean;
}

export interface Recipe {
  title: string;
  score?: number;
  reason?: string;
  difficulty?: string;
  url?: string;
  steps?: string[];
  seasonings?: string[];
  cooking_time?: string;
}

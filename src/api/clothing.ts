import { bunApi, pyApi } from "../utils/requestGenerator";
import { pyRequestUrl } from "../utils/pyApiPrefix";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { streamChatNew } from "@/utils/streamChatNew";
export const updateKnowledgeBase = async (data: { filepath: string }) => {
  const response = await bunApi.post("/knowledgeBase/update", data);
  return response;
};

export type ConsultStreamOptions = {
  signal?: AbortSignal;
  onError?: (error: Error) => void;
  onComplete?: () => void;
};

/**
 * 与后端 clothing consult 一致：每帧 data 为 json.dumps(单字符) 或 {"done": true}。
 * fetchEventSource 的 ev.data 是原始行内容，需 JSON.parse 才能得到「我」而非字面量 "我"。
 */
function parseConsultSsePayload(data: string):
  | { kind: "text"; value: string }
  | { kind: "done" }
  | { kind: "ignore" } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return { kind: "ignore" };
  }
  if (
    parsed !== null &&
    typeof parsed === "object" &&
    "done" in parsed &&
    (parsed as { done: unknown }).done === true
  ) {
    return { kind: "done" };
  }
  if (typeof parsed === "string") return { kind: "text", value: parsed };
  return { kind: "ignore" };
}

/** 解析 /consult 的 SSE：data 为 JSON 字符串（单字）或 {"done": true} */
function decodeConsultSse(buffer: string): {
  chunks: string[];
  rest: string;
  done: boolean;
} {
  const chunks: string[] = [];
  let rest = buffer;
  let done = false;
  while (true) {
    const idx = rest.indexOf("\n\n");
    if (idx === -1) break;
    const eventBlock = rest.slice(0, idx);
    rest = rest.slice(idx + 2);
    const dataLines = eventBlock
      .split("\n")
      .map((l) => l.trimEnd())
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice("data:".length).trimStart());
    if (dataLines.length === 0) continue;
    const data = dataLines.join("\n");
    const parsed = parseConsultSsePayload(data);
    if (parsed.kind === "done") {
      done = true;
      continue;
    }
    if (parsed.kind === "text") chunks.push(parsed.value);
  }
  return { chunks, rest, done };
}

export const consultKnowledgeBaseStream = (
  data: { question: string; signal?: AbortSignal },
  onChunk: (chunk: string) => void,
) => {
  const { signal, question } = data;
  return streamChatNew(
    "/py/api/v1/clothing/consult",
    { question },
    onChunk,
    signal ? { signal } : undefined,
  );
};

/** Bun /chat/consult：gRPC 流式透传为 SSE，与 clothing consult 帧格式一致 */
export async function chatConsultStream(
  data: { question: string; signal?: AbortSignal },
  onChunk: (chunk: string) => void,
): Promise<void> {
  return streamChatNew(
    "/api/chat/consult",
    { question: data.question },
    onChunk,
    data.signal ? { signal: data.signal } : undefined,
  );
}

/**
 * /consult 为 text/event-stream（SSE）。
 * POST + Bearer 无法用浏览器 EventSource，故用 fetch 读流并自行按帧解析。
 */
export async function consultKnowledgeBaseStreamOld(
  question: string,
  onChunk: (chunk: string) => void,
  options?: ConsultStreamOptions
): Promise<void> {
  const token = localStorage.getItem("access_token");
  // const url = pyRequestUrl("/api/v1/clothing/consult")
  const url = '/py/api/v1/clothing/consult'
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ question }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const err = new Error(`咨询请求失败: HTTP ${res.status}`);
    options?.onError?.(err);
    throw err;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    const err = new Error("无法读取响应流");
    options?.onError?.(err);
    throw err;
  }

  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { chunks, rest, done: sseDone } = decodeConsultSse(buffer);
      buffer = rest;
      for (const c of chunks) onChunk(c);
      if (sseDone) break;
    }
    buffer += decoder.decode();
    const { chunks, done: sseDone } = decodeConsultSse(buffer);
    for (const c of chunks) onChunk(c);
    if (!sseDone) {
      // 流结束但未收到 done 帧时仍视为完成（兼容代理截断等）
    }
    options?.onComplete?.();
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    options?.onError?.(err);
    throw err;
  }
}

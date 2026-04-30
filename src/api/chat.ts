import { bunApi } from "../utils/requestGenerator";

type StreamChatParams = {
  message: string;
  threadId: string;
  imageFile?: File;
  imageUrl?: string;
  signal?: AbortSignal;
};

type StreamChatHandlers = {
  onChunk: (chunk: string) => void;
  onError?: (err: Error) => void;
  onDone?: () => void;
};

// 统一走 Bun 网关（/api -> vite proxy -> bun -> gRPC -> python）
const gatewayApiBase = "/api";

export const uploadImageToOss = async (_file: File) => {
  // 当前版本：直接走 /chat/stream 支持 File 上传，不再强依赖 OSS。
  // 如果后续需要 OSS 上传，请在这里实现并返回 url。
  throw new Error("uploadImageToOss 暂未实现");
};

function decodeSseOrRawText(buffer: string): { chunks: string[]; rest: string; done: boolean } {
  // 兼容两种后端：
  // 1) 纯文本分块（直接把模型 token/chunk 写出来）
  // 2) SSE（data: xxx\n\n），可能还有 [DONE]
  const out: string[] = [];
  let rest = buffer;
  let done = false;

  // SSE 事件以 \n\n 分隔
  while (true) {
    const idx = rest.indexOf("\n\n");
    if (idx === -1) break;
    const eventBlock = rest.slice(0, idx);
    rest = rest.slice(idx + 2);

    const lines = eventBlock.split("\n");
    const dataLines = lines
      .map((l) => l.trimEnd())
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice("data:".length).trimStart());

    if (dataLines.length === 0) {
      // 不是 SSE，则把整个 block 当做普通文本
      out.push(eventBlock);
      continue;
    }

    const data = dataLines.join("\n");
    if (data === "[DONE]") {
      done = true;
      continue;
    }
    out.push(data);
  }

  return { chunks: out, rest, done };
}

export async function streamChatNew(
  params: StreamChatParams,
  handlers: StreamChatHandlers
): Promise<void> {
  const url = `${gatewayApiBase}/chat/stream`;
  const { onChunk, onError, onDone } = handlers;

  try {
    // Bun /chat/stream 当前只接收 JSON（与 proto 字段一致：image_url/thread_id）
    // 如需本地文件上传，请先走 OSS 上传拿到 imageUrl 再传给后端。
    if (params.imageFile && !params.imageUrl) {
      throw new Error("当前不支持直接上传本地图片；请先上传获得 imageUrl 后再发起对话。");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      message: params.message,
      thread_id: params.threadId,
      image_url: params.imageUrl ?? "",
    });

    const resp = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: params.signal,
      credentials: "include",
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`streamChat 请求失败：${resp.status} ${resp.statusText}${text ? ` - ${text}` : ""}`);
    }

    if (!resp.body) {
      throw new Error("streamChat 响应不支持流式读取（resp.body 为空）");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const { chunks, rest, done: sseDone } = decodeSseOrRawText(buffer);
      buffer = rest;
      for (const c of chunks) {
        if (c) onChunk(c);
      }
      if (sseDone) break;
    }

    // 如果最后残留一些非 SSE 文本，直接输出
    if (buffer.trim()) onChunk(buffer);

    onDone?.();
  } catch (e: any) {
    const err = e instanceof Error ? e : new Error(String(e));
    onError?.(err);
    if (!onError) throw err;
  }
}

export const clearChatHistory = (threadId: string) => {
  return bunApi.delete("/chat/messages", {
    params: {
      thread_id: threadId,
    },
  });
};
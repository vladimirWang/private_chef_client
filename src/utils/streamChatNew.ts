import { fetchEventSource } from "@microsoft/fetch-event-source";

export type StreamChatNewOptions = {
  signal?: AbortSignal;
};

export async function streamChatNew<T>(
  url: string,
  data: T,
  onChunk: (chunk: string) => void,
  options?: StreamChatNewOptions,
): Promise<void> {
  const token = localStorage.getItem("access_token");

  await fetchEventSource(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: options?.signal,
    async onopen(response) {
      if (!response.ok) {
        throw new Error(`咨询请求失败: HTTP ${response.status}`);
      }
    },
    onmessage(ev) {
      try {
        const parsed = JSON.parse(ev.data);
        console.log("parsed", ev.data, parsed);
        if (typeof parsed === "string") {
          onChunk(parsed);
        } else if (typeof parsed === "object" && parsed !== null) {
          if ("done" in parsed) {
            // 服务端结束帧；连接随后由服务端关闭
          } else {
            onChunk(parsed as never);
          }
        }
      } catch (error) {
        console.error("流式数据异常: ", error);
      }
    },
    onclose() {
      console.log("onclose");
    },
    onerror(err) {
      throw err;
    },
  });
}

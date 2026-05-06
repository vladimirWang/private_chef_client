import type { ConsultStreamOptions } from "@/api/clothing";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export async function streamChatNew<T>(
    url: string,
    data: T,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("access_token");
  
      fetchEventSource(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // signal: options?.signal,
        async onopen(response) {
          if (!response.ok) {
            const err = new Error(`咨询请求失败: HTTP ${response.status}`);
            reject(err)
          }
        },
        onmessage(ev) {
          try {
            const parsed = JSON.parse(ev.data);
            console.log("parsed", ev.data , parsed);
            if (typeof parsed === 'string') {
              onChunk(parsed);
            } else if (typeof parsed === 'object') {
              if ('done' in parsed) {
                resolve()
              } else {
                onChunk(parsed)
              }
            }
          } catch (error) {
            console.error("流式数据异常: ", error);
            // onChunk(ev.data)
            
          }
        },
        onclose() {
          // onStreamClosed();
          console.log("onclose");
          resolve()
        },
        onerror(err) {
          reject(err)
        },
      });
    })
  }
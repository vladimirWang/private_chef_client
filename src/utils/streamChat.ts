const API_BASE = "http://localhost:8001";

export async function streamChat(
    message: string,
    onChunk: (chunk: string) => void,
    image_url?: string,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    threadId?: string
): Promise<void> {
    try {
        // const url = new URL(`/py/api/v1/chat/stream`);
        const url2 = `/py/api/v1/chat/stream`

        const response = await fetch(url2, {
            method: "POST",
            body: JSON.stringify({
                message,
                image_url: image_url,
                thread_id: threadId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("请求失败");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("无法读取响应流");
        }

        const decoder = new TextDecoder();

        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                onComplete?.();
                break;
            }

            const chunk = decoder.decode(value, {stream: true});
            onChunk(chunk);
        }
    } catch (error) {
        onError?.(error as Error);
    }
}
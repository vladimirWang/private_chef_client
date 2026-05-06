const API_BASE = "http://localhost:8001";

export async function streamChat(
    message: string,
    onChunk: (chunk: string) => void,
    image_url?: string,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    threadId?: string
): Promise<void> {
    const d = {message, image_url, threadId}
    // {"message":"这是我冰箱里的食物，帮我看看能做什么佳肴？","image_url":"http://localhost:3000/static/uploaded/1777945328752-f51813ac-__.jpeg","threadId":"c663ddff-e7b1-412f-9f9c-2e343b41fdea"}
    console.log("streamChat", JSON.stringify(d));
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
                'Accept': 'text/event-stream',
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
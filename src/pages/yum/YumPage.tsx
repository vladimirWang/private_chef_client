import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import type { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { uploadFile } from "../../api/util";
import {
  getChatMessages,
  type ApiChatHistoryMessage,
  yumChatStream,
} from "../../api/chat";
import { generateUUID } from "@/utils/common";
import {
  sessionTitleFromMessage,
  upsertChatSession,
} from "@/utils/chatSessions";
import { Plus, Menu, User } from "lucide-react";
import { streamChat } from "@/utils/streamChat";
import { streamChatNew } from "@/utils/streamChatNew";
import { consultKnowledgeBaseStream, updateKnowledgeBase, chatConsultStream } from "@/api/clothing";
import { Input, Button, Popup } from "antd-mobile";
import Drawer from "./Drawer";

const robotPng = new URL('../assets/robot.gif', import.meta.url).href
const userPng = new URL('../assets/user.webp', import.meta.url).href
console.log("---robotPng---", robotPng)

const CONTENT_MAX_PX = 896;
const INPUT_BAR_HEIGHT_PX = 56;

function historyToMessages(history: ApiChatHistoryMessage[]): Message[] {
  return history
    .filter((m) => (m.content ?? "").trim())
    .map((m, index) => ({
      id: `history_${m.id}`,
      role: (["user", "assistant", "system"].includes(m.role)
        ? m.role
        : "assistant") as Message["role"],
      content: m.content,
      timestamp: m.created_at_ms,
        // m.created_at_ms ?? m.createdAtMs ?? Date.now() - (history.length - index),
    }));
}

export default function YumPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [threadId, setThreadId] = useState<string>(() => {
    let storedThreadId = localStorage.getItem("thread_id");
    if (!storedThreadId) {
      storedThreadId = generateUUID();
      localStorage.setItem("thread_id", storedThreadId);
    }
    return storedThreadId;
  });

  const [questionLoading, setQuestionLoading] = useState(false);
  const consultStreamAbortRef = useRef<AbortController | null>(null);
  const yumStreamAbortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  // "我体重160斤，尺码推荐"
  const [question, setQuestion] = useState<undefined | string>();

  const [result, setResult] = useState<null | string>(null);

  const persistCurrentSession = useCallback(() => {
    if (messages.length === 0) return;
    const firstUser = messages.find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const previewText =
      lastAssistant?.content?.trim() ?? firstUser?.content?.trim() ?? "";
    upsertChatSession({
      threadId,
      title: sessionTitleFromMessage(firstUser?.content ?? "新对话"),
      preview: previewText.length > 60 ? `${previewText.slice(0, 60)}…` : previewText,
      updatedAt: Date.now(),
    });
  }, [messages, threadId]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      if (sessionId === threadId) {
        setMenuOpen(false);
        return;
      }
      persistCurrentSession();
      consultStreamAbortRef.current?.abort();
      consultStreamAbortRef.current = null;
      yumStreamAbortRef.current?.abort();
      yumStreamAbortRef.current = null;
      setProcessing(false);
      setQuestionLoading(false);
      setQuestion(undefined);
      localStorage.setItem("thread_id", sessionId);
      setThreadId(sessionId);
      setMessages([]);
      messageIdCounter.current = 0;
      setMenuOpen(false);
    },
    [threadId, persistCurrentSession],
  );

  const handleNewChat = useCallback(() => {
    setMenuOpen(false);

    persistCurrentSession();

    consultStreamAbortRef.current?.abort();
    consultStreamAbortRef.current = null;
    yumStreamAbortRef.current?.abort();
    yumStreamAbortRef.current = null;

    setProcessing(false);
    setQuestionLoading(false);
    setQuestion(undefined);
    setResult(null);

    const newThreadId = generateUUID();
    localStorage.setItem("thread_id", newThreadId);
    setThreadId(newThreadId);
    setMessages([]);
    messageIdCounter.current = 0;
    setHistoryLoading(false);
  }, [persistCurrentSession]);

  const handleLogout = async () => {
    // 预留：对接登出接口后跳转登录
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const { messages: history } = await getChatMessages(threadId);
        if (cancelled) return;
        if (!history?.length) {
          setMessages([]);
          messageIdCounter.current = 0;
          return;
        }
        const loaded = historyToMessages(history);
        messageIdCounter.current = loaded.length;
        setMessages(loaded);
      } catch (error) {
        console.error("加载历史消息失败:", error);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };
    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    messageIdCounter.current += 1;
    const newMessage: Message = {
      ...message,
      id: `msg_${messageIdCounter.current}_${Date.now()}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };
  const handleSend2 = async () => {
    const imageUrl = "https://private-chef-0424.oss-cn-beijing.aliyuncs.com/1777537901884-ca421154-fridge_food.png";
    await yumChatStream({ message: "这是我冰箱里的食物，帮我看看能做什么佳肴？", image_url: imageUrl, thread_id: threadId }, (chunk) => {
      console.log("chunk", chunk);
    });
  }
  const handleSend = async (text: string, file?: File) => {
    if (processing) return;

    let imageUrl: string | undefined;
    const messageText =
      text?.trim() || (file ? "这是我冰箱里的食物，帮我看看能做什么佳肴？" : "");
    if (!messageText && !file) return;

    if (file) {
      try {
        const uploadResponse = await uploadFile(file);
        imageUrl = uploadResponse.url;
        console.log("imageUrl 0: ", imageUrl);
      } catch (error) {
        console.error("图片上传失败:", error);
        addMessage({
          role: "assistant",
          content: "图片上传失败，请稍后重试。",
        });
        return;
      }
    }
    console.log("imageUrl 1: ", imageUrl);

    const userText = text || "上传了一张食材图片";
    addMessage({
      role: "user",
      content: userText,
      imageUrl,
    });

    upsertChatSession({
      threadId,
      title: sessionTitleFromMessage(messageText || userText),
      preview: userText,
      updatedAt: Date.now(),
    });

    setProcessing(true);
    yumStreamAbortRef.current?.abort();
    yumStreamAbortRef.current = new AbortController();
    const yumController = yumStreamAbortRef.current;
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;

    try {
      await yumChatStream(
        {
          message: text || "这是我冰箱里的食物，帮我看看能做什么佳肴？",
          image_url: imageUrl,
          thread_id: threadId,
        },
        (chunk) => {
        console.log("chunk", chunk);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
        },
        { signal: yumController.signal },
      );
      console.log("yumChatStream done");
    } catch (error) {
      const aborted =
        error instanceof DOMException && error.name === "AbortError";
      if (!aborted) {
        console.error("聊天失败:", error);
      }
      // setMessages((prev) =>
      //   prev.map((msg) =>
      //     msg.id === assistantMessageId ? { ...msg, streaming: false } : msg
      //   )
      // );
    } finally {
      if (yumStreamAbortRef.current === yumController) {
        yumStreamAbortRef.current = null;
      }
      setProcessing(false);
      setMessages((prev) => {
        const firstUser = prev.find((m) => m.role === "user");
        const lastAssistant = [...prev].reverse().find((m) => m.role === "assistant");
        if (firstUser || lastAssistant) {
          const preview = lastAssistant?.content?.trim() ?? firstUser?.content ?? "";
          upsertChatSession({
            threadId,
            title: sessionTitleFromMessage(firstUser?.content ?? "AI 对话"),
            preview: preview.length > 60 ? `${preview.slice(0, 60)}…` : preview,
            updatedAt: Date.now(),
          });
        }
        return prev;
      });
    }
  };

  const stopConsultStream = useCallback(() => {
    consultStreamAbortRef.current?.abort();
    setQuestionLoading(false);
  }, []);

  const onConsult = async () => {
    const trimmed = question?.trim();
    if (!trimmed) return;

    consultStreamAbortRef.current?.abort();
    consultStreamAbortRef.current = new AbortController();
    const controller = consultStreamAbortRef.current;
    const { signal } = controller;

    setQuestionLoading(true);
    setQuestion("");
    const q = trimmed;
    addMessage({
      role: "user",
      content: q,
    });
    upsertChatSession({
      threadId,
      title: sessionTitleFromMessage(q),
      preview: q,
      updatedAt: Date.now(),
    });
    console.log("start");
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;
    try {
      await chatConsultStream({ question: q, session_id: threadId, signal }, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, streaming: false } : msg
        );
        const lastAssistant = updated.find((m) => m.id === assistantMessageId);
        const preview = lastAssistant?.content?.trim() ?? "";
        if (preview) {
          upsertChatSession({
            threadId,
            title: sessionTitleFromMessage(q),
            preview: preview.length > 60 ? `${preview.slice(0, 60)}…` : preview,
            updatedAt: Date.now(),
          });
        }
        return updated;
      });
      console.log("complete");
    } catch (error) {
      const aborted =
        error instanceof DOMException && error.name === "AbortError";
      if (!aborted) {
        console.error("咨询失败:", error);
      }
    } finally {
      if (consultStreamAbortRef.current === controller) {
        consultStreamAbortRef.current = null;
      }
      setQuestionLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#e9e9e9",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Drawer
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        activeSessionId={threadId}
        handleNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="打开菜单"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200"
        >
          <Menu size={22} strokeWidth={2} aria-hidden />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-slate-900">
          美食助手
        </h1>
        <button
          type="button"
          onClick={handleNewChat}
          aria-label="新建会话"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--adm-color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--adm-color-primary)_18%,transparent)] active:bg-[color-mix(in_srgb,var(--adm-color-primary)_28%,transparent)]"
        >
          <Plus size={20} strokeWidth={2} aria-hidden />
        </button>
      </header>
      <section
        style={{
          flex: 1,
          overflowY: "auto",
          background: "white",
          padding: 10,
          paddingBottom: INPUT_BAR_HEIGHT_PX + 24,
        }}
      >
        {historyLoading ? (
          <p className="py-3 text-center text-sm text-gray-500">加载对话中…</p>
        ) : messages.length === 0 ? (
          <p className="py-3 text-center text-sm text-gray-500">
            暂无对话，输入问题开始咨询
          </p>
        ) : (
          messages.map((message) => {
            return (
              <div key={message.id} style={{marginBottom: 20}}>
                {
                  message.role === 'assistant' ?
                  <>
                    {/* <div style={{width: '100%', display: "flex", justifyContent: 'start'}}>
                      <Image width={60} src={robotPng}/>
                    </div> */}
                    <article className="max-w-[360px] rounded-lg bg-gray-100 p-2">
                      <p className="max-w-[min(720px,100%)] whitespace-pre-wrap text-base">
                        {message.content}
                        {message.streaming ? "▍" : null}
                      </p>
                    </article>
                  </>
                  :
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                    }}
                  >
                    {/* <Image width={60} src={userPng} /> */}
                    <article
                      className="max-w-[min(720px,100%)] rounded-lg bg-[var(--adm-color-primary)] p-2 text-[var(--adm-color-text)]"
                    >
                      <p className="whitespace-pre-wrap text-right text-base text-[var(--adm-color-text)]">
                        {message.content}
                      </p>
                    </article>
                  </div>
                }

              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </section>
      {/* {questionLoading ? (
        <article style={{ fontSize: 14, color: "gray", padding: "4px 20px", flexShrink: 0 }}>
          正在回复…
        </article>
      ) : null} */}
      <section className="fixed bottom-0 left-0 right-0 w-full py-1 px-3 pb-4">
        <div className="rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.38)] bg-white" style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, display: 'flex', gap: 10, 
          // position: 'fixed', bottom: 10, left: 0, right: 0, width: '100%'
        }}>
          <Input style={{flex: 1}} value={question} onChange={(value) => {
            // console.log("e", e.currentTarget)
            setQuestion(value)
          }}/>
          {
            questionLoading ? 
            <div onClick={stopConsultStream}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <rect x="6" y="6" width="12" height="12" fill="#333" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div> :
            <Button loading={questionLoading} onClick={onConsult} color="primary" disabled={question?.trim() === ''}>
            咨询
            </Button>
          }
        </div>
      </section>
    </div>
  );
}

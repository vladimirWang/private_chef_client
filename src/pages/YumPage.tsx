import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import type { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { uploadFile } from "../api/util";
import {
  clearChatHistory,
  getChatMessages,
  type ApiChatHistoryMessage,
  yumChatStream,
} from "../api/chat";
import { generateUUID } from "@/utils/common";
import {
  sessionTitleFromMessage,
  upsertChatSession,
} from "@/utils/chatSessions";
import { UtensilsCrossed, Plus, Menu, User, Bold } from "lucide-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { streamChat } from "@/utils/streamChat";
import { streamChatNew } from "@/utils/streamChatNew";
import { homeCardSurfaceSx, pageShellSx } from "@/theme/homeChrome";
import { consultKnowledgeBaseStream, updateKnowledgeBase, chatConsultStream } from "@/api/clothing";
import TextField from "@mui/material/TextField";
import {Input, Button, Image} from 'antd-mobile'
import {SearchOutline} from 'antd-mobile-icons'

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  // "我体重160斤，尺码推荐"
  const [question, setQuestion] = useState<undefined | string>();

  const [result, setResult] = useState<null | string>(null);

  const handleNewChat = async () => {
    setMenuOpen(false);
    if (threadId) {
      try {
        await clearChatHistory(threadId);
      } catch (error) {
        console.error("清空历史失败:", error);
      }
    }
    const newThreadId = generateUUID();
    localStorage.setItem("thread_id", newThreadId);
    setThreadId(newThreadId);
    setMessages([]);
    messageIdCounter.current = 0;
  };

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
        const { messages: history } = await getChatMessages();
        if (cancelled || !history?.length) return;
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
  }, []);

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
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;

    try {
      await yumChatStream({ message: text || "这是我冰箱里的食物，帮我看看能做什么佳肴？", image_url:imageUrl, thread_id: threadId }, (chunk) => {
        console.log("chunk", chunk);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
      console.log("yumChatStream done");
    } catch (error) {
      console.error("聊天失败:", error);
      // setMessages((prev) =>
      //   prev.map((msg) =>
      //     msg.id === assistantMessageId ? { ...msg, streaming: false } : msg
      //   )
      // );
    } finally {
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
    console.log("start");
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;
    try {
      await chatConsultStream({ question: q, signal }, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, streaming: false } : msg
        )
      );
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
      // setQuestionLoading(false);
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
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.45)" } },
          paper: {
            sx: {
              width: { xs: "min(88vw, 320px)", sm: 320 },
              height: "100%",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            height: "100%",
          }}
          role="presentation"
        >
          <Box sx={{ flex: 1, overflow: "auto", py: 2, minHeight: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ px: 2, pb: 1, color: "text.secondary" }}
            >
              菜单
            </Typography>
            <Divider />
            <List disablePadding>
              <ListItemButton
                onClick={() => {
                  void handleNewChat();
                }}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Plus size={20} />
                </ListItemIcon>
                <ListItemText primary="新建会话" />
              </ListItemButton>
            </List>
          </Box>
          <Divider />
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            <Avatar
              alt=""
              sx={{
                width: 40,
                height: 40,
                bgcolor: "grey.200",
                color: "grey.700",
              }}
            >
              <User size={22} strokeWidth={1.75} />
            </Avatar>
            <Button
              fill="solid"
              size="mini"
              color="primary"
              onClick={() => {
                void handleLogout();
              }}
            >
              退出登录
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* <Box
        sx={{
          pt: 2,
          px: 2,
          pb: 1,
          maxWidth: CONTENT_MAX_PX,
          width: "100%",
          mx: "auto",
          flexShrink: 0,
        }}
      >
        <Card elevation={0} sx={{ ...homeCardSurfaceSx }}>
          <CardContent
            sx={{
              py: 1.25,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:last-child": { pb: 1.25 },
            }}
          >
            <IconButton
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <Menu size={22} strokeWidth={2} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flex: 1, textAlign: "center", fontWeight: 700 }}
            >
              美食助手
            </Typography>
            <Button
              type="button"
              variant="contained"
              size="small"
              onClick={() => void handleNewChat()}
              sx={{ minWidth: 40, px: 1 }}
              aria-label="新建会话"
            >
              <Plus size={18} />
            </Button>
          </CardContent>
        </Card>
      </Box> */}
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
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>
            加载对话中…
          </Typography>
        ) : messages.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>
            暂无对话，输入问题开始咨询
          </Typography>
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
                    <article className="bg-gray-200 max-w-[360px] rounded-lg p-2">
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", alignSelf: "stretch", maxWidth: "min(720px, 100%)" }}>
                        {message.content}
                        {message.streaming ? "▍" : null}
                      </Typography>
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
                    <article style={{ maxWidth: "min(720px, 100%)" }} className="bg-emerald-300 rounded-lg p-2">
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap", textAlign: "right" }}
                      >
                        {message.content}
                      </Typography>
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
        <div className="rounded-lg shadow-[0_0_24px_rgba(0,0,0,0.38)]" style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, display: 'flex', gap: 10, 
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

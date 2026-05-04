import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { uploadFile } from "../api/util";
import { streamChatNew, clearChatHistory } from "../api/chat";
import { generateUUID } from "@/utils/common";
// import { apiUrl } from "@/lib/appOrigin";
import { UtensilsCrossed, Plus, Menu, User } from "lucide-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { streamChat } from "@/utils/streamChat";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

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
    // try {
    //   await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
    // } catch {
    //   // 仍跳转登录页
    // }
    // setMenuOpen(false);
    // navigate("/login", { replace: true });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    addMessage({
      role: "user",
      content: text || "上传了一张食材图片",
      imageUrl,
    });

    setProcessing(true)
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;

    const controller = new AbortController();
    console.log("imageUrl 2: ", imageUrl);
    try {
      await streamChat(
          text || "这是我冰箱里的食物，帮我看看能做什么佳肴？",
          (chunk) => {
              // 更新消息内容
              setMessages((prev) =>
                  prev.map((msg) =>
                      msg.id === assistantMessageId
                          ? {...msg, content: msg.content + chunk}
                          : msg
                  )
              );
          }, imageUrl,
          (error) => {
              console.error("聊天失败:", error);
              setMessages((prev) =>
                  prev.map((msg) =>
                      msg.id === assistantMessageId
                          ? {
                              ...msg,
                              content: msg.content + `\n[错误]: ${error.message}`,
                              streaming: false,
                          }
                          : msg
                  )
              );
          },
          () => {
              // 流式输出完成
              setMessages((prev) =>
                  prev.map((msg) =>
                      msg.id === assistantMessageId
                          ? {...msg, streaming: false}
                          : msg
                  )
              );
          },
          threadId
      );
  } finally {
      setProcessing(false);
  }
  };

  return (
    <div className="min-h-screen relative">
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
              type="button"
              variant="outlined"
              color="inherit"
              fullWidth
              size="medium"
              onClick={() => {
                void handleLogout();
              }}
              sx={{
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "text.secondary",
                  bgcolor: "action.hover",
                },
              }}
            >
              退出登录
            </Button>
          </Box>
        </Box>
      </Drawer>

      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-white/50 px-4 sm:px-6 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="shrink-0 p-2 -ml-1 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              aria-label="打开菜单"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
            <div className="text-center">
              <span className="text-xl font-bold text-center">美食助手</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleNewChat()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      <div className="relative flex flex-col min-h-screen max-w-4xl mx-auto px-4 pt-12 pb-24">
        <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-3">
                <div className="p-4 bg-white/80 rounded-full mb-4">
                  <UtensilsCrossed size={48} className="text-orange-400" />
                </div>
                <p className="text-lg font-medium text-gray-600">上传食材图片开始吧</p>
                <p className="text-sm mt-2 text-gray-400">我会帮您识别食材并推荐食谱</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
          <ChatInput onSend={handleSend} disabled={processing} />
        </div>
      </div>
    </div>
  );
}

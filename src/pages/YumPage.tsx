import { useState, useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { uploadFile } from "../api/util";
import { clearChatHistory } from "../api/chat";
import { generateUUID } from "@/utils/common";
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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { streamChat } from "@/utils/streamChat";
import { homeCardSurfaceSx, pageShellSx } from "@/theme/homeChrome";

const CONTENT_MAX_PX = 896;

export default function YumPage() {
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
    // 预留：对接登出接口后跳转登录
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

    setProcessing(true);
    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      streaming: true,
    }).id;

    try {
      await streamChat(
        text || "这是我冰箱里的食物，帮我看看能做什么佳肴？",
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        },
        imageUrl,
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
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, streaming: false } : msg
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
    <Box
      sx={{
        ...pageShellSx,
        display: "flex",
        flexDirection: "column",
        position: "relative",
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

      <Box
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
      </Box>

      <Box
        sx={{
          flex: 1,
          maxWidth: CONTENT_MAX_PX,
          mx: "auto",
          width: "100%",
          px: 2,
          pt: 2,
          pb: 24,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          elevation={0}
          sx={{
            ...homeCardSurfaceSx,
            flex: 1,
            minHeight: { xs: "50vh", sm: 420 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              "&:last-child": { pb: 2 },
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "background.default",
                    mb: 2,
                    display: "flex",
                  }}
                >
                  <UtensilsCrossed
                    size={48}
                    strokeWidth={1.5}
                    color="currentColor"
                    style={{ color: "var(--mui-palette-primary-main)" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  上传食材图片开始吧
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  我会帮您识别食材并推荐食谱
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            maxWidth: CONTENT_MAX_PX,
            mx: "auto",
            pointerEvents: "auto",
          }}
        >
          <Card elevation={0} sx={{ ...homeCardSurfaceSx }}>
            <ChatInput onSend={handleSend} disabled={processing} />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import type { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { uploadFile } from "../api/util";
import { clearChatHistory, yumChatStream } from "../api/chat";
import { generateUUID } from "@/utils/common";
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
import { consultKnowledgeBaseStream, updateKnowledgeBase } from "@/api/clothing";
import TextField from "@mui/material/TextField";
import {Input, Button, Image} from 'antd-mobile'
import {SearchOutline} from 'antd-mobile-icons'

const robotPng = new URL('../assets/robot.gif', import.meta.url).href
const userPng = new URL('../assets/user.webp', import.meta.url).href
console.log("---robotPng---", robotPng)

const CONTENT_MAX_PX = 896;

export default function YumPage() {
  const [messages, setMessages] = useState<Message[]>([
    // {"role": "assistant", "content": "robot 是英语名词，核心释义包含三类：1.由计算机控制的自动化机械设备（如工业机器人、手术机器人），2.形容机械般缺乏情感的人（含贬义），3.在南非英语中专指交通信号灯 [2] [4-5]。该词源自捷克语“robota”（意为“苦役”）或“robotnik”（意为“农奴”），由捷克作家卡雷尔·恰佩克于1921年在其剧作《罗素姆万能机器人》中引入英语并流行开来 [12-15]。该词英美发音存在差异，英国音标为/ˈrəʊ.bɒt/，美国音标为/ˈroʊ.bɑːt/，分解发音包含/r/、/əʊ/或/oʊ/等音素组合 [1] [4]。其复数形式为robots，派生词包含robotic（形容词）和robotics（机器人技术） [3] [6]。在应用场景中，既涵盖汽车制造、医疗手术等工业领域，也延伸至科幻文学与人工智能伦理探讨 [3] [5]。其发展历程中的重要节点包括1939年世博会首次展出机器人Elektro，1973年诞生首台真人大小的拟人机器人WABOT-1，以及阿西莫夫提出机器人三定律、图灵提出图灵测试等 [14]。2025年前后，人形机器人领域受到关注，中国是相关市场的主要参与者之一；《人形机器人"}
  ]);
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
  const [question, setQuestion] = useState<undefined | string>("我体重160斤，尺码推荐");

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
    const oldMessageLength = messages.length;
    try {
      await consultKnowledgeBaseStream(
        { question: q, signal },
        (chunk) => {
          if (oldMessageLength === messages.length) {
            addMessage({
              role: "assistant",
              content: chunk,
            });
          } else {
            setMessages((messages) =>
              messages.map((item, idx) =>
                idx !== messages.length - 1 ? (
                  item
                ) : (
                  {
                    id: `msg_${messageIdCounter.current}_${Date.now()}`,
                    timestamp: Date.now(),
                    role: "assistant",
                    content: item.content + chunk,
                  }
                ),
              ),
            );
          }
        },
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
      setQuestionLoading(false);
    }
  };

  return (
    <div style={{background: '#e9e9e9', height: '100vh'}}> 
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
      {
        messages.length> 0 ? <section style={{background: 'white', padding: 10}}>
        {
          messages.map((message, idx) => {
            return (
              <div key={idx} style={{marginBottom: 20}}>
                {
                  message.role === 'assistant' ?
                  <>
                    <div style={{width: '100%', display: "flex", justifyContent: 'start'}}>
                      <Image width={60} src={robotPng}/>
                    </div>
                    <article>
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", alignSelf: "stretch", maxWidth: "min(720px, 100%)" }}>
                        {message.content}
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
                    <Image width={60} src={userPng} />
                    <article style={{ maxWidth: "min(720px, 100%)" }}>
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
        }
      </section>: null
      }
      {
        questionLoading? <article style={{fontSize: 18, color: 'gray', fontWeight: 'bold', padding: 5,paddingLeft: 20}}>loading...</article> : null
      }
      <div style={{background: 'white', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, display: 'flex', gap: 10, position: 'fixed', bottom: 10, left: 0, right: 0, width: '100%'}}>
        <Input style={{flex: 1}} value={question} onChange={(value) => {
          // console.log("e", e.currentTarget)
          setQuestion(value)
        }}/>
        {
          questionLoading ? 
          <Button aria-label="停止生成" onClick={stopConsultStream}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <rect x="3" y="3" width="18" height="18" fill="black" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button> :
          <Button loading={questionLoading} onClick={onConsult} color="primary" disabled={question?.trim() === ''}>
          咨询
          </Button>
          }
          </div>
    </div>
  );
}

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DotLoading, Empty, List } from "antd-mobile";
import { AddOutline, MessageOutline } from "antd-mobile-icons";
import { getChatMessages } from "@/api/chat";
import type { ChatSession } from "@/types/chatSession";
import { isMockThreadId, mergeWithMockSessions } from "@/mocks/chatSessions";
import {
  groupChatSessionsByDate,
  listChatSessions,
  sessionTitleFromMessage,
  upsertChatSession,
} from "@/utils/chatSessions";

async function syncSessionFromServer(threadId: string): Promise<ChatSession | null> {
  try {
    const { messages } = await getChatMessages(threadId);
    if (!messages?.length) return null;
    const firstUser = messages.find((m) => m.role === "user");
    const last = messages[messages.length - 1];
    const title = sessionTitleFromMessage(firstUser?.content ?? "AI 对话");
    const previewText = last?.content?.trim() ?? "";
    const preview =
      previewText.length > 60 ? `${previewText.slice(0, 60)}…` : previewText;
    const session: ChatSession = {
      threadId,
      title,
      preview: preview || undefined,
      updatedAt: Date.now(),
    };
    upsertChatSession(session);
    return session;
  } catch {
    return null;
  }
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    mergeWithMockSessions(listChatSessions()),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      let list = listChatSessions();
      const activeThreadId = localStorage.getItem("thread_id");
      if (activeThreadId && !list.some((s) => s.threadId === activeThreadId)) {
        await syncSessionFromServer(activeThreadId);
        list = listChatSessions();
      }
      if (!cancelled) {
        setSessions(mergeWithMockSessions(list));
        setLoading(false);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => groupChatSessionsByDate(sessions), [sessions]);

  const openSession = (threadId: string) => {
    if (isMockThreadId(threadId)) {
      navigate("/yum");
      return;
    }
    localStorage.setItem("thread_id", threadId);
    navigate("/yum");
  };

  const goToYum = () => {
    navigate("/yum");
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>对话</h1>
        <Button
          color="primary"
          size="small"
          onClick={goToYum}
          style={{ "--border-radius": "20px" } as CSSProperties}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <AddOutline />
            去聊天
          </span>
        </Button>
      </header>

      {loading ? (
        <div style={centerStyle}>
          <DotLoading color="primary" />
          <span style={{ marginTop: 8, color: "#999", fontSize: 14 }}>加载中…</span>
        </div>
      ) : groups.length === 0 ? (
        <div style={centerStyle}>
          <Empty
            style={{ padding: "24px 0" }}
            image={<MessageOutline style={{ fontSize: 48, color: "#ccc" }} />}
            description="暂无聊天记录"
          />
          {/* <Button color="primary" onClick={goToYum} style={{ marginTop: 16 }}>
            开始与 AI 对话
          </Button> */}
        </div>
      ) : (
        <div style={{ paddingBottom: 16 }}>
          {groups.map((group) => (
            <section key={group.dateKey} style={{ marginBottom: 8 }}>
              <div style={dateLabelStyle}>{group.dateLabel}</div>
              <List style={{ "--border-top": "none", "--border-bottom": "none" } as CSSProperties}>
                {group.sessions.map((session) => (
                  <List.Item
                    key={session.threadId}
                    clickable
                    onClick={() => openSession(session.threadId)}
                    description={
                      session.preview ? (
                        <span>
                          {isMockThreadId(session.threadId) && (
                            <span style={mockTagStyle}>演示</span>
                          )}
                          {session.preview}
                        </span>
                      ) : undefined
                    }
                    arrow
                  >
                    {session.title}
                  </List.Item>
                ))}
              </List>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f5f5f5",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 16px 8px",
  background: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
};

const dateLabelStyle: CSSProperties = {
  padding: "12px 16px 6px",
  fontSize: 13,
  color: "#888",
  fontWeight: 500,
};

const centerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 48,
};

const mockTagStyle: CSSProperties = {
  display: "inline-block",
  marginRight: 6,
  padding: "0 6px",
  fontSize: 11,
  lineHeight: "18px",
  color: "#1677ff",
  background: "#e6f4ff",
  borderRadius: 4,
  verticalAlign: "middle",
};

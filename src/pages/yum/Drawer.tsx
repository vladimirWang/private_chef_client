import { useEffect, useMemo, useState } from "react";
import { Popup, DotLoading, Empty, Button } from "antd-mobile";
import { MessageOutline } from "antd-mobile-icons";
import { Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getChatSessions, type ApiChatSessionItem } from "@/api/chat";
import type { ChatSession } from "@/types/chatSession";
import {
  groupChatSessionsByDate,
  listChatSessions,
  upsertChatSession,
} from "@/utils/chatSessions";
import { sleep } from "@/utils/common";

interface DrawerProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  activeSessionId: string;
  handleNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
}

function apiSessionsToChatSessions(items: ApiChatSessionItem[]): ChatSession[] {
  return items.map((item) => ({
    threadId: item.session_id,
    title: item.title,
    preview: item.preview,
    updatedAt: item.updated_at_ms,
  }));
}

export default function Drawer(props: DrawerProps) {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen, activeSessionId, handleNewChat, onSelectSession } = props;
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    let cancelled = false;
    const loadSessions = async () => {
      setSessionsLoading(true);
      try {
        const { sessions: remote } = await getChatSessions();
        if (cancelled) return;
        const mapped = apiSessionsToChatSessions(remote ?? []);
        mapped.forEach(upsertChatSession);
        setSessions(mapped);
      } catch (error) {
        console.error("加载会话列表失败:", error);
        if (!cancelled) {
          setSessions(listChatSessions());
        }
      } finally {
        if (!cancelled) setSessionsLoading(false);
      }
    };

    void loadSessions();
    return () => {
      cancelled = true;
    };
  }, [menuOpen]);

  const groups = useMemo(() => groupChatSessionsByDate(sessions), [sessions]);

  return (
    <Popup
      position="left"
      visible={menuOpen}
      onMaskClick={() => setMenuOpen(false)}
      onClose={() => setMenuOpen(false)}
      bodyStyle={{
        width: "min(88vw, 320px)",
        height: "100vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex h-full min-h-0 flex-col bg-white" role="presentation">
        <div className="min-h-0 flex-1 overflow-auto py-4">
          <p className="px-4 pb-2 text-xs font-medium text-slate-500">对话历史</p>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100"
          >
            <Plus size={20} strokeWidth={2} />
            <span className="text-sm font-medium">新建会话</span>
          </button>
          <div className="my-1 h-px bg-slate-200" />
          {sessionsLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
              <DotLoading color="primary" />
              <span className="text-xs">加载中…</span>
            </div>
          ) : groups.length === 0 ? (
            <Empty
              style={{ padding: "16px 0" }}
              image={<MessageOutline style={{ fontSize: 40, color: "#ccc" }} />}
              description="暂无历史对话"
            />
          ) : (
            groups.map((group) => (
              <section key={group.dateKey}>
                <p className="px-4 pb-1 pt-3 text-xs font-medium text-slate-400">
                  {group.dateLabel}
                </p>
                <ul className="list-none p-0 m-0">
                  {group.sessions.map((session) => {
                    const isActive = session.threadId === activeSessionId;
                    return (
                      <li key={session.threadId}>
                        <button
                          type="button"
                          onClick={() => onSelectSession(session.threadId)}
                          className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-slate-50 active:bg-slate-100 ${
                            isActive ? "bg-emerald-50" : ""
                          }`}
                        >
                          <span
                            className={`truncate text-sm font-medium ${
                              isActive ? "text-emerald-800" : "text-slate-800"
                            }`}
                          >
                            {session.title}
                          </span>
                          {session.preview ? (
                            <span className="truncate text-xs text-slate-500">
                              {session.preview}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
              <User size={22} strokeWidth={1.75} aria-hidden />
            </div>
            <Button
              fill="solid"
              size="mini"
              color="primary"
              onClick={async () => {
                localStorage.removeItem("access_token");
                await sleep(1000);
                navigate("/landing/login");
              }}
            >
              退出登录
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
